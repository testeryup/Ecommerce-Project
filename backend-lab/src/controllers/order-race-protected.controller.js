import mongoose from "mongoose";
import SKU from "../models/sku.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import Transaction from "../models/transaction.js";
import Inventory from "../models/inventory.js";
import Promo from "../models/promo.js";
import {
    DistributedLock,
    OptimisticLockingHelper,
    TransactionHelper,
    AtomicStockManager
} from "../middlewares/race-condition.middleware.js";

/**
 * Enhanced Order Controller with comprehensive race condition protection
 */

export const createOrderWithRaceProtection = async (req, res) => {
    const startTime = Date.now();
    const { items, promoCode } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            errCode: 1,
            message: "Items array is required and cannot be empty"
        });
    }

    // Create unique order key for distributed locking
    const orderKey = `order:${userId}:${Date.now()}`;
    const skuIds = items.map(item => item.skuId);
    const resourceKey = `skus:${skuIds.sort().join(',')}`;
    
    let orderLock, resourceLock;
    
    try {
        // Acquire distributed locks
        orderLock = new DistributedLock(`user:order:${userId}`, 10000);
        resourceLock = new DistributedLock(resourceKey, 15000);
        
        await Promise.all([
            orderLock.waitForLock(),
            resourceLock.waitForLock()
        ]);

        // Execute order creation with optimistic locking and retries
        const result = await OptimisticLockingHelper.executeWithRetry(
            async (attempt) => {
                return await TransactionHelper.executeWithTransaction(
                    async (session) => {
                        return await processOrderCreation(
                            { items, promoCode, userId },
                            session,
                            attempt,
                            startTime
                        );
                    },
                    {
                        maxRetries: 3,
                        maxTimeMS: 20000
                    }
                );
            },
            3, // max retries
            200 // base delay
        );

        return res.status(200).json({
            errCode: 0,
            message: 'Order created successfully',
            data: result,
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        console.error(`Order creation error for user ${userId}:`, error);
        
        // Handle specific error types
        if (error.message.includes('Insufficient stock')) {
            return res.status(409).json({
                errCode: 1,
                message: error.message,
                errorType: 'STOCK_INSUFFICIENT'
            });
        }
        
        if (error.message.includes('Insufficient balance')) {
            return res.status(400).json({
                errCode: 1,
                message: error.message,
                errorType: 'BALANCE_INSUFFICIENT'
            });
        }
        
        if (error.message.includes('Lock acquisition timeout')) {
            return res.status(429).json({
                errCode: 1,
                message: 'System is busy, please try again later',
                errorType: 'SYSTEM_BUSY'
            });
        }

        return res.status(500).json({
            errCode: 1,
            message: 'Failed to create order',
            errorType: 'INTERNAL_ERROR'
        });
        
    } finally {
        // Always release locks
        if (orderLock) await orderLock.release();
        if (resourceLock) await resourceLock.release();
    }
};

async function processOrderCreation(orderData, session, attempt, startTime) {
    const { items, promoCode, userId } = orderData;
    
    // Validate and process promo code
    let discount = 1;
    let promo = null;
    
    if (promoCode) {
        const promoResult = await processPromoCode(promoCode, session);
        discount = promoResult.discount;
        promo = promoResult.promo;
    }

    // Validate items and calculate totals
    const { orderItems, total, skus } = await validateAndCalculateOrder(items, discount, session);
    
    // Check user balance
    const user = await User.findById(userId).session(session);
    if (!user) {
        throw new Error("User not found");
    }
    
    if (user.balance < total) {
        throw new Error("Insufficient balance");
    }

    // Reserve stock atomically
    let stockReservations;
    try {
        stockReservations = await AtomicStockManager.reserveStock(
            items.map(item => ({ skuId: item.skuId, quantity: item.quantity })),
            session
        );
    } catch (error) {
        throw new Error(`Stock reservation failed: ${error.message}`);
    }

    // Create order
    const [order] = await Order.create([{
        buyer: new mongoose.Types.ObjectId(userId),
        items: orderItems,
        total,
        status: 'processing',
        paymentStatus: 'completed',
        promoCode: promo?.code || null,
        discount: promo?.discount || 0,
        processingAttempt: attempt,
        processingTime: Date.now() - startTime
    }], { session });

    // Update user balance
    await User.findByIdAndUpdate(userId, {
        $inc: { balance: -total }
    }).session(session);

    // Process inventory and assign credentials
    const credentialsList = await assignCredentials(orderItems, order._id, session);

    // Update seller balances
    await updateSellerBalances(credentialsList, orderItems, session);

    // Confirm stock reservations (convert reserved to sold)
    await AtomicStockManager.confirmReservations(stockReservations, session);

    // Update promo usage if applicable
    if (promo) {
        await Promo.findByIdAndUpdate(promo._id, {
            $inc: { maximumUse: -1 }
        }).session(session);
    }

    // Update order status to completed
    await Order.findByIdAndUpdate(order._id, {
        status: 'completed'
    }).session(session);

    // Create transaction record
    const [transaction] = await Transaction.create([{
        user: userId,
        order: order._id,
        amount: total,
        type: 'purchase',
        status: 'completed'
    }], { session });

    return {
        orderId: order._id,
        total,
        discount: promo?.discount || 0,
        credentials: credentialsList,
        transactionId: transaction._id,
        processingAttempt: attempt
    };
}

async function processPromoCode(promoCode, session) {
    if (!/^[A-Z0-9]{3,20}$/.test(promoCode.toUpperCase())) {
        throw new Error("Invalid promo code format");
    }

    const promo = await Promo.findOne({
        code: promoCode.toUpperCase(),
        isDeleted: false,
        maximumUse: { $gt: 0 },
        expiresAt: { $gt: new Date() }
    }).select('_id code maximumUse discount __v').session(session);

    if (!promo) {
        throw new Error("Invalid or expired promo code");
    }

    if (!promo.discount || promo.discount <= 0) {
        throw new Error("Promo code has no valid discount value");
    }

    return {
        promo,
        discount: (100 - promo.discount) / 100
    };
}

async function validateAndCalculateOrder(items, discount, session) {
    // Validate items format
    for (const item of items) {
        if (!item.skuId || !item.quantity || item.quantity <= 0) {
            throw new Error(`Invalid item: skuId and positive quantity are required`);
        }
        if (!mongoose.Types.ObjectId.isValid(item.skuId)) {
            throw new Error(`Invalid SKU ID format: ${item.skuId}`);
        }
        if (!Number.isInteger(item.quantity) || item.quantity > 1000) {
            throw new Error(`Invalid quantity for SKU ${item.skuId}: must be integer between 1-1000`);
        }
    }

    const skuIds = items.map(item => item.skuId);
    
    // Fetch SKUs with optimistic locking
    const skus = await SKU.find({
        _id: { $in: skuIds },
        isDeleted: false
    }).select('_id name price stock reserved __v').session(session);

    const skuMap = new Map(skus.map(sku => [sku._id.toString(), sku]));
    let total = 0;
    const orderItems = [];

    for (const item of items) {
        const sku = skuMap.get(item.skuId);
        if (!sku) {
            throw new Error(`SKU not found: ${item.skuId}`);
        }

        // Check available stock (total stock - reserved stock)
        const availableStock = sku.stock - (sku.reserved || 0);
        if (availableStock < item.quantity) {
            throw new Error(`Insufficient stock for SKU: ${item.skuId}. Available: ${availableStock}, Requested: ${item.quantity}`);
        }

        const itemTotal = sku.price * item.quantity * discount;
        total += itemTotal;

        orderItems.push({
            sku: sku._id,
            quantity: item.quantity,
            price: sku.price,
            discountedPrice: sku.price * discount
        });
    }

    return { orderItems, total, skus };
}

async function assignCredentials(orderItems, orderId, session) {
    const credentialsList = [];

    for (const item of orderItems) {
        const inventories = await Inventory.find({
            sku: item.sku,
            status: 'available',
            isDeleted: false
        }).limit(item.quantity).session(session);

        if (inventories.length < item.quantity) {
            throw new Error(`Not enough inventory for SKU: ${item.sku}`);
        }

        // Update inventory status atomically
        await Inventory.updateMany(
            { _id: { $in: inventories.map(inv => inv._id) } },
            {
                status: 'sold',
                order: orderId,
                soldAt: new Date()
            },
            { session }
        );

        credentialsList.push({
            skuId: item.sku,
            quantity: item.quantity,
            accounts: inventories.map(inv => ({
                credentials: inv.credentials,
                seller: inv.seller
            }))
        });
    }

    return credentialsList;
}

async function updateSellerBalances(credentialsList, orderItems, session) {
    const sellerBalanceMap = new Map();

    // Calculate seller revenues
    for (let i = 0; i < credentialsList.length; i++) {
        const credentials = credentialsList[i];
        const orderItem = orderItems[i];

        for (const account of credentials.accounts) {
            const sellerId = account.seller.toString();
            const revenue = orderItem.discountedPrice || orderItem.price;
            const currentBalance = sellerBalanceMap.get(sellerId) || 0;
            sellerBalanceMap.set(sellerId, currentBalance + revenue);
        }
    }

    // Update seller balances atomically
    const sellerUpdates = Array.from(sellerBalanceMap.entries()).map(([sellerId, amount]) =>
        User.findByIdAndUpdate(sellerId, {
            $inc: { balance: amount }
        }).session(session)
    );

    await Promise.all(sellerUpdates);
}

// Existing methods with race condition improvements
export const createOrderWithOptimisticLocking = async (req, res) => {
    // Redirect to the new enhanced method
    return createOrderWithRaceProtection(req, res);
};

// Health check endpoint for race condition middleware
export const getRaceConditionStats = async (req, res) => {
    try {
        const stats = {
            timestamp: new Date().toISOString(),
            activeConnections: mongoose.connection.readyState,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime()
        };

        res.status(200).json({
            errCode: 0,
            message: 'Race condition protection is active',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }
};

export default {
    createOrderWithRaceProtection,
    createOrderWithOptimisticLocking,
    getRaceConditionStats
};
