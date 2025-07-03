import mongoose from 'mongoose';
import SKU from '../models/sku.js';
import Inventory from '../models/inventory.js';

export const getSkuNames = async (req, res) => {
    try {
        const skuIds = req.body?.items;
        if (!skuIds || !skuIds.length) {
            throw new Error("Missing input parameter");
        }

        const skus = await SKU.aggregate(
            [
                {
                    $match: {
                        _id: {
                            $in: skuIds.map(id => new mongoose.Types.ObjectId(id))
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $project: {
                        name: 1,
                        price: 1,
                        // stock: 1,
                        productName: { $arrayElemAt: ['$productDetails.name', 0] }
                    }
                }
            ]
        )
        return res.status(200).json({
            errCode: 0,
            data: skus
        });
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            message: error.message
        })
    }
}

export const createNewSku = async (req, res) => {
    try {
        const { skuName, productId, price } = req.body;
        if (!skuName || !productId || !price) {
            throw new Error('Tên sku, id sản phẩm và giá cả là bắt buộc');
        }
        const savedSku = await SKU.create({
            name: skuName,
            product: productId,
            price: price
        });

        return res.status(201).json({
            errCode: 0,
            message: 'Tạo SKU thành công',
            data: savedSku
        });
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                errCode: 1,
                message: 'Dữ liệu không hợp lệ',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        return res.status(500).json({
            errCode: 1,
            message: 'Không thể tạo Sku mới'
        })
    }
}

export const deleteSku = async (req, res) => {
    try {
        const skuId = req.params.skuId;
        if (!skuId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Sku ID là bắt buộc'
            });
        }
        if (!mongoose.Types.ObjectId.isValid(skuId)) {
            return res.status(400).json({
                errCode: 1,
                message: "SKU ID không hợp lệ"
            });
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {

        } catch (error) {
            const sku = await SKU.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(skuId), isDeleted: false },
                { isDeleted: true },
                { new: true, session: session }
            );

            if (sku === null) {
                throw new Error("Không tìm thấy sku");
            }

            await Inventory.updateMany({
                sku: sku._id,
                isDeleted: false
            }, {
                isDeleted: true,
            }, {session: session});

            await session.commitTransaction();

            return res.status(200).json({
                errCode: 0,
                message: 'Xoá sku thành công'
            });
        }

    } catch (error) {
        await session.abortTransaction();
        if (error.message.includes("Không tìm thấy SKU")) {
            return res.status(404).json({
                errCode: 1,
                message: error.message
            });
        }
        return res.status(500).json({
            errCode: 1,
            message: `Xoá sku thất bại: ${error.message}`
        });
    }
    finally{
        await session.endSession();
    }
}