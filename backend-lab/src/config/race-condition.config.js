/**
 * Race Condition Protection Configuration
 * Configure various aspects of race condition protection
 */

export const RaceConditionConfig = {
    // Lock timeouts (in milliseconds)
    LOCK_TIMEOUTS: {
        DEFAULT: 10000,      // 10 seconds
        ORDER_CREATION: 15000, // 15 seconds for complex order operations
        INVENTORY_UPDATE: 5000, // 5 seconds for inventory operations
        PAYMENT_PROCESSING: 20000, // 20 seconds for payment operations
        USER_BALANCE: 10000    // 10 seconds for balance updates
    },

    // Retry configurations
    RETRY_CONFIG: {
        MAX_RETRIES: 3,
        BASE_DELAY: 100,      // Base delay in milliseconds
        MAX_DELAY: 5000,      // Maximum delay between retries
        EXPONENTIAL_BACKOFF: true,
        JITTER: true          // Add random jitter to prevent thundering herd
    },

    // Transaction configurations
    TRANSACTION_CONFIG: {
        MAX_TIME_MS: 30000,   // 30 seconds max transaction time
        READ_CONCERN: 'majority',
        WRITE_CONCERN: { w: 'majority', j: true },
        MAX_RETRIES: 3
    },

    // Cache configurations for locks and idempotency
    CACHE_CONFIG: {
        LOCK_TTL: 60000,      // 1 minute TTL for locks
        IDEMPOTENCY_TTL: 24 * 60 * 60 * 1000, // 24 hours for idempotency keys
        CLEANUP_INTERVAL: 60000 // 1 minute cleanup interval
    },

    // Rate limiting configurations
    RATE_LIMIT_CONFIG: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100,          // 100 requests per window
        SKIP_SUCCESSFUL_REQUESTS: false,
        SKIP_FAILED_REQUESTS: false
    },

    // Stock management configurations
    STOCK_CONFIG: {
        MAX_QUANTITY_PER_ORDER: 1000,
        RESERVATION_TIMEOUT: 10 * 60 * 1000, // 10 minutes reservation timeout
        AUTO_RELEASE_EXPIRED: true
    },

    // Monitoring and alerting
    MONITORING: {
        LOG_RACE_CONDITIONS: true,
        LOG_LOCK_TIMEOUTS: true,
        LOG_RETRY_ATTEMPTS: true,
        ALERT_ON_HIGH_CONTENTION: true,
        HIGH_CONTENTION_THRESHOLD: 10 // Alert if more than 10 retries needed
    },

    // Feature flags
    FEATURE_FLAGS: {
        ENABLE_DISTRIBUTED_LOCKING: true,
        ENABLE_OPTIMISTIC_LOCKING: true,
        ENABLE_IDEMPOTENCY: true,
        ENABLE_STOCK_RESERVATION: true,
        ENABLE_DEADLOCK_DETECTION: true
    }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
    // Production settings - more conservative
    RaceConditionConfig.LOCK_TIMEOUTS.DEFAULT = 5000; // Shorter timeout in production
    RaceConditionConfig.RETRY_CONFIG.MAX_RETRIES = 5; // More retries in production
    RaceConditionConfig.TRANSACTION_CONFIG.MAX_TIME_MS = 20000; // Shorter transactions
} else if (process.env.NODE_ENV === 'development') {
    // Development settings - more lenient for debugging
    RaceConditionConfig.LOCK_TIMEOUTS.DEFAULT = 30000; // Longer timeout for debugging
    RaceConditionConfig.MONITORING.LOG_RACE_CONDITIONS = true;
    RaceConditionConfig.MONITORING.LOG_LOCK_TIMEOUTS = true;
    RaceConditionConfig.MONITORING.LOG_RETRY_ATTEMPTS = true;
}

// Helper function to get configuration values
export const getConfig = (path) => {
    const keys = path.split('.');
    let value = RaceConditionConfig;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    
    return value;
};

export default RaceConditionConfig;
