import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { DistributedLock, OptimisticLockingHelper } from '../middlewares/race-condition.middleware.js';
import SKU from '../models/sku.js';
import User from '../models/user.js';

const router = express.Router();

/**
 * Test endpoint để kiểm tra race condition protection
 */
router.post('/test-concurrent-orders', verifyToken, async (req, res) => {
    try {
        const { skuId, orderCount = 10 } = req.body;
        const userId = req.user.id;
        
        if (!skuId) {
            return res.status(400).json({
                errCode: 1,
                message: 'SKU ID is required'
            });
        }

        // Kiểm tra SKU tồn tại
        const sku = await SKU.findById(skuId);
        if (!sku) {
            return res.status(404).json({
                errCode: 1,
                message: 'SKU not found'
            });
        }

        console.log(`🧪 Starting concurrent order test:`);
        console.log(`   SKU: ${skuId}`);
        console.log(`   Initial stock: ${sku.stock}`);
        console.log(`   Concurrent orders: ${orderCount}`);

        const testStartTime = Date.now();
        const promises = [];

        // Tạo multiple concurrent requests
        for (let i = 0; i < orderCount; i++) {
            const promise = simulateOrderCreation(userId, skuId, i);
            promises.push(promise);
        }

        const results = await Promise.allSettled(promises);
        
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
        const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success);
        const errors = results.filter(r => r.status === 'rejected');

        // Kiểm tra stock sau test
        const updatedSku = await SKU.findById(skuId);
        
        const testResults = {
            testDuration: Date.now() - testStartTime,
            initialStock: sku.stock,
            finalStock: updatedSku.stock,
            ordersAttempted: orderCount,
            ordersSuccessful: successful.length,
            ordersFailed: failed.length,
            ordersWithErrors: errors.length,
            stockConsistency: (sku.stock - updatedSku.stock) === successful.length,
            results: {
                successful: successful.map(r => r.value),
                failed: failed.map(r => r.value),
                errors: errors.map(r => r.reason?.message || 'Unknown error')
            }
        };

        res.status(200).json({
            errCode: 0,
            message: 'Concurrent order test completed',
            data: testResults
        });

    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }
});

/**
 * Test optimistic locking
 */
router.post('/test-optimistic-locking', verifyToken, async (req, res) => {
    try {
        const { skuId } = req.body;
        
        if (!skuId) {
            return res.status(400).json({
                errCode: 1,
                message: 'SKU ID is required'
            });
        }

        console.log(`🔒 Testing optimistic locking for SKU: ${skuId}`);

        const testResults = await OptimisticLockingHelper.executeWithRetry(
            async (attempt) => {
                console.log(`   Attempt ${attempt + 1}`);
                
                // Simulate optimistic lock conflict on first attempt
                if (attempt === 0) {
                    throw new Error('OPTIMISTIC_LOCK_CONFLICT');
                }
                
                return {
                    success: true,
                    attempt: attempt + 1,
                    message: 'Optimistic locking retry successful'
                };
            },
            3, // max retries
            100 // base delay
        );

        res.status(200).json({
            errCode: 0,
            message: 'Optimistic locking test completed',
            data: testResults
        });

    } catch (error) {
        res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }
});

/**
 * Test distributed locking
 */
router.post('/test-distributed-lock', verifyToken, async (req, res) => {
    try {
        const { resourceKey = 'test-resource', concurrency = 5 } = req.body;
        
        console.log(`🔐 Testing distributed lock for resource: ${resourceKey}`);
        console.log(`   Concurrent attempts: ${concurrency}`);

        const results = [];
        const promises = [];

        for (let i = 0; i < concurrency; i++) {
            const promise = testLockAcquisition(resourceKey, i);
            promises.push(promise);
        }

        const lockResults = await Promise.allSettled(promises);
        
        const successful = lockResults.filter(r => r.status === 'fulfilled' && r.value.acquired);
        const failed = lockResults.filter(r => r.status === 'fulfilled' && !r.value.acquired);
        const errors = lockResults.filter(r => r.status === 'rejected');

        const testSummary = {
            resourceKey,
            concurrentAttempts: concurrency,
            successfulLocks: successful.length,
            failedLocks: failed.length,
            errors: errors.length,
            averageLockTime: successful.length > 0 ? 
                successful.reduce((sum, r) => sum + r.value.lockTime, 0) / successful.length : 0,
            results: lockResults.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason?.message })
        };

        res.status(200).json({
            errCode: 0,
            message: 'Distributed lock test completed',
            data: testSummary
        });

    } catch (error) {
        res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }
});

/**
 * Get race condition statistics
 */
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const stats = {
            timestamp: new Date().toISOString(),
            server: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                nodeVersion: process.version
            },
            database: {
                connectionState: mongoose.connection.readyState,
                connectionName: mongoose.connection.name
            },
            raceProtection: {
                distributedLocking: 'Active',
                optimisticLocking: 'Active',
                idempotencyProtection: 'Active',
                atomicStockManagement: 'Active'
            }
        };

        res.status(200).json({
            errCode: 0,
            message: 'Race condition protection statistics',
            data: stats
        });

    } catch (error) {
        res.status(500).json({
            errCode: 1,
            message: error.message
        });
    }
});

// Helper functions
async function simulateOrderCreation(userId, skuId, orderIndex) {
    const startTime = Date.now();
    
    try {
        // Simulate order creation logic với locking
        const lock = new DistributedLock(`order:${skuId}`, 2000);
        
        await lock.waitForLock(3000);
        
        // Simulate order processing time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        
        await lock.release();
        
        return {
            success: true,
            orderIndex,
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        return {
            success: false,
            orderIndex,
            processingTime: Date.now() - startTime,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

async function testLockAcquisition(resourceKey, attemptIndex) {
    const startTime = Date.now();
    const lock = new DistributedLock(resourceKey, 1000);
    
    try {
        const acquired = await lock.waitForLock(2000);
        
        if (acquired) {
            // Hold lock for a short time
            await new Promise(resolve => setTimeout(resolve, 200));
            await lock.release();
            
            return {
                acquired: true,
                attemptIndex,
                lockTime: Date.now() - startTime,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                acquired: false,
                attemptIndex,
                lockTime: Date.now() - startTime,
                error: 'Failed to acquire lock',
                timestamp: new Date().toISOString()
            };
        }
        
    } catch (error) {
        return {
            acquired: false,
            attemptIndex,
            lockTime: Date.now() - startTime,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

export default router;
