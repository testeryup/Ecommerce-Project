import Category from "../models/category.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

// Convention: All API responses must include 'errCode': 0 for success, 'errCode': 1 for errors.
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({isDeleted: false}).select('-createdAt -updatedAt -__v -description');
        res.status(200).json({ errCode: 0, data: categories });
    } catch (error) {
        res.status(500).json({ errCode: 1, message: error.message });
    }
}

export const createNewCategory = async (req, res) => {
    const { categoryName, subCategories, description } = req.body;

    try {
        let result = await Category.create({
            name: categoryName,
            subcategories: subCategories,
            description: description
        });
        res.status(200).json({ errCode: 0, result });
    } catch (error) {
        return res.status(500).json({ errCode: 1, message: error.message })
    }
}

export const updateCategory = async (req, res) => {
    const { categoryName, subcategories } = req.body;

    try {
        const result = await Category.updateOne(
            { name: categoryName },
            { subcategories: subcategories }
        );
        if (result.modifiedCount > 0) {
            return res.status(200).json({ errCode: 0, message: 'Update category successfully' })
        }
        return res.status(200).json({ errCode: 1, message: 'Can not making the change' });
    } catch (error) {
        return res.status(500).json({ errCode: 1, message: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    const { categoryId } = req.body;
    if (!categoryId) {
        return res.status(400).json({
            errCode: 1,
            message: 'Không tìm thấy danh mục này'
        });
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                errCode: 1,
                message: 'categoryId không hợp lệ'
            });
        }
        const productCount = await Product.estimatedDocumentCount({
            category: mongoose.Types.ObjectId.createFromHexString(categoryId),
            isDeleted: false
        });
        if(productCount){
            return res.status(400).json({
                errCode: 1,
                message: "Tồn tại sản phẩm nằm trong danh mục này, vui lòng xoá sản phẩm trước khi tiếp tục"
            });
        }
        // Check if category exists and is not already deleted
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                errCode: 1,
                message: "Không tồn tại danh mục này"
            });
        }
        if (category.isDeleted) {
            return res.status(400).json({
                errCode: 1,
                message: "Danh mục này đã bị xoá trước đó"
            });
        }
        category.isDeleted = true;
        await category.save();
        return res.status(200).json({
            errCode: 0,
            message: 'Xoá danh mục thành công'
        });
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }
};