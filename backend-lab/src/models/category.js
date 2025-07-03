import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subcategories: [
        {
            name: {
                type: String,
                required: true
            }
        }
    ],
    description: String,
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);