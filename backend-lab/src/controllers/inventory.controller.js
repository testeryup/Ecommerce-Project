import Inventory from '../models/inventory.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import SKU from '../models/sku.js'
import mongoose from 'mongoose';
import {
    DistributedLock,
    TransactionHelper,
    OptimisticLockingHelper
} from '../middlewares/race-condition.middleware.js';

export const uploadInventory = async (req, res) => {
    const { productId, skuId, credentialsList } = req.body;
    const sellerId = req.user.id;

    // Validate input
    if (!productId || !skuId || !Array.isArray(credentialsList) || credentialsList.length === 0) {
        return res.status(400).json({
            errCode: 1,
            message: 'Invalid input data'
        });
    }

    // Create distributed lock for SKU
    const lock = new DistributedLock(`sku:inventory:${skuId}`, 10000);
    
    try {
        await lock.waitForLock();
        
        const result = await OptimisticLockingHelper.executeWithRetry(
            async (attempt) => {
                return await TransactionHelper.executeWithTransaction(
                    async (session) => {
                        // Convert IDs to ObjectId
                        const productObjectId = new mongoose.Types.ObjectId(productId);
                        const skuObjectId = new mongoose.Types.ObjectId(skuId);
                        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

                        // Verify product and SKU with optimistic locking
                        const sku = await SKU.findOne({
                            _id: skuObjectId,
                            product: productObjectId
                        })
                        .populate('product', 'seller')
                        .session(session);

                        if (!sku || sku.product.seller.toString() !== sellerObjectId.toString()) {
                            throw new Error('SKU not found or unauthorized');
                        }

                        // Atomic stock update and inventory creation
                        const [stockUpdateResult] = await Promise.all([
                            SKU.updateOne(
                                { 
                                    _id: skuObjectId,
                                    __v: sku.__v // Optimistic locking
                                },
                                { 
                                    $inc: { 
                                        stock: credentialsList.length,
                                        __v: 1
                                    }
                                }
                            ).session(session),

                            Inventory.insertMany(
                                credentialsList.map(credential => ({
                                    credentials: credential,
                                    sku: skuObjectId,
                                    seller: sellerObjectId,
                                    status: 'available'
                                })),
                                { session }
                            )
                        ]);

                        // Check if stock update was successful (optimistic lock)
                        if (stockUpdateResult.modifiedCount === 0) {
                            throw new Error('OPTIMISTIC_LOCK_CONFLICT');
                        }

                        return {
                            uploadedCount: credentialsList.length,
                            attempt: attempt
                        };
                    },
                    { maxRetries: 3 }
                );
            },
            3, // max retries
            100 // base delay
        );

        return res.status(201).json({
            errCode: 0,
            message: `Successfully uploaded ${result.uploadedCount} credentials`,
            data: result
        });

    } catch (error) {
        console.error('Inventory upload error:', error);
        
        if (error.message.includes('OPTIMISTIC_LOCK_CONFLICT')) {
            return res.status(409).json({
                errCode: 1,
                message: 'Inventory is being updated by another process, please try again',
                errorType: 'OPTIMISTIC_LOCK_CONFLICT'
            });
        }
        
        return res.status(500).json({
            errCode: 1,
            message: error.message
        });
    } finally {
        await lock.release();
    }
};

export const deleteInventoryById = async (req, res) => {
<<<<<<< Updated upstream
    try {
        const { skuId, inventoryId } = req.body;
        const sellerId = req.user.id;
        console.log("check data:", skuId, inventoryId)
        if (!skuId || !inventoryId) {
            throw new Error("Missing input parameters");
        }
        const skuObjectId = new mongoose.Types.ObjectId(skuId);
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        const inventoryObjectId = new mongoose.Types.ObjectId(inventoryId);
        // Verify that the product belongs to the seller
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Inventory.findByIdAndDelete({
                _id: inventoryObjectId,
                seller: sellerObjectId
            });
            await SKU.updateOne(
                { _id: skuObjectId },
                { $inc: { stock: -1 } }
            )
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }

        return res.status(201).json({ errCode: 0, message: "Successfully deleted an inventory" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
=======
    const { skuId, inventoryId } = req.body;
    const sellerId = req.user.id;
    
    if (!skuId || !inventoryId) {
        return res.status(400).json({ 
            errCode: 1, 
            message: "Missing input parameters" 
        });
    }

    // Create distributed lock for the inventory item
    const lock = new DistributedLock(`inventory:delete:${inventoryId}`, 10000);
    
    try {
        await lock.waitForLock();
        
        const result = await OptimisticLockingHelper.executeWithRetry(
            async (attempt) => {
                return await TransactionHelper.executeWithTransaction(
                    async (session) => {
                        const skuObjectId = new mongoose.Types.ObjectId(skuId);
                        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
                        const inventoryObjectId = new mongoose.Types.ObjectId(inventoryId);

                        // Find and update inventory with atomic operation
                        const inventory = await Inventory.findOneAndUpdate({
                            _id: inventoryObjectId,
                            seller: sellerObjectId,
                            isDeleted: false,
                            status: 'available' // Only allow deletion of available items
                        }, {
                            isDeleted: true,
                            deletedAt: new Date()
                        }, { 
                            new: true, 
                            session: session 
                        });

                        if (!inventory) {
                            throw new Error("Inventory item not found or cannot be deleted");
                        }

                        // Get SKU for optimistic locking
                        const sku = await SKU.findById(skuObjectId).session(session);
                        if (!sku) {
                            throw new Error("SKU not found");
                        }

                        // Atomic stock decrement with optimistic locking
                        const stockUpdateResult = await SKU.updateOne(
                            { 
                                _id: skuObjectId,
                                __v: sku.__v // Optimistic locking
                            },
                            { 
                                $inc: { 
                                    stock: -1,
                                    __v: 1
                                }
                            }
                        ).session(session);

                        if (stockUpdateResult.modifiedCount === 0) {
                            throw new Error('OPTIMISTIC_LOCK_CONFLICT');
                        }

                        return {
                            deletedInventoryId: inventoryId,
                            attempt: attempt
                        };
                    },
                    { maxRetries: 3 }
                );
            },
            3, // max retries
            100 // base delay
        );

        return res.status(200).json({ 
            errCode: 0, 
            message: "Successfully deleted inventory item",
            data: result
        });
        
    } catch (error) {
        console.error('Inventory deletion error:', error);
        
        if (error.message.includes('OPTIMISTIC_LOCK_CONFLICT')) {
            return res.status(409).json({
                errCode: 1,
                message: 'Inventory is being updated by another process, please try again',
                errorType: 'OPTIMISTIC_LOCK_CONFLICT'
            });
        }
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                errCode: 1,
                message: error.message
            });
        }
        
        return res.status(500).json({ 
            errCode: 1,
            message: error.message 
        });
    } finally {
        await lock.release();
    }
};

>>>>>>> Stashed changes
export const getSellerInventory = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const inventory = await Inventory.find({ seller: sellerId })
            .populate('product', 'name category sku');

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInventoryBySkuId = async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const skuObjectId = new mongoose.Types.ObjectId(req.params?.skuId);
        const inventory = await Inventory.find({ sku: skuObjectId, seller: sellerId })
        res.status(200).json({
            errCode: 0,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};