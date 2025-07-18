import mongoose from "mongoose";
import SKU from "../models/sku.enhanced.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import Transaction from "../models/transaction.js";
import Inventory from "../models/inventory.js";
import Promo from "../models/promo.js";

/**
 * Enhanced Order Controller với Race Condition Protection
 */

const MAX_RETRIES = 3;

/**
 * Tạo order với full race condition protection
 */
export const createOrderWithRaceProtection = async (req, res) => {
    let retryCount = 0;
    
    while (retryCount < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { items, promoCode } = req.body;
            const userId = req.user.id;

            // 1. Validate input
            if (!items || !Array.isArray(items) || items.length === 0) {
                throw new Error("Items array is required and cannot be empty");
            }

            // 2. Process promo code if provided
            let discount = 1;
            let promo = null;
            if (promoCode) {
                promo = await Promo.findOne({
                    code: promoCode.toUpperCase(),
                    isDeleted: false,
                    maximumUse: { $gt: 0 },
                    expiresAt: { $gt: new Date() }
                }).session(session);

                if (!promo) {
                    throw new Error("Mã promo không hợp lệ hoặc đã hết hạn");
                }
                discount = (100 - promo.discount) / 100;
            }

            // 3. Get and validate SKUs with versions for optimistic locking
            const skuIds = items.map(item => item.skuId);
            const skus = await SKU.find({ _id: { $in: skuIds } }).session(session);
            
            if (skus.length !== skuIds.length) {
                throw new Error("Some SKUs not found");
            }

            // 4. Validate stock availability and calculate total
            let total = 0;
            const orderItems = [];
            const skuUpdates = [];

            for (const item of items) {
                const sku = skus.find(s => s._id.toString() === item.skuId);
                if (!sku) {
                    throw new Error(`SKU not found: ${item.skuId}`);
                }

                if (!sku.canReserve(item.quantity)) {
                    throw new Error(`Insufficient stock for SKU: ${sku.name}`);
                }

                const itemTotal = sku.price * item.quantity * discount;
                total += itemTotal;

                orderItems.push({
                    sku: sku._id,
                    quantity: item.quantity,
                    price: sku.price
                });

                skuUpdates.push({
                    skuId: sku._id,
                    quantity: item.quantity,
                    price: sku.price,
                    expectedVersion: sku.__v
                });
            }

            // 5. Check user balance
            const user = await User.findById(userId).session(session);
            if (!user) {
                throw new Error("User not found");
            }
            
            if (user.balance < total) {
                throw new Error("Insufficient balance");
            }

            // 6. Reserve stock atomically (this prevents race conditions)
            for (const update of skuUpdates) {
                await SKU.reserveStock(update.skuId, update.quantity, session);
            }

            // 7. Create order
            const [order] = await Order.create([{
                buyer: new mongoose.Types.ObjectId(userId),
                items: orderItems,
                total,
                status: 'processing',
                paymentStatus: 'completed'
            }], { session });

            // 8. Update user balance
            await User.findByIdAndUpdate(userId, {
                $inc: { balance: -total }
            }).session(session);

            // 9. Process inventory and update seller balances
            const credentialsList = [];
            const sellerBalanceMap = new Map();

            for (const item of orderItems) {
                // Get available inventory
                const inventories = await Inventory.find({
                    sku: item.sku,
                    status: 'available',
                    isDeleted: false
                }).limit(item.quantity).session(session);

                if (inventories.length < item.quantity) {
                    throw new Error(`Not enough inventory for SKU: ${item.sku}`);
                }

                // Update inventory status
                await Inventory.updateMany(
                    { _id: { $in: inventories.map(inv => inv._id) } },
                    { status: 'sold', order: order._id }
                ).session(session);

                // Calculate seller revenue
                inventories.forEach(inv => {
                    const sellerId = inv.seller.toString();
                    const currentBalance = sellerBalanceMap.get(sellerId) || 0;
                    sellerBalanceMap.set(sellerId, currentBalance + (item.price * discount));
                });

                // Collect credentials
                credentialsList.push({
                    skuId: item.sku,
                    accounts: inventories.map(inv => inv.credentials)
                });

                // Confirm stock reduction (move from reserved to sold)
                await SKU.confirmStockReduction(
                    item.sku, 
                    item.quantity, 
                    item.price, 
                    session
                );
            }

            // 10. Update seller balances
            const sellerUpdatePromises = Array.from(sellerBalanceMap.entries()).map(
                ([sellerId, revenue]) =>
                    User.findByIdAndUpdate(sellerId, {
                        $inc: { balance: revenue }
                    }).session(session)
            );
            await Promise.all(sellerUpdatePromises);

            // 11. Update order to completed
            await Order.findByIdAndUpdate(order._id, {
                status: 'completed'
            }).session(session);

            // 12. Update promo usage with optimistic locking
            if (promo) {
                const promoUpdateResult = await Promo.findOneAndUpdate({
                    _id: promo._id,
                    __v: promo.__v,
                    isDeleted: false,
                    maximumUse: { $gt: 0 }
                }, {
                    $inc: { maximumUse: -1, __v: 1 }
                }, { session });

                if (!promoUpdateResult) {
                    throw new Error("OPTIMISTIC_LOCK_CONFLICT");
                }
            }

            // 13. Create transaction record
            await Transaction.create([{
                user: userId,
                order: order._id,
                amount: total,
                type: 'purchase',
                status: 'completed'
            }], { session });

            await session.commitTransaction();

            return res.status(200).json({
                errCode: 0,
                message: 'Order created successfully',
                data: {
                    orderId: order._id,
                    total,
                    originalTotal: total / discount,
                    discount: promo ? promo.discount : 0,
                    promoCode: promo ? promo.code : null,
                    credentials: credentialsList
                }
            });

        } catch (error) {
            await session.abortTransaction();
            
            // Retry logic for specific conflicts
            if (
                (error.message === 'OPTIMISTIC_LOCK_CONFLICT' || 
                 error.message.includes('WriteConflict') ||
                 error.code === 11000) && 
                retryCount < MAX_RETRIES - 1
            ) {
                retryCount++;
                console.log(`Conflict detected, retrying (${retryCount}/${MAX_RETRIES})`);
                
                // Exponential backoff with jitter
                const delay = Math.pow(2, retryCount) * 100 + Math.floor(Math.random() * 100);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            return res.status(500).json({
                errCode: 1,
                message: error.message || 'Order creation failed'
            });
        } finally {
            session.endSession();
        }
    }

    return res.status(500).json({
        errCode: 1,
        message: 'Maximum retry attempts exceeded due to high contention'
    });
};

