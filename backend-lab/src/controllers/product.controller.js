import Product from '../models/product.js';
import SKU from '../models/sku.js';
import Inventory from '../models/inventory.js';

import mongoose from 'mongoose';


export const upsertProduct = async (req, res) => {
    try {
        // remove sku from req.body
        const { name, images, description, category, subcategory, skus } = req.body;

        let id = req.body.id;

        // Validate image size
        const MAX_SIZE = 5 * 1024 * 1024;
        if (images?.some(img => {
            const base64Length = img.length - img.indexOf(',') - 1;
            const sizeInBytes = (base64Length * 3) / 4;
            return sizeInBytes > MAX_SIZE;
        })) {
            return res.status(400).json({
                errCode: 1,
                message: 'Image size should not exceed 5MB'
            });
        }

        // Check if product exists
        const existingProduct = id ? await Product.findById(id) : null;
        // Create/Update product
        const product = await Product.findOneAndUpdate(
            existingProduct ? { _id: id } : { name },
            {
                name,
                images,
                description,
                category,
                subcategory,
                seller: req.user.id,
                createdAt: new Date()
            },
            {
                upsert: true,
                new: true
            }
        );

        // Handle SKUs
        if (!existingProduct && skus && skus.length > 0) {
            // Validate new SKUs
            const skuValidationPromises = skus.map(sku => {
                const newSku = new SKU({
                    name: sku.name,
                    price: sku.price,
                    stock: sku.stock || 0,
                    product: product._id
                });
                return newSku.validate();
            });
            await Promise.all(skuValidationPromises);

            const skusCreated = await SKU.insertMany(
                skus.map(sku => ({
                    name: sku.name,
                    price: sku.price,
                    stock: sku.stock || 0,
                    product: product._id
                }))
            );
        }
        else if (existingProduct && skus) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const existingSkus = await SKU.find({
                    product: product._id,
                    isDeleted: false
                }).session(session);
                // create a set of sku ids from client request body
                const skuIdsFromClient = new Set(
                    skus.filter(sku => sku._id && mongoose.Types.ObjectId.isValid(sku._id))
                        .map(sku => sku._id.toString())
                );
                // chia nhỏ các thao tác của sku
                const newSkus = skus.filter(sku => !sku._id || !mongoose.Types.ObjectId.isValid(sku._id));
                const updateSkus = skus.filter(sku => sku._id && mongoose.Types.ObjectId.isValid(sku._id));
                const skusToDelete = existingSkus.filter(sku => !skuIdsFromClient.has(sku._id.toString()));

                // handle create new skus
                if (newSkus && newSkus.length > 0) {
                    const skuValidationPromises = newSkus.map(sku => {
                        const newSku = new SKU({
                            name: sku.name,
                            price: sku.price,
                            stock: sku.stock || 0,
                            product: product._id
                        });
                        return newSku.validate();
                    });
                    await Promise.all(skuValidationPromises);

                    await SKU.insertMany(
                        newSkus.map(sku => ({
                            name: sku.name,
                            price: sku.price,
                            stock: sku.stock || 0,
                            product: product._id
                        })),
                        { session }
                    );
                }

                // handle update skus
                if (updateSkus.length > 0) {
                    const updatePromises = updateSkus.map(sku =>
                        SKU.findOneAndUpdate(
                            {
                                _id: sku._id,
                                product: product._id,
                                isDeleted: false
                            },
                            {
                                name: sku.name,
                                price: sku.price,
                            },
                            {
                                session,
                                runValidators: true,
                                new: true
                            }
                        )
                    );
                    await Promise.all(updatePromises);
                }
                // handle delete skus
                if (skusToDelete.length > 0) {
                    const deletePromises = skusToDelete.map(sku =>
                        SKU.findByIdAndUpdate(
                            sku._id,
                            { isDeleted: true },
                            { session }
                        )
                    );

                    // ✅ Soft delete related inventories
                    await Inventory.updateMany(
                        {
                            sku: { $in: skusToDelete.map(sku => sku._id) },
                            isDeleted: false
                        },
                        { isDeleted: true },
                        { session }
                    );

                    await Promise.all(deletePromises);
                }
                await session.commitTransaction();
            } catch (error) {
                await session.abortStransaction();
                throw error;
            }
            finally {
                await session.endSession();
            }
        }


        return res.status(existingProduct ? 200 : 201).json({
            errCode: 0,
            message: `Successfully ${existingProduct ? 'updated' : 'created'} product with SKUs`,
            data: {
                product,

            }
        });

    } catch (error) {
        console.error('upsertProduct error:', error);
        return res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }
};

export const getProducts = async (req, res) => {

    try {
        const products = await Product.aggregate([
            {
                $match: {
                    category: { $exists: true },
                    isDeleted: false,
                    $or: [
                        { status: { $exists: false } },
                        { status: 'active' }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'skus',
                    let: { productId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$product', '$$productId'] },
                                status: 'available',
                                isDeleted: false
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                price: 1,
                                stock: 1,
                                status: 1,
                            }
                        }
                    ],
                    as: 'skus'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { sellerId: '$seller' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$sellerId'] },
                                status: 'active'
                            }
                        },
                        {
                            $project: {
                                username: 1,
                                email: 1,
                                _id: 1
                            }
                        }
                    ],
                    as: 'seller'
                }
            },
            {
                $addFields: {
                    thumbnail: {
                        $ifNull: [{ $arrayElemAt: ['$images', 0] }, null]
                    },
                    categoryName: { $arrayElemAt: ['$categoryInfo.name', 0] },
                    totalStock: {
                        $ifNull: [{ $sum: '$skus.stock' }, 0]
                    },
                    minPrice: {
                        $ifNull: [{ $min: '$skus.price' }, null]
                    },
                    seller: { $arrayElemAt: ['$seller', 0] } // Flatten seller array
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    category: 1,
                    categoryName: 1,
                    subcategory: 1,
                    seller: 1,
                    'skus': 1,
                    minPrice: 1,
                    totalStock: 1,
                    thumbnail: 1,
                    createdAt: 1
                }
            },
            { $limit: 50 }
        ])
        res.status(200).json({
            errCode: 0,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        // console.log("check:", productId, sellerId);
        const product = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
                    isDeleted: false,
                    $or: [
                        { status: { $exists: false } },
                        { status: 'active' }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'skus',
                    // localField: '_id',
                    // foreignField: 'product',
                    // as: 'skus'
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$product", "$$productId"] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                                },
                            }
                        }
                    ],
                    as: "skus"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { sellerId: '$seller' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$sellerId'] },
                                status: 'active'
                            }
                        },
                        {
                            $project: {
                                username: 1,
                                email: 1,
                                _id: 1
                            }
                        }
                    ],
                    as: 'seller'
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    category: 1,
                    categoryName: { $arrayElemAt: ['$categoryInfo.name', 0] },
                    subcategory: 1,
                    images: 1,
                    thumbnail: 1,
                    'skus._id': 1,
                    'skus.name': 1,
                    'skus.price': 1,
                    'skus.originalPrice': 1,
                    'skus.stock': 1,
                    seller: { $arrayElemAt: ['$seller', 0] }
                }
            },
            {
                $limit: 1
            }
        ]);

        return res.status(200).json({
            errCode: 0,
            data: product[0]
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
