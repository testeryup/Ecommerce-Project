import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { 
    idempotencyMiddleware, 
    resourceLockMiddleware 
} from '../middlewares/race-condition.middleware.js';
import {
    createOrderWithRaceProtection,
    getRaceConditionStats
} from '../controllers/order-race-protected.controller.js';

const router = express.Router();

// Resource key extractor for order operations
const orderResourceExtractor = (req) => {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) return null;
    
    const skuIds = items.map(item => item.skuId).sort();
    return `order:skus:${skuIds.join(',')}`;
};

// Enhanced order creation with comprehensive race condition protection
router.post('/create-protected',
    verifyToken,
    idempotencyMiddleware,
    resourceLockMiddleware(orderResourceExtractor),
    createOrderWithRaceProtection
);

// Race condition stats endpoint (for monitoring)
router.get('/race-stats',
    verifyToken,
    getRaceConditionStats
);

export default router;
