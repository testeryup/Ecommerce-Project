import api from '../axios';
import { retryWithBackoff, parseRaceConditionError } from '../ultils/raceConditionHelper';

/**
 * Enhanced order service with race condition protection
 */

/**
 * Create order with automatic retry and race condition handling
 * @param {Array} items - Array of order items
 * @param {Object} options - Additional options {maxRetries, enableRetry}
 * @returns {Promise} - Order creation result
 */
export const createOrderWithProtection = async (items, options = {}) => {
    const { maxRetries = 3, enableRetry = true } = options;
    
    const transformedItems = items.map(item => ({
        skuId: item.skuId,
        quantity: item.quantity
    }));

    const apiCall = () => api.post('/api/orders', { items: transformedItems });

    if (enableRetry) {
        return await retryWithBackoff(apiCall, maxRetries);
    } else {
        return await apiCall();
    }
};

/**
 * Initialize order with protection
 * @param {Array} items - Array of order items
 * @returns {Promise} - Order initialization result
 */
export const initOrderWithProtection = async (items) => {
    const transformedItems = items.map(item => ({
        skuId: item.skuId,
        quantity: item.quantity
    }));

    try {
        return await api.post('/api/orders/init', { items: transformedItems });
    } catch (error) {
        const errorInfo = parseRaceConditionError(error);
        throw {
            ...error,
            userMessage: errorInfo.message,
            shouldRetry: errorInfo.shouldRetry,
            retryDelay: errorInfo.retryDelay
        };
    }
};

export const getAllOrder = async () => {
    try {
        const response = await api.get('/api/seller/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    const apiCall = () => api.get(`/api/orders/${orderId}`);
    
    try {
        const response = await retryWithBackoff(apiCall, 2);
        return response.data;
    } catch (error) {
        const errorInfo = parseRaceConditionError(error);
        console.error('Error fetching order:', error);
        throw {
            ...error,
            userMessage: errorInfo.message
        };
    }
};

export const updateOrderStatus = async (orderId, status) => {
    const apiCall = () => api.put(`/api/orders/${orderId}/status`, { status });
    
    try {
        const response = await retryWithBackoff(apiCall, 3);
        return response.data;
    } catch (error) {
        const errorInfo = parseRaceConditionError(error);
        console.error('Error updating order status:', error);
        throw {
            ...error,
            userMessage: errorInfo.message
        };
    }
};

export default {
    getAllOrder,
    getOrderById,
    updateOrderStatus,
    createOrderWithProtection,
    initOrderWithProtection
};
