/**
 * Enhanced Order Routes với Race Condition Protection
 * Integrates với existing order controller và adds protection layers
 */

import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { 
    distributedLock,
    rateLimiter,
    transactionRetry,
    orderCreationLock
} from '../middlewares/race-condition.middleware.js';

const router = express.Router();

// Rate limiting configurations
const orderRateLimit = rateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 5, // Max 5 orders per minute per user
    keyGenerator: (req) => `order:${req.user.id}`
});

const generalRateLimit = rateLimiter({
    windowMs: 60000,
    maxRequests: 30, // 30 requests per minute for general operations
    keyGenerator: (req) => req.user?.id || req.ip
});

/**
 * Protected Order Routes
 */

// Create order with FULL race condition protection
router.post('/', 
    verifyToken, 
    requireRole(['user']),
    orderRateLimit, // Rate limit order creation
    orderCreationLock, // Prevent duplicate orders from same user
    transactionRetry(3), // Auto-retry on conflicts
    orderController.createOrderWithOptimisticLocking // Use existing optimistic locking controller
);

// Get order by ID with basic protection
router.get('/:orderId', 
    verifyToken, 
    requireRole(['user']),
    generalRateLimit,
    orderController.getOrderById
);

// Get all user orders with pagination protection
router.get('/', 
    verifyToken, 
    requireRole(['user']),
    generalRateLimit,
    orderController.getAllUserOrders
);

// Initial order validation with protection
router.post('/init', 
    verifyToken, 
    requireRole(['user']),
    generalRateLimit,
    distributedLock((req) => `order-init:${req.user.id}`), // Prevent concurrent order validations
    orderController.initialOrder
);

/**
 * Admin Routes với protection
 */

// Admin get all orders
router.get('/all', 
    verifyToken, 
    requireRole(['admin']),
    rateLimiter({ maxRequests: 100, windowMs: 60000 }), // Higher limit for admin
    orderController.getAllOrders
);

// Admin update order status
router.put('/status', 
    verifyToken, 
    requireRole(['admin']),
    rateLimiter({ maxRequests: 50, windowMs: 60000 }),
    distributedLock((req) => `order-status:${req.body.orderId}`), // Lock specific order
    transactionRetry(2),
    orderController.updateOrderStatus
);

/**
 * Health check endpoint để monitor race condition middleware
 */
router.get('/health/race-protection', (req, res) => {
    res.json({
        status: 'active',
        protections: [
            'distributed-locking',
            'rate-limiting', 
            'optimistic-locking',
            'transaction-retry'
        ],
        timestamp: new Date().toISOString()
    });
});

export default router;
