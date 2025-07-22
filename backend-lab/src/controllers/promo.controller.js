import mongoose from "mongoose";
import Promo from "../models/promo.js";
import User from "../models/user.js";
import { customAlphabet } from "nanoid";

const generatePromoCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export const createNewPromo = async (req, res) => {
    try {
        const userId = req.user.id;
        let { code, expiresAt, usage, discount } = req.body;
        if (usage && (usage < 1 || usage > 100)) {
            return res.status(400).json({
                errCode: 1,
                message: "Số lượt sử dụng phải từ 1 - 100"
            })
        }
        if (discount && (discount < 5 || discount > 100)) {
            return res.status(400).json({
                errCode: 1,
                message: "Giảm giá phải từ 5% đến 100%"
            });
        }
        if (!code) {
            code = generatePromoCode();
        } else {
            // Validate custom code format
            if (!/^[A-Z0-9]{3,20}$/.test(code.toUpperCase())) {
                return res.status(400).json({
                    errCode: 1,
                    message: "Mã promo chỉ được chứa chữ cái và số, độ dài 3-20 ký tự"
                });
            }
        }
        const existingPromo = await Promo.findOne({ code: code.toUpperCase() });
        if (existingPromo) {
            return res.status(409).json({
                errCode: 1,
                message: `Mã promo "${code}" đã tồn tại`
            });
        }
        const expiryDate = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (expiryDate <= new Date()) {
            return res.status(400).json({
                errCode: 1,
                message: "Ngày hết hạn phải ở tương lai"
            });
        }

        const promo = await Promo.create({
            code: code.toUpperCase(),
            expiresAt: expiryDate,
            maximumUse: usage || 10,
            discount: discount || 5,
            seller: new mongoose.Types.ObjectId(userId),
            isDeleted: false
        });

        return res.status(201).json({
            errCode: 0,
            message: `Tạo promo code "${promo.code}" thành công`,
            data: {
                code: promo.code,
                maximumUse: promo.maximumUse,
                discount: promo.discount,
                expiresAt: promo.expiresAt
            }
        });
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }

}

export const getPromos = async (req, res) => {
    try {
        // const userId = req.user.id;
        const { page = 1, limit = 10, includeExpired = false, search = '' } = req.query;
        const query = {
            // seller: userId,
            // isDeleted: false
        }
        if (!includeExpired) {
            query.expiresAt = { $gt: new Date() };
        }
        if(search){
            query.code = search.toString().toUpperCase();
        }
        const promos = await Promo.find(query)
            .select('-seller')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        console.log("check var promos:", promos);
        const totalPromos = await Promo.countDocuments(query);

        return res.status(200).json({
            errCode: 0,
            message: "Lấy danh sách promo thành công",
            data: {
                promos,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalPromos / limit),
                    totalItems: totalPromos,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error("Get user promos error:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Không thể lấy danh sách promo"
        });
    }
}


export const removePromo = async (req, res) => {
    try {
        const userId = req.user.id;
        const code = req.params?.code?.toUpperCase() || '';
        if (!code) {
            return res.status(400).json({
                errCode: 1,
                message: "Mã promo là bắt buộc"
            });
        }
        console.log("check code:", code, typeof code);
        const promo = await Promo.findOne({ code: code, isDeleted: false });
        if (!promo) {
            return res.status(404).json({
                errCode: 1,
                message: `Không tìm thấy promo code "${code}"`
            });
        }
        const isOwner = promo.seller.toString() === userId;
        const isAdmin = req.user.role === 'admin'
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                errCode: 1,
                message: "Bạn phải là admin hoặc là người tạo ra code này thì mới có quyền xoá"
            });
        }

        promo.isDeleted = true;
        await promo.save();

        return res.status(200).json({
            errCode: 0,
            message: `Xoá promo code "${promo.code}" thành công`
        });
    } catch (error) {
        console.log("delete promo error", error.message);
        return res.status(500).json({
            errCode: 1,
            message: `Không thể xoá promo code ${error.message}`
        });
    }
}

export const validatePromo = async (req, res) => {
    try {
        const { code } = req.params;
        const userId = req.user.id;

        if (!code) {
            return res.status(400).json({
                errCode: 1,
                message: "Mã promo là bắt buộc"
            });
        }

        const promo = await Promo.findOne({
            code: code.toUpperCase(),
            isDeleted: false,
            expiresAt: { $gt: new Date() },
            maximumUse: { $gt: 0 }
        });

        if (!promo) {
            return res.status(404).json({
                errCode: 1,
                message: "Mã promo không hợp lệ hoặc đã hết hạn"
            });
        }

        return res.status(200).json({
            errCode: 0,
            message: "Mã promo hợp lệ",
            data: {
                code: promo.code,
                discount: promo.discount,
                remainingUsage: promo.maximumUse
            }
        });

    } catch (error) {
        console.error("Validate promo error:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Không thể xác thực mã promo"
        });
    }
};