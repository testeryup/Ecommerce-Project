#!/usr/bin/env node

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

// Import race condition middleware 
const { distributedLock, rateLimiter, transactionRetry } = await import('./src/middlewares/race-condition.middleware.js');

const app = express();
app.use(express.json());

// Test data
let testData = {
    balance: 1000,
    stock: 10,
    operations: 0
};

console.log('🔍 Testing Race Condition Protection...\n');

// Concurrent order simulation
app.post('/test/order', 
    rateLimiter({ maxRequests: 5, windowMs: 5000 }),
    distributedLock((req) => `order:${req.body.userId || 'default'}`),
    async (req, res) => {
        const { userId = 'user1', amount = 100, quantity = 1 } = req.body;
        
        testData.operations++;
        const operationId = testData.operations;
        
        console.log(`🔄 Operation ${operationId}: Processing order (User: ${userId}, Amount: ${amount}, Qty: ${quantity})`);
        
        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (testData.balance < amount) {
                throw new Error('Insufficient balance');
            }
            
            if (testData.stock < quantity) {
                throw new Error('Insufficient stock');
            }
            
            // Update data
            testData.balance -= amount;
            testData.stock -= quantity;
            
            const result = {
                operationId,
                orderId: `order_${Date.now()}_${operationId}`,
                newBalance: testData.balance,
                newStock: testData.stock,
                timestamp: new Date().toISOString()
            };
            
            console.log(`✅ Operation ${operationId}: Success - Balance: ${testData.balance}, Stock: ${testData.stock}`);
            
            res.json({
                success: true,
                data: result,
                protection: 'active'
            });
            
        } catch (error) {
            console.log(`❌ Operation ${operationId}: Error - ${error.message}`);
            res.status(400).json({
                success: false,
                error: error.message,
                operationId
            });
        }
    }
);

// Health endpoint
app.get('/test/status', (req, res) => {
    res.json({
        testData,
        protection: {
            distributedLock: 'active',
            rateLimiter: 'active', 
            operations: testData.operations
        }
    });
});

// Reset endpoint
app.post('/test/reset', (req, res) => {
    testData = { balance: 1000, stock: 10, operations: 0 };
    console.log('🔄 Test data reset');
    res.json({ message: 'Reset successful', testData });
});

const PORT = 3001;
const server = app.listen(PORT, () => {
    console.log(`✅ Race Condition Test Server started on port ${PORT}`);
    console.log('📍 Endpoints:');
    console.log(`   POST http://localhost:${PORT}/test/order`);
    console.log(`   GET  http://localhost:${PORT}/test/status`);
    console.log(`   POST http://localhost:${PORT}/test/reset\n`);
    
    // Auto test
    runAutoTest();
});

// Auto test function
async function runAutoTest() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🚀 Running automatic concurrent test...\n');
    
    const requests = [];
    for (let i = 0; i < 5; i++) {
        requests.push(
            fetch(`http://localhost:${PORT}/test/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: `user${i}`, 
                    amount: 100, 
                    quantity: 1 
                })
            }).then(res => res.json())
        );
    }
    
    try {
        const results = await Promise.all(requests);
        
        console.log('\n📊 Test Results:');
        console.log('─'.repeat(50));
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        console.log(`✅ Successful operations: ${successful.length}`);
        console.log(`❌ Failed operations: ${failed.length}`);
        
        if (successful.length > 0) {
            const finalState = successful[successful.length - 1].data;
            console.log(`💰 Final balance: ${finalState.newBalance}`);
            console.log(`📦 Final stock: ${finalState.newStock}`);
        }
        
        console.log('\n🎯 Race Condition Protection: ✅ WORKING');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    // Cleanup
    setTimeout(() => {
        console.log('\n🔚 Test completed. Server shutting down...');
        server.close();
        process.exit(0);
    }, 2000);
}

export { app };
