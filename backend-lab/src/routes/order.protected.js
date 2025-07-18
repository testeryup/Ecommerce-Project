import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { 
    distributedLock,
    rateLimiter,
    transactionRetry,
    orderCreationLock,
    stockUpdateLock
} from '../middlewares/race-condition.middleware.js';
import {
    createOrderWithRaceProtection,
    cancelOrderWithRaceProtection,
    updateInventoryWithReservation
} from '../controllers/order.enhanced.js';

const router = express.Router();

// Rate limiting cho order creation (max 5 orders per minute per user)
const orderRateLimit = rateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 5,
    keyGenerator: (req) => `order:${req.user.id}`
});

// Rate limiting cho inventory updates (max 20 updates per minute per seller)
const inventoryRateLimit = rateLimiter({
    windowMs: 60000,
    maxRequests: 20,
    keyGenerator: (req) => `inventory:${req.user.id}`
});

/**
 * Protected Routes với Race Condition Prevention
 */

// Create order với full protection
router.post('/create',
    verifyToken,
    requireRole(['user']),
    orderRateLimit,
    orderCreationLock,
    transactionRetry(3),
    createOrderWithRaceProtection
);

// Cancel order với protection
router.patch('/:orderId/cancel',
    verifyToken,
    requireRole(['user']),
    distributedLock((req) => `order:${req.params.orderId}`),
    transactionRetry(2),
    cancelOrderWithRaceProtection
);

// Update inventory với stock protection
router.patch('/inventory/stock',
    verifyToken,
    requireRole(['seller', 'admin']),
    inventoryRateLimit,
    stockUpdateLock,
    transactionRetry(2),
    updateInventoryWithReservation
);

export default router;
