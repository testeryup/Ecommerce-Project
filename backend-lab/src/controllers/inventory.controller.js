import Inventory from '../models/inventory.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import SKU from '../models/sku.js'
import mongoose from 'mongoose';

export const uploadInventory = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId, skuId, credentialsList } = req.body;
        const sellerId = req.user.id;

        // Validate input
        if (!productId || !skuId || !Array.isArray(credentialsList) || credentialsList.length === 0) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input data'
            });
        }

        // Convert IDs to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const skuObjectId = new mongoose.Types.ObjectId(skuId);
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

        // Verify product and SKU in one query
        const sku = await SKU.findOne({
            _id: skuObjectId,
            product: productObjectId
        })
            .populate('product', 'seller') // Populate product to check seller
            .session(session);

        if (!sku || sku.product.seller.toString() !== sellerObjectId.toString()) {
            throw new Error('SKU not found or unauthorized');
        }

        // Update stock and create inventory entries atomically
        await Promise.all([
            SKU.updateOne(
                { _id: skuObjectId },
                { $inc: { stock: credentialsList.length } }
            ).session(session),

            Inventory.insertMany(
                credentialsList.map(credential => ({
                    // ...credential, comment lai co gi con sua hihi
                    credentials: credential,
                    sku: skuObjectId,
                    seller: sellerObjectId,
                    status: 'available'
                })),
                { session }
            )
        ]);

        await session.commitTransaction();

        return res.status(201).json({
            errCode: 0,
            message: `Successfully uploaded ${credentialsList.length} credentials`
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

export const deleteInventoryById = async (req, res) => {
    const { skuId, inventoryId } = req.body;
    const sellerId = req.user.id;
    // Debugging log removed before production
    if (!skuId || !inventoryId) {
        return res.status(400).json({ errCode: 1, message: "Missing input parameters" });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const skuObjectId = new mongoose.Types.ObjectId(skuId);
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        const inventoryObjectId = new mongoose.Types.ObjectId(inventoryId);
        // Verify that the product belongs to the seller

        const inventory = await Inventory.findOneAndUpdate({
            _id: inventoryObjectId,
            seller: sellerObjectId,
            isDeleted: false
        }, {
            isDeleted: true
        }, { new: true, session: session });
        if (!inventory) {
            throw new Error("Không tồn tại trong kho hàng");
        }
        if (inventory?.isDeleted === true) {
            await SKU.updateOne(
                { _id: skuObjectId },
                { $inc: { stock: -1 } }
            ).session(session)
        }
        await session.commitTransaction();

        return res.status(200).json({ errCode: 0, message: "Successfully deleted an inventory" });
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ message: error.message });
    }
    finally {
        session.endSession();
    }
};

export const getSellerInventory = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const inventory = await Inventory.find({ seller: sellerId, isDeleted: false, status: 'available' })
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
        const inventory = await Inventory.find({ sku: skuObjectId, seller: sellerId, isDeleted: false, status: 'available' })
        res.status(200).json({
            errCode: 0,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};