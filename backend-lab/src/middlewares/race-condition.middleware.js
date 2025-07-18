import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Race Condition Protection Middleware
 * Provides comprehensive protection against race conditions in e-commerce operations
 */

// In-memory cache for simple locking (use Redis in production)
const lockCache = new Map();
const requestIdCache = new Map();

/**
 * Distributed Lock Implementation
 * Prevents concurrent operations on the same resource
 */
export class DistributedLock {
    constructor(key, ttl = 30000) { // 30 seconds TTL
        this.key = key;
        this.ttl = ttl;
        this.lockId = crypto.randomUUID();
    }

    async acquire() {
        const now = Date.now();
        const existingLock = lockCache.get(this.key);
        
        // Check if existing lock is expired
        if (existingLock && now - existingLock.timestamp > this.ttl) {
            lockCache.delete(this.key);
        }
        
        // Try to acquire lock
        if (!lockCache.has(this.key)) {
            lockCache.set(this.key, {
                lockId: this.lockId,
                timestamp: now
            });
            return true;
        }
        
        return false;
    }

    async release() {
        const lock = lockCache.get(this.key);
        if (lock && lock.lockId === this.lockId) {
            lockCache.delete(this.key);
            return true;
        }
        return false;
    }

    async waitForLock(maxWaitTime = 5000, checkInterval = 100) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            if (await this.acquire()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
        
        throw new Error(`Lock acquisition timeout for key: ${this.key}`);
    }
}

/**
 * Idempotency Key Middleware
 * Prevents duplicate requests from being processed
 */
export const idempotencyMiddleware = (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];
    
    if (!idempotencyKey) {
        return next();
    }
    
    // Check if this request was already processed
    const existingResponse = requestIdCache.get(idempotencyKey);
    if (existingResponse) {
        const timeDiff = Date.now() - existingResponse.timestamp;
        
        // Return cached response if within 24 hours
        if (timeDiff < 24 * 60 * 60 * 1000) {
            return res.status(existingResponse.status).json(existingResponse.data);
        } else {
            requestIdCache.delete(idempotencyKey);
        }
    }
    
    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json to cache the response
    res.json = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            requestIdCache.set(idempotencyKey, {
                status: res.statusCode,
                data: data,
                timestamp: Date.now()
            });
        }
        return originalJson.call(this, data);
    };
    
    next();
};

/**
 * Optimistic Locking Helper
 * Implements optimistic locking with automatic retry
 */
export class OptimisticLockingHelper {
    static async executeWithRetry(operation, maxRetries = 3, baseDelay = 100) {
        let lastError;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await operation(attempt);
            } catch (error) {
                lastError = error;
                
                // Check if it's a version conflict
                if (error.message === 'OPTIMISTIC_LOCK_CONFLICT' || 
                    error.code === 11000 || // MongoDB duplicate key
                    error.name === 'VersionError') {
                    
                    if (attempt < maxRetries - 1) {
                        // Exponential backoff with jitter
                        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }
                
                throw error;
            }
        }
        
        throw new Error(`Operation failed after ${maxRetries} attempts: ${lastError.message}`);
    }
}

/**
 * Resource Locking Middleware
 * Locks specific resources during operations
 */
export const resourceLockMiddleware = (resourceExtractor) => {
    return async (req, res, next) => {
        let lock;
        
        try {
            const resourceKey = resourceExtractor(req);
            if (!resourceKey) {
                return next();
            }
            
            lock = new DistributedLock(`resource:${resourceKey}`);
            await lock.waitForLock();
            
            // Store lock in request for cleanup
            req.resourceLock = lock;
            next();
            
        } catch (error) {
            if (lock) {
                await lock.release();
            }
            res.status(429).json({
                errCode: 1,
                message: 'Resource is currently locked, please try again later'
            });
        }
    };
};

/**
 * Transaction Helper with Deadlock Detection
 */
export class TransactionHelper {
    static async executeWithTransaction(operation, options = {}) {
        const session = await mongoose.startSession();
        const maxRetries = options.maxRetries || 3;
        let lastError;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                session.startTransaction({
                    readConcern: { level: 'majority' },
                    writeConcern: { w: 'majority', j: true },
                    maxTimeMS: options.maxTimeMS || 30000,
                    ...options.transactionOptions
                });
                
                const result = await operation(session, attempt);
                await session.commitTransaction();
                return result;
                
            } catch (error) {
                await session.abortTransaction();
                lastError = error;
                
                // Check for retryable errors
                if (this.isRetryableError(error) && attempt < maxRetries - 1) {
                    const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                throw error;
            } finally {
                if (attempt === maxRetries - 1 || !this.isRetryableError(lastError)) {
                    session.endSession();
                }
            }
        }
        
        throw lastError;
    }
    
    static isRetryableError(error) {
        if (!error) return false;
        
        const retryableErrors = [
            'TransientTransactionError',
            'UnknownTransactionCommitResult', 
            'WriteConflict',
            'LockTimeout',
            'ExceededTimeLimit'
        ];
        
        return retryableErrors.some(errorType => 
            error.hasErrorLabel && error.hasErrorLabel(errorType)
        ) || error.code === 11000; // Duplicate key error
    }
}

/**
 * Stock Management with Atomic Operations
 */
export class AtomicStockManager {
    static async reserveStock(items, session) {
        const stockReservations = [];
        
        try {
            for (const item of items) {
                const { skuId, quantity } = item;
                
                // Atomic stock decrement with optimistic locking
                const result = await mongoose.model('SKU').updateOne(
                    {
                        _id: skuId,
                        stock: { $gte: quantity },
                        isDeleted: false
                    },
                    {
                        $inc: { 
                            stock: -quantity,
                            reserved: quantity // Track reserved stock
                        }
                    },
                    { session }
                );
                
                if (result.modifiedCount === 0) {
                    throw new Error(`Insufficient stock for SKU: ${skuId}`);
                }
                
                stockReservations.push({ skuId, quantity });
            }
            
            return stockReservations;
            
        } catch (error) {
            // Rollback reservations
            await this.releaseReservations(stockReservations, session);
            throw error;
        }
    }
    
    static async releaseReservations(reservations, session) {
        for (const reservation of reservations) {
            await mongoose.model('SKU').updateOne(
                { _id: reservation.skuId },
                {
                    $inc: {
                        stock: reservation.quantity,
                        reserved: -reservation.quantity
                    }
                },
                { session }
            );
        }
    }
    
    static async confirmReservations(reservations, session) {
        for (const reservation of reservations) {
            await mongoose.model('SKU').updateOne(
                { _id: reservation.skuId },
                {
                    $inc: {
                        reserved: -reservation.quantity,
                        'sales.count': reservation.quantity
                    }
                },
                { session }
            );
        }
    }
}

/**
 * Cleanup expired locks periodically
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, lock] of lockCache.entries()) {
        if (now - lock.timestamp > 60000) { // 1 minute
            lockCache.delete(key);
        }
    }
    
    for (const [key, response] of requestIdCache.entries()) {
        if (now - response.timestamp > 24 * 60 * 60 * 1000) { // 24 hours
            requestIdCache.delete(key);
        }
    }
}, 60000); // Run every minute

export default {
    DistributedLock,
    idempotencyMiddleware,
    OptimisticLockingHelper,
    resourceLockMiddleware,
    TransactionHelper,
    AtomicStockManager
};
