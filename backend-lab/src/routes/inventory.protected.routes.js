/**
 * Enhanced Inventory Routes với Race Condition Protection
 */

import express from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { 
    distributedLock,
    rateLimiter,
    transactionRetry,
    stockUpdateLock
} from '../middlewares/race-condition.middleware.js';

const router = express.Router();

// Rate limiting for inventory operations
const inventoryRateLimit = rateLimiter({
    windowMs: 60000,
    maxRequests: 20, // 20 inventory operations per minute
    keyGenerator: (req) => `inventory:${req.user.id}`
});

// Upload inventory with stock protection
router.post('/', 
    verifyToken, 
    requireRole(['seller', 'admin']),
    inventoryRateLimit,
    stockUpdateLock, // Lock based on SKU ID
    transactionRetry(2),
    inventoryController.uploadInventory
);

// Get seller's inventory
router.get('/', 
    verifyToken, 
    requireRole(['seller', 'admin']),
    rateLimiter({ maxRequests: 50, windowMs: 60000 }),
    inventoryController.getSellerInventory
);

// Get inventory by SKU ID
router.get('/:skuId', 
    verifyToken, 
    requireRole(['seller', 'admin']),
    rateLimiter({ maxRequests: 30, windowMs: 60000 }),
    inventoryController.getInventoryBySkuId
);

// Delete inventory with stock protection
router.delete('/', 
    verifyToken, 
    requireRole(['seller', 'admin']),
    inventoryRateLimit,
    distributedLock((req) => `inventory-delete:${req.body.inventoryId}`),
    transactionRetry(2),
    inventoryController.deleteInventoryById
);

export default router;
