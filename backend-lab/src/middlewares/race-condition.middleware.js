import mongoose from 'mongoose';
import NodeCache from 'node-cache';

// Cache để lưu trữ locks với TTL 30 giây
const lockCache = new NodeCache({ stdTTL: 30, checkperiod: 5 });

/**
 * Distributed Lock Middleware sử dụng Redis-like cache
 * Ngăn chặn concurrent operations trên cùng một resource
 */
export const distributedLock = (getResourceKey) => {
    return async (req, res, next) => {
        const resourceKey = await getResourceKey(req);
        const lockKey = `lock:${resourceKey}`;
        const lockValue = `${Date.now()}-${Math.random()}`;
        const maxRetries = 3;
        const retryDelay = 100;

        let acquired = false;
        let retries = 0;

        while (retries < maxRetries && !acquired) {
            // Thử acquire lock
            if (!lockCache.has(lockKey)) {
                lockCache.set(lockKey, lockValue, 30); // 30 seconds TTL
                acquired = true;
                break;
            }

            // Nếu không get được lock, wait và retry
            retries++;
            await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retries)));
        }

        if (!acquired) {
            return res.status(429).json({
                errCode: 1,
                message: 'Resource is busy, please try again later'
            });
        }

        // Cleanup function để release lock
        req.releaseLock = () => {
            const currentValue = lockCache.get(lockKey);
            if (currentValue === lockValue) {
                lockCache.del(lockKey);
            }
        };

        // Auto-release lock sau khi response
        const originalSend = res.send;
        res.send = function(data) {
            req.releaseLock();
            return originalSend.call(this, data);
        };

        next();
    };
};

/**
 * Optimistic Locking Middleware cho MongoDB documents
 * Sử dụng __v field để detect concurrent updates
 */
export const optimisticLock = (Model, getDocumentId) => {
    return async (req, res, next) => {
        try {
            const documentId = await getDocumentId(req);
            const document = await Model.findById(documentId);
            
            if (!document) {
                return res.status(404).json({
                    errCode: 1,
                    message: 'Document not found'
                });
            }

            req.originalVersion = document.__v;
            req.documentId = documentId;
            req.Model = Model;

            next();
        } catch (error) {
            res.status(500).json({
                errCode: 1,
                message: error.message
            });
        }
    };
};

/**
 * Rate Limiting Middleware cho specific operations
 * Ngăn chặn spam requests
 */
export const rateLimiter = (options = {}) => {
    const {
        windowMs = 60000, // 1 minute
        maxRequests = 10,
        keyGenerator = (req) => req.user?.id || req.ip
    } = options;

    const requests = new NodeCache({ stdTTL: Math.ceil(windowMs / 1000) });

    return (req, res, next) => {
        const key = keyGenerator(req);
        const current = requests.get(key) || 0;

        if (current >= maxRequests) {
            return res.status(429).json({
                errCode: 1,
                message: 'Too many requests, please try again later'
            });
        }

        requests.set(key, current + 1);
        next();
    };
};

/**
 * Transaction Retry Middleware
 * Tự động retry operations khi gặp write conflicts
 */
export const transactionRetry = (maxRetries = 3) => {
    return (req, res, next) => {
        req.retryTransaction = async (operation) => {
            let lastError;
            
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                const session = await mongoose.startSession();
                session.startTransaction();
                
                try {
                    const result = await operation(session);
                    await session.commitTransaction();
                    return result;
                } catch (error) {
                    await session.abortTransaction();
                    lastError = error;
                    
                    // Retry nếu là write conflict hoặc optimistic lock conflict
                    if (
                        error.code === 11000 || // Duplicate key
                        error.message.includes('OPTIMISTIC_LOCK_CONFLICT') ||
                        error.message.includes('WriteConflict')
                    ) {
                        const delay = Math.pow(2, attempt) * 100 + Math.random() * 100;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    
                    // Không retry nếu không phải write conflict
                    throw error;
                } finally {
                    session.endSession();
                }
            }
            
            throw lastError;
        };
        
        next();
    };
};

/**
 * Inventory Lock Middleware
 * Đặc biệt cho inventory operations
 */
export const inventoryLock = distributedLock((req) => {
    const skuId = req.body.skuId || req.params.skuId;
    return `inventory:${skuId}`;
});

/**
 * Order Creation Lock Middleware
 * Ngăn chặn duplicate orders từ cùng user
 */
export const orderCreationLock = distributedLock((req) => {
    return `order:${req.user.id}`;
});

/**
 * User Balance Lock Middleware
 * Bảo vệ user balance operations
 */
export const userBalanceLock = distributedLock((req) => {
    const userId = req.user?.id || req.body.userId || req.params.userId;
    return `balance:${userId}`;
});

/**
 * Stock Update Lock Middleware
 * Bảo vệ stock updates
 */
export const stockUpdateLock = distributedLock((req) => {
    const skuIds = req.body.items?.map(item => item.skuId) || [req.params.skuId];
    return `stock:${skuIds.sort().join(':')}`;
});
