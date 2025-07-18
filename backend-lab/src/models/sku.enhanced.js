import mongoose from 'mongoose';

/**
 * Enhanced SKU model with optimistic locking and race condition protection
 */

// Thêm version key cho optimistic locking
const skuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        sparse: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: Number.isInteger
        }
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: Number.isInteger
        }
    },
    // Reserved stock for pending orders
    reservedStock: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger
        }
    },
    status: {
        type: String,
        enum: ['available', 'hidden'],
        default: 'available',
        required: true,
    },
    sales: {
        count: {
            type: Number,
            default: 0
        },
        revenue: {
            type: Number,
            default: 0
        },
        lastSale: {
            type: Date,
            default: null
        }
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    },
    // Thêm lastModified để track changes
    lastModified: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    // Enable optimistic concurrency control
    optimisticConcurrency: true
});

// Index for better performance
skuSchema.index(
    { product: 1, name: 1 },
    {
        unique: true,
        name: 'product_sku_name'
    }
);

// Index cho stock queries
skuSchema.index({ stock: 1, status: 1 });

// Middleware để update lastModified
skuSchema.pre('save', function(next) {
    this.lastModified = new Date();
    next();
});

skuSchema.pre('save', async function (next) {
    const existingSku = await this.constructor.findOne({
        product: this.product,
        name: this.name,
        _id: { $ne: this._id }
    });

    if (existingSku) {
        throw new Error('1 sản phẩm không thể có SKU trùng nhau');
    }
    next();
});

/**
 * Methods for safe stock operations with race condition protection
 */

// Reserve stock for order (atomic operation)
skuSchema.statics.reserveStock = async function(skuId, quantity, session) {
    const result = await this.findOneAndUpdate(
        {
            _id: skuId,
            stock: { $gte: quantity },
            $expr: { $gte: ['$stock', { $add: ['$reservedStock', quantity] }] }
        },
        {
            $inc: { 
                reservedStock: quantity,
                __v: 1
            },
            $set: { lastModified: new Date() }
        },
        {
            new: true,
            session
        }
    );

    if (!result) {
        throw new Error(`Insufficient stock for SKU: ${skuId}`);
    }

    return result;
};

// Release reserved stock (when order cancelled)
skuSchema.statics.releaseReservedStock = async function(skuId, quantity, session) {
    return this.findOneAndUpdate(
        {
            _id: skuId,
            reservedStock: { $gte: quantity }
        },
        {
            $inc: { 
                reservedStock: -quantity,
                __v: 1
            },
            $set: { lastModified: new Date() }
        },
        {
            new: true,
            session
        }
    );
};

// Confirm stock reduction (when order completed)
skuSchema.statics.confirmStockReduction = async function(skuId, quantity, price, session) {
    const result = await this.findOneAndUpdate(
        {
            _id: skuId,
            reservedStock: { $gte: quantity }
        },
        {
            $inc: {
                stock: -quantity,
                reservedStock: -quantity,
                'sales.count': quantity,
                'sales.revenue': quantity * price,
                __v: 1
            },
            $set: { 
                'sales.lastSale': new Date(),
                lastModified: new Date()
            }
        },
        {
            new: true,
            session
        }
    );

    if (!result) {
        throw new Error(`Cannot confirm stock reduction for SKU: ${skuId}`);
    }

    return result;
};

// Atomic stock update with optimistic locking
skuSchema.statics.updateStockSafely = async function(skuId, stockDelta, expectedVersion, session) {
    const result = await this.findOneAndUpdate(
        {
            _id: skuId,
            __v: expectedVersion,
            stock: { $gte: -stockDelta } // Ensure stock doesn't go negative
        },
        {
            $inc: { 
                stock: stockDelta,
                __v: 1
            },
            $set: { lastModified: new Date() }
        },
        {
            new: true,
            session
        }
    );

    if (!result) {
        throw new Error('OPTIMISTIC_LOCK_CONFLICT');
    }

    return result;
};

// Get available stock (total - reserved)
skuSchema.methods.getAvailableStock = function() {
    return Math.max(0, this.stock - this.reservedStock);
};

// Check if enough stock available for reservation
skuSchema.methods.canReserve = function(quantity) {
    return this.getAvailableStock() >= quantity;
};

// Add method to get total sales for a product
skuSchema.statics.getProductSales = async function (productId) {
    return this.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId)
            }
        },
        {
            $group: {
                _id: '$product',
                totalSales: { $sum: '$sales.count' },
                totalRevenue: { $sum: '$sales.revenue' }
            }
        }
    ]);
};

// Batch update multiple SKUs with optimistic locking
skuSchema.statics.batchUpdateStock = async function(updates, session) {
    const results = [];
    
    for (const update of updates) {
        const { skuId, quantity, price, expectedVersion } = update;
        
        const result = await this.findOneAndUpdate(
            {
                _id: skuId,
                __v: expectedVersion,
                stock: { $gte: quantity }
            },
            {
                $inc: {
                    stock: -quantity,
                    'sales.count': quantity,
                    'sales.revenue': quantity * price,
                    __v: 1
                },
                $set: { 
                    'sales.lastSale': new Date(),
                    lastModified: new Date()
                }
            },
            {
                new: true,
                session
            }
        );

        if (!result) {
            throw new Error(`OPTIMISTIC_LOCK_CONFLICT for SKU: ${skuId}`);
        }

        results.push(result);
    }

    return results;
};

export default mongoose.model('SKU', skuSchema);
