import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    sku: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SKU'
    },
    // Thông tin tài khoản (username:password hoặc key)
    credentials: {
        username: {
            type: String,
            required: function() {
                return this.accountType === 'subscription';
            }
        },
        password: {
            type: String,
            required: function() {
                return this.accountType === 'subscription';
            }
        },
        key: {
            type: String,
            required: function() {
                return this.accountType === 'key';
            }
        },
        email: String, // Email backup cho tài khoản
        additionalInfo: String // Thông tin bổ sung
    },
    // Loại tài khoản
    accountType: {
        type: String,
        enum: ['subscription', 'key', 'license'],
        required: true,
        default: 'subscription'
    },
    // Trạng thái tài khoản
    status: {
        type: String,
        enum: ['available', 'sold', 'expired', 'invalid', 'maintenance'],
        default: 'available'
    },
    // Thông tin subscription hiện tại
    currentSubscription: {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null
        },
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    // Lịch sử sử dụng
    usageHistory: [{
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        startDate: Date,
        endDate: Date,
        duration: Number, // số ngày sử dụng
        revenue: Number
    }],
    // Thông tin reset tự động
    autoReset: {
        enabled: {
            type: Boolean,
            default: true
        },
        newPassword: String, // Mật khẩu mới được tạo khi reset
        lastResetDate: Date,
        resetCount: {
            type: Number,
            default: 0
        }
    },
    // Seller và thông tin quản lý
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    },
    // Ghi chú từ seller
    notes: String
}, {
    timestamps: true
});

// Indexes để tối ưu truy vấn
inventorySchema.index({ sku: 1, status: 1 });
inventorySchema.index({ 'currentSubscription.endDate': 1, status: 1 });
inventorySchema.index({ seller: 1, status: 1 });

// Method để bắt đầu subscription
inventorySchema.methods.startSubscription = async function(buyer, order, duration) {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));
    
    this.status = 'sold';
    this.currentSubscription = {
        buyer: buyer,
        order: order,
        startDate: startDate,
        endDate: endDate,
        isActive: true
    };
    
    return this.save();
};

// Method để kết thúc subscription và reset tài khoản
inventorySchema.methods.expireSubscription = async function() {
    if (this.currentSubscription.isActive) {
        // Lưu vào lịch sử
        this.usageHistory.push({
            buyer: this.currentSubscription.buyer,
            order: this.currentSubscription.order,
            startDate: this.currentSubscription.startDate,
            endDate: this.currentSubscription.endDate,
            duration: Math.ceil((this.currentSubscription.endDate - this.currentSubscription.startDate) / (1000 * 60 * 60 * 24)),
            revenue: 0 // Sẽ được cập nhật từ order
        });
        
        // Reset subscription
        this.currentSubscription = {
            buyer: null,
            order: null,
            startDate: null,
            endDate: null,
            isActive: false
        };
        
        // Auto reset password nếu được bật
        if (this.autoReset.enabled && this.accountType === 'subscription') {
            this.autoReset.newPassword = this.generateNewPassword();
            this.credentials.password = this.autoReset.newPassword;
            this.autoReset.lastResetDate = new Date();
            this.autoReset.resetCount += 1;
        }
        
        this.status = 'available';
    }
    
    return this.save();
};

// Method để gia hạn subscription
inventorySchema.methods.renewSubscription = async function(additionalDays) {
    if (this.currentSubscription.isActive) {
        const currentEndDate = new Date(this.currentSubscription.endDate);
        const newEndDate = new Date(currentEndDate.getTime() + (additionalDays * 24 * 60 * 60 * 1000));
        this.currentSubscription.endDate = newEndDate;
        return this.save();
    }
    throw new Error('Không thể gia hạn subscription không hoạt động');
};

// Method để tạo mật khẩu mới
inventorySchema.methods.generateNewPassword = function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Static method để tìm tài khoản sắp hết hạn
inventorySchema.statics.findExpiringSoon = function(hoursBeforeExpiry = 24) {
    const expiryThreshold = new Date(Date.now() + (hoursBeforeExpiry * 60 * 60 * 1000));
    return this.find({
        'currentSubscription.isActive': true,
        'currentSubscription.endDate': { $lte: expiryThreshold },
        status: 'sold'
    }).populate('currentSubscription.buyer', 'email username')
      .populate('sku', 'name');
};

// Static method để tìm tài khoản đã hết hạn
inventorySchema.statics.findExpired = function() {
    return this.find({
        'currentSubscription.isActive': true,
        'currentSubscription.endDate': { $lt: new Date() },
        status: 'sold'
    });
};

export default mongoose.model('Inventory', inventorySchema);