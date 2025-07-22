import api from '../axios';

export const getUserProfile = () => {
    return api.get('/api/user/profile');
}

export const getCategory = () => {
    return api.get('/api/category');
}
export const createOrUpdateProduct = (data) => {
    return api.post('/api/products', data);
}
export const getProductById = (id) => {
    return api.get(`/api/seller/products/${id}`);
}
export const userGetProductById = (id) => {
    return api.get(`/api/products/${id}`);
}
export const getProducts = () => {
    return api.get('/api/products');
}

export const initOrder = (items) => {
    // Transform items to match backend expectations - only send skuId and quantity
    const transformedItems = items.map(item => ({
        skuId: item.skuId,
        quantity: item.quantity
    }));
    console.log('Sending to initOrder API:', { items: transformedItems });
    return api.post('/api/orders/init', { items: transformedItems });
}

export const createOrder = (items) => {
    // Transform items to match backend expectations - only send skuId and quantity
    const transformedItems = items.map(item => ({
        skuId: item.skuId,
        quantity: item.quantity
    }));
    console.log('Sending to createOrder API:', { items: transformedItems });
    return api.post('/api/orders', { items: transformedItems });
}

export const getSkuNames = (skus) => {
    return api.get('/api/sku', { items: skus });
}

export const getOrderById = (id) => {
    return api.get(`/api/orders/${id}`);
}

export const getOrders = ({ page = 1, limit = 10, status = 'all' }) => {
    return api.get(`/api/orders?page=${page}&limit=${limit}&status=${status}`);
}

export const updateUserProfile = (data) => {
    return api.put('/api/user/profile', data);
}

export const getUserBalance = () => {
    return api.get('/api/user/balance');
}

export const createPaymentLink = (amount) => {
    return api.post('/api/transactions/topup', { amount });
}

export const getAllUser = () => {
    return api.get('/api/admin/users');
}

export const validatePromo = (code) => {
    return api.get(`/api/promo/${code}`);
}
const userService = {
    getUserProfile,
    updateUserProfile,
    getCategory,
    createOrUpdateProduct,
    getProducts,
    userGetProductById,
    getSkuNames,
    getOrders,
    getOrderById,
    getUserBalance,
    createPaymentLink,
    initOrder,
    createOrder,
    getAllUser
}
export default userService;