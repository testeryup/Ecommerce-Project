/**
 * Race Condition Protection Demo
 * Demonstrates how to integrate với existing codebase
 */

import express from 'express';
import { 
    distributedLock,
    rateLimiter,
    transactionRetry
} from './src/middlewares/race-condition.middleware.js';

const app = express();
app.use(express.json());

// Mock database operation with potential race condition
let mockBalance = 1000;
let mockStock = 10;

// Simulate concurrent order processing
app.post('/demo/order', 
    rateLimiter({ maxRequests: 3, windowMs: 10000 }), // 3 orders per 10 seconds
    distributedLock((req) => `order:${req.body.userId}`), // Lock per user
    transactionRetry(3), // Retry on conflicts
    async (req, res) => {
        const { userId, amount, quantity } = req.body;
        
        try {
            const result = await req.retryTransaction(async (session) => {
                console.log(`💰 Processing order for user ${userId}: $${amount}, qty: ${quantity}`);
                
                // Simulate balance check
                if (mockBalance < amount) {
                    throw new Error('Insufficient balance');
                }
                
                // Simulate stock check  
                if (mockStock < quantity) {
                    throw new Error('Insufficient stock');
                }
                
                // Simulate concurrent modification conflict (10% chance)
                if (Math.random() < 0.1) {
                    throw new Error('OPTIMISTIC_LOCK_CONFLICT');
                }
                
                // Update balances
                mockBalance -= amount;
                mockStock -= quantity;
                
                return {
                    orderId: `order_${Date.now()}`,
                    newBalance: mockBalance,
                    newStock: mockStock
                };
            });
            
            res.json({
                success: true,
                data: result,
                message: 'Order processed successfully with race protection'
            });
            
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
);

// Health check cho race protection
app.get('/demo/health', (req, res) => {
    res.json({
        status: 'active',
        currentStock: mockStock,
        currentBalance: mockBalance,
        protections: ['distributed-lock', 'rate-limit', 'transaction-retry']
    });
});

// Reset demo data
app.post('/demo/reset', (req, res) => {
    mockBalance = 1000;
    mockStock = 10;
    res.json({ message: 'Demo data reset', balance: mockBalance, stock: mockStock });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Race Condition Demo Server running on http://localhost:${PORT}`);
    console.log(`📊 Test endpoints:`);
    console.log(`   POST http://localhost:${PORT}/demo/order`);
    console.log(`   GET  http://localhost:${PORT}/demo/health`);
    console.log(`   POST http://localhost:${PORT}/demo/reset`);
    console.log(`\n💡 Test with concurrent requests to see race protection in action!`);
});

export { app };