/**
 * Cancel order với race condition protection
 */
export const cancelOrderWithRaceProtection = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        // 1. Find and validate order
        const order = await Order.findOne({
            _id: orderId,
            buyer: userId,
            status: { $in: ['pending', 'processing'] }
        }).session(session);

        if (!order) {
            throw new Error("Order not found or cannot be cancelled");
        }

        // 2. Release reserved stock for each item
        for (const item of order.items) {
            await SKU.releaseReservedStock(item.sku, item.quantity, session);
        }

        // 3. Refund user balance if payment completed
        if (order.paymentStatus === 'completed') {
            await User.findByIdAndUpdate(userId, {
                $inc: { balance: order.total }
            }).session(session);

            // 4. Create refund transaction
            await Transaction.create([{
                user: userId,
                order: orderId,
                amount: order.total,
                type: 'refund',
                status: 'completed'
            }], { session });
        }

        // 5. Update order status
        await Order.findByIdAndUpdate(orderId, {
            status: 'canceled'
        }).session(session);

        // 6. Update inventory status back to available
        await Inventory.updateMany(
            { order: orderId },
            { status: 'available', order: null }
        ).session(session);

        await session.commitTransaction();

        return res.status(200).json({
            errCode: 0,
            message: 'Order cancelled successfully',
            data: { orderId, refundAmount: order.total }
        });

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({
            errCode: 1,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

/**
 * Update inventory với stock reservation
 */
export const updateInventoryWithReservation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { skuId, quantity, operation } = req.body; // operation: 'add' | 'remove'
        const sellerId = req.user.id;

        // 1. Validate SKU ownership
        const sku = await SKU.findOne({ _id: skuId })
            .populate('product', 'seller')
            .session(session);

        if (!sku || sku.product.seller.toString() !== sellerId) {
            throw new Error('SKU not found or unauthorized');
        }

        // 2. Update stock based on operation
        let stockDelta = operation === 'add' ? quantity : -quantity;
        
        const updatedSku = await SKU.updateStockSafely(
            skuId, 
            stockDelta, 
            sku.__v, 
            session
        );

        await session.commitTransaction();

        return res.status(200).json({
            errCode: 0,
            message: 'Stock updated successfully',
            data: {
                skuId: updatedSku._id,
                newStock: updatedSku.stock,
                availableStock: updatedSku.getAvailableStock()
            }
        });

    } catch (error) {
        await session.abortTransaction();
        
        if (error.message === 'OPTIMISTIC_LOCK_CONFLICT') {
            return res.status(409).json({
                errCode: 1,
                message: 'Stock was modified by another process. Please refresh and try again.'
            });
        }

        return res.status(500).json({
            errCode: 1,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};
