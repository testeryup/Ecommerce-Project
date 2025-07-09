import express from "express";
import * as PromoController from '../controllers/promo.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/', verifyToken, requireRole(['admin', 'seller']), PromoController.getUserPromos);
// router.get('/:code', verifyToken, PromoController.validatePromo);
router.post('/', verifyToken, requireRole(['admin', 'seller']), PromoController.createNewPromo);
router.delete('/', verifyToken, requireRole(['admin', 'seller']), PromoController.removePromo);

export default router;