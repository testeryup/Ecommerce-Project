import mongoose from 'mongoose';
import { 
    distributedLock,
    rateLimiter,
    transactionRetry,
    orderCreationLock,
    stockUpdateLock,
    userBalanceLock
} from './src/middlewares/race-condition.middleware.js';

/**
 * Test Race Condition Protection Integration
 */

// Test Distributed Lock
const testDistributedLock = async () => {
    console.log('🔒 Testing Distributed Lock...');
    
    const mockReq1 = { params: { id: 'test123' } };
    const mockReq2 = { params: { id: 'test123' } };
    const mockRes = {
        status: (code) => ({ json: (data) => console.log(`Response ${code}:`, data) }),
        send: function(data) { console.log('Response sent:', data); }
    };
    
    const lock = distributedLock((req) => `test:${req.params.id}`);
    
    // Simulate concurrent requests
    const promise1 = new Promise((resolve) => {
        lock(mockReq1, mockRes, () => {
            console.log('✅ Lock 1 acquired');
            setTimeout(() => {
                console.log('🔓 Lock 1 released');
                resolve();
            }, 1000);
        });
    });
    
    const promise2 = new Promise((resolve) => {
        setTimeout(() => {
            lock(mockReq2, mockRes, () => {
                console.log('✅ Lock 2 acquired');
                resolve();
            });
        }, 100);
    });
    
    await Promise.all([promise1, promise2]);
    console.log('✅ Distributed Lock test completed\n');
};

// Test Rate Limiter
const testRateLimiter = async () => {
    console.log('⏱️ Testing Rate Limiter...');
    
    const rateLimiter = rateLimiter({ maxRequests: 2, windowMs: 5000 });
    const mockReq = { user: { id: 'user123' } };
    const mockRes = {
        status: (code) => ({ json: (data) => console.log(`Rate limit response ${code}:`, data) })
    };
    
    // Test multiple requests
    for (let i = 0; i < 4; i++) {
        rateLimiter(mockReq, mockRes, () => {
            console.log(`✅ Request ${i + 1} passed rate limit`);
        });
    }
    console.log('✅ Rate Limiter test completed\n');
};

// Test Transaction Retry
const testTransactionRetry = async () => {
    console.log('🔄 Testing Transaction Retry...');
    
    const retry = transactionRetry(3);
    const mockReq = {};
    const mockRes = {};
    
    retry(mockReq, mockRes, () => {
        console.log('✅ Transaction retry middleware applied');
        
        // Test retry function
        if (mockReq.retryTransaction) {
            console.log('✅ retryTransaction function available');
            
            // Simulate operation with conflict
            let attempts = 0;
            mockReq.retryTransaction(async (session) => {
                attempts++;
                console.log(`  Attempt ${attempts}`);
                
                if (attempts < 2) {
                    const error = new Error('OPTIMISTIC_LOCK_CONFLICT');
                    throw error;
                }
                
                return { success: true, attempts };
            }).then(result => {
                console.log('✅ Transaction succeeded after retries:', result);
            }).catch(error => {
                console.log('❌ Transaction failed:', error.message);
            });
        }
    });
    
    console.log('✅ Transaction Retry test completed\n');
};

// Test all components
const runTests = async () => {
    console.log('🚀 Starting Race Condition Protection Tests...\n');
    
    try {
        await testDistributedLock();
        await testRateLimiter();
        await testTransactionRetry();
        
        console.log('🎉 All tests completed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { runTests };
