/**
 * Production-Ready Integration Guide
 * Hướng dẫn tích hợp race condition protection vào production
 */

// 1. Backup existing routes
// cp src/routes/order.routes.js src/routes/order.routes.backup.js

// 2. Gradual migration approach
import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { 
    distributedLock,
    rateLimiter,
    transactionRetry,
    orderCreationLock
} from '../middlewares/race-condition.middleware.js';

// Import both controllers
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

// Feature flag để toggle protection on/off
const ENABLE_RACE_PROTECTION = process.env.ENABLE_RACE_PROTECTION === 'true';

// Conditional middleware application
const applyRaceProtection = (middlewares) => {
    return ENABLE_RACE_PROTECTION ? middlewares : [];
};

// Gradual rollout: Apply protection to critical operations first
router.post('/', 
    verifyToken, 
    requireRole(['user']),
    ...applyRaceProtection([
        rateLimiter({ maxRequests: 5, windowMs: 60000 }),
        orderCreationLock,
        transactionRetry(3)
    ]),
    orderController.createOrderWithOptimisticLocking
);

// Less critical operations - basic protection only
router.get('/:orderId', 
    verifyToken, 
    requireRole(['user']),
    ...applyRaceProtection([
        rateLimiter({ maxRequests: 30, windowMs: 60000 })
    ]),
    orderController.getOrderById
);

// Monitoring endpoint để track protection status
router.get('/protection/status', (req, res) => {
    res.json({
        raceProtectionEnabled: ENABLE_RACE_PROTECTION,
        protections: ENABLE_RACE_PROTECTION ? [
            'distributed-locking',
            'rate-limiting',
            'transaction-retry'
        ] : ['none'],
        environment: process.env.NODE_ENV || 'development'
    });
});

export default router;

/**
 * Migration Strategy:
 * 
 * Phase 1: Deploy với ENABLE_RACE_PROTECTION=false
 * - Test deployment không ảnh hưởng existing functionality
 * 
 * Phase 2: Enable cho một phần traffic (canary deployment)
 * - Set ENABLE_RACE_PROTECTION=true cho 10% traffic
 * 
 * Phase 3: Full rollout
 * - Enable cho 100% traffic sau khi verify stability
 * 
 * Rollback Plan:
 * - Set ENABLE_RACE_PROTECTION=false để immediate disable
 * - Revert to backup routes nếu cần thiết
 */
