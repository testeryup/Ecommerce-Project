import express from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Upload new inventory item (with subscription support)
router.post('/', verifyToken, requireRole(['seller', 'admin']), inventoryController.uploadInventory);

// Get seller's inventory (with subscription info)
router.get('/', verifyToken, requireRole(['seller', 'admin']), inventoryController.getInventory);

// Subscription management routes
router.post('/renew-subscription', verifyToken, requireRole(['seller', 'admin']), inventoryController.renewSubscription);
router.post('/reset-password/:accountId', verifyToken, requireRole(['seller', 'admin']), inventoryController.resetAccountPassword);

// Statistics and monitoring
router.get('/stats/subscriptions', verifyToken, requireRole(['seller', 'admin']), inventoryController.getSubscriptionStats);
router.get('/expiring-soon', verifyToken, requireRole(['seller', 'admin']), inventoryController.getExpiringSoon);

// Legacy routes (keep for backward compatibility)
router.get('/:skuId', verifyToken, requireRole(['seller', 'admin']), inventoryController.getInventoryBySkuId);
router.delete('/', verifyToken, requireRole(['seller', 'admin']), inventoryController.deleteInventoryById);

export default router;