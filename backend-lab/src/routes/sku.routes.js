import express from 'express';
import * as skuController from '../controllers/sku.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', skuController.getSkuNames);
router.post('/', skuController.createNewSku);
router.delete('/:skuId', skuController.deleteSku);

export default router;