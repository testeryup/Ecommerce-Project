/**
 * Frontend Race Condition Helper
 * Utilities to handle race condition scenarios from backend
 */

// Import useState for useLoadingState hook
import { useState } from 'react';

/**
 * Parse backend error and return user-friendly message
 * @param {Error} error - Error from API call
 * @returns {Object} - {message: string, shouldRetry: boolean, retryDelay: number}
 */
export const parseRaceConditionError = (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    switch (status) {
        case 429: // Rate Limited
            return {
                message: 'Có quá nhiều yêu cầu đặt hàng. Vui lòng thử lại sau ít phút.',
                shouldRetry: true,
                retryDelay: 60000 // 1 minute
            };
            
        case 409: // Conflict (race condition detected)
            return {
                message: 'Sản phẩm đã được mua bởi người khác hoặc có xung đột dữ liệu. Vui lòng thử lại.',
                shouldRetry: true,
                retryDelay: 2000 // 2 seconds
            };
            
        case 400: // Bad Request (could be stock issue)
            if (message?.includes('stock') || message?.includes('Insufficient')) {
                return {
                    message: 'Số lượng sản phẩm không đủ. Vui lòng kiểm tra lại giỏ hàng.',
                    shouldRetry: false,
                    retryDelay: 0
                };
            }
            break;
            
        case 503: // Service Unavailable
            return {
                message: 'Hệ thống đang bận. Vui lòng thử lại sau ít giây.',
                shouldRetry: true,
                retryDelay: 3000 // 3 seconds
            };
            
        case 500: // Internal Server Error
            if (message?.includes('OPTIMISTIC_LOCK_CONFLICT')) {
                return {
                    message: 'Dữ liệu đã được cập nhật bởi người khác. Vui lòng thử lại.',
                    shouldRetry: true,
                    retryDelay: 1500 // 1.5 seconds
                };
            }
            break;
    }
    
    return {
        message: message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
        shouldRetry: false,
        retryDelay: 0
    };
};

/**
 * Create debounced function to prevent rapid successive calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Create throttled function to limit call frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Auto-retry function with exponential backoff
 * @param {Function} apiCall - API function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Promise that resolves when successful or max retries reached
 */
export const retryWithBackoff = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            return await apiCall();
        } catch (error) {
            attempt++;
            
            const errorInfo = parseRaceConditionError(error);
            
            if (!errorInfo.shouldRetry || attempt >= maxRetries) {
                throw error;
            }
            
            // Exponential backoff with jitter
            const delay = Math.min(
                baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
                30000 // Max 30 seconds
            );
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

/**
 * Hook to manage loading states and prevent duplicate API calls
 * @returns {Object} - {isLoading, setLoading, preventDuplicate}
 */
export const useLoadingState = () => {
    const [loadingStates, setLoadingStates] = useState(new Map());
    
    const setLoading = (key, isLoading) => {
        setLoadingStates(prev => {
            const newMap = new Map(prev);
            if (isLoading) {
                newMap.set(key, true);
            } else {
                newMap.delete(key);
            }
            return newMap;
        });
    };
    
    const isLoading = (key) => loadingStates.has(key);
    
    const preventDuplicate = (key, asyncFunction) => {
        return async (...args) => {
            if (isLoading(key)) {
                console.warn(`Operation ${key} is already in progress`);
                return;
            }
            
            setLoading(key, true);
            try {
                return await asyncFunction(...args);
            } finally {
                setLoading(key, false);
            }
        };
    };
    
    return {
        isLoading,
        setLoading,
        preventDuplicate
    };
};
