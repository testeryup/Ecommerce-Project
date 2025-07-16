import Inventory from '../models/inventory.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import SKU from '../models/sku.js'
import SubscriptionService from '../services/subscriptionService.js';
import mongoose from 'mongoose';

// Upload inventory với hỗ trợ subscription
export const uploadInventory = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId, skuId, accountsList, accountType = 'subscription' } = req.body;
        const sellerId = req.user.id;

        // Validate input
        if (!productId || !skuId || !Array.isArray(accountsList) || accountsList.length === 0) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input data'
            });
        }

        // Convert IDs to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const skuObjectId = new mongoose.Types.ObjectId(skuId);
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

        // Verify product and SKU
        const sku = await SKU.findOne({
            _id: skuObjectId,
            product: productObjectId
        })
            .populate('product', 'seller')
            .session(session);

        if (!sku || sku.product.seller.toString() !== sellerObjectId.toString()) {
            throw new Error('SKU not found or unauthorized');
        }

        // Prepare inventory data based on account type
        const inventoryData = accountsList.map(account => {
            const baseData = {
                sku: skuObjectId,
                seller: sellerObjectId,
                accountType: accountType,
                status: 'available',
                autoReset: {
                    enabled: accountType === 'subscription',
                    resetCount: 0
                }
            };

            if (accountType === 'subscription') {
                baseData.credentials = {
                    username: account.username,
                    password: account.password,
                    email: account.email || '',
                    additionalInfo: account.notes || ''
                };
            } else if (accountType === 'key') {
                baseData.credentials = {
                    key: account.key,
                    additionalInfo: account.notes || ''
                };
            } else {
                baseData.credentials = {
                    key: account.license || account.key,
                    additionalInfo: account.notes || ''
                };
            }

            if (account.notes) {
                baseData.notes = account.notes;
            }

            return baseData;
        });

        // Update stock and create inventory entries
        await Promise.all([
            SKU.updateOne(
                { _id: skuObjectId },
                { $inc: { stock: accountsList.length } }
            ).session(session),

            Inventory.insertMany(inventoryData, { session })
        ]);

        await session.commitTransaction();

        res.status(200).json({
            errCode: 0,
            message: 'Inventory uploaded successfully',
            data: {
                uploadedCount: accountsList.length,
                accountType: accountType
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error uploading inventory:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    } finally {
        session.endSession();
    }
};

// Lấy danh sách inventory với thông tin subscription
export const getInventory = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || 'all';
        const accountType = req.query.accountType || 'all';
        const search = req.query.search || '';

        const matchCondition = {
            seller: new mongoose.Types.ObjectId(sellerId),
            isDeleted: false
        };

        if (status !== 'all') {
            matchCondition.status = status;
        }

        if (accountType !== 'all') {
            matchCondition.accountType = accountType;
        }

        if (search) {
            matchCondition.$or = [
                { 'credentials.username': { $regex: search, $options: 'i' } },
                { 'credentials.key': { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
        }

        const totalItems = await Inventory.countDocuments(matchCondition);

        const inventory = await Inventory.find(matchCondition)
            .populate('sku', 'name subscriptionInfo')
            .populate('currentSubscription.buyer', 'username email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            errCode: 0,
            message: 'Get inventory successfully',
            data: {
                inventory,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalItems / limit),
                    totalItems,
                    itemsPerPage: limit
                }
            }
        });

    } catch (error) {
        console.error('Error getting inventory:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    }
};

// Gia hạn subscription
export const renewSubscription = async (req, res) => {
    try {
        const { accountId, additionalDays, orderId } = req.body;
        const sellerId = req.user.id;

        // Verify ownership
        const account = await Inventory.findOne({
            _id: accountId,
            seller: sellerId
        });

        if (!account) {
            return res.status(404).json({
                errCode: 1,
                message: 'Account not found or unauthorized'
            });
        }

        const renewedAccount = await SubscriptionService.renewAccount(accountId, additionalDays, orderId);

        res.status(200).json({
            errCode: 0,
            message: 'Subscription renewed successfully',
            data: renewedAccount
        });

    } catch (error) {
        console.error('Error renewing subscription:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    }
};

// Reset password thủ công
export const resetAccountPassword = async (req, res) => {
    try {
        const { accountId } = req.params;
        const sellerId = req.user.id;

        // Verify ownership
        const account = await Inventory.findOne({
            _id: accountId,
            seller: sellerId
        });

        if (!account) {
            return res.status(404).json({
                errCode: 1,
                message: 'Account not found or unauthorized'
            });
        }

        const result = await SubscriptionService.manualPasswordReset(accountId);

        res.status(200).json({
            errCode: 0,
            message: 'Password reset successfully',
            data: {
                newPassword: result.newPassword,
                resetCount: result.account.autoReset.resetCount
            }
        });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    }
};

// Lấy thống kê subscription
export const getSubscriptionStats = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const stats = await SubscriptionService.getSubscriptionStats(sellerId);

        res.status(200).json({
            errCode: 0,
            message: 'Get subscription stats successfully',
            data: stats
        });

    } catch (error) {
        console.error('Error getting subscription stats:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    }
};

// Lấy danh sách tài khoản sắp hết hạn
export const getExpiringSoon = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const hours = parseInt(req.query.hours) || 24;

        const expiring = await Inventory.findExpiringSoon(hours);
        
        // Filter by seller
        const filteredExpiring = expiring.filter(account => 
            account.seller.toString() === sellerId
        );

        res.status(200).json({
            errCode: 0,
            message: 'Get expiring accounts successfully',
            data: filteredExpiring
        });

    } catch (error) {
        console.error('Error getting expiring accounts:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    }
};

// Legacy functions for backward compatibility
export const getInventoryBySkuId = async (req, res) => {
    try {
        const { skuId } = req.params;
        const { userId, role } = req.user;

        // Build the query
        let query = { sku: skuId };
        
        // If user is seller, only show their inventory
        if (role === 'seller') {
            query.seller = userId;
        }

        const inventoryItems = await Inventory.find(query)
            .populate('sku', 'name price')
            .populate('product', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            errCode: 0,
            message: 'Get inventory successfully',
            data: inventoryItems
        });

    } catch (error) {
        console.error('Error getting inventory by SKU ID:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    }
};

export const deleteInventoryById = async (req, res) => {
    try {
        const { inventoryId } = req.body;
        const { userId, role } = req.user;

        if (!inventoryId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Inventory ID is required'
            });
        }

        // Find the inventory item
        const inventoryItem = await Inventory.findById(inventoryId);
        
        if (!inventoryItem) {
            return res.status(404).json({
                errCode: 1,
                message: 'Inventory item not found'
            });
        }

        // Check if user has permission to delete this item
        if (role === 'seller' && inventoryItem.seller.toString() !== userId) {
            return res.status(403).json({
                errCode: 1,
                message: 'You do not have permission to delete this inventory item'
            });
        }

        // Check if item is currently being used in an active subscription
        if (inventoryItem.currentSubscription && inventoryItem.currentSubscription.status === 'active') {
            return res.status(400).json({
                errCode: 1,
                message: 'Cannot delete inventory item with active subscription'
            });
        }

        await Inventory.findByIdAndDelete(inventoryId);

        res.status(200).json({
            errCode: 0,
            message: 'Inventory item deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting inventory:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message || 'Internal server error'
        });
    }
};