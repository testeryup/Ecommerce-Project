import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value > Date.now(),
            message: "Ngày hết hạn phải ở tương lai nhé bro"
        }
    },
    maximumUse: {
        type: Number,
        default: 10,
        required: true,
        min: 1,
        max: 100
    },
    discount: {
        type: Number,
        default: 5,
        required: true,
        min: 5,
        max: 100
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        required: true
    }
}, { timestamps: true });


export default mongoose.model('Promo', promoSchema);