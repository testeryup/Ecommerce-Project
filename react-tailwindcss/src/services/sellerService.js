import api from '../axios';

export const deleteProduct = (id) => {
    return api.delete(`/api/seller/products/${id}`)
}

export const getAllProducts = () => {
    return api.get(`/api/seller/products`);
}

export const uploadInventory = (data) => {
    return api.post(`/api/inventory`, data);
}

export const getInventoryList = (inventoryId) => {
    return api.get(`/api/inventory/${inventoryId}`);
}
export const deleteInventoryById = (inventoryId, skuId) => {
    return api.delete(`/api/inventory`, {
        data: {
            inventoryId,
            skuId
        }
    });
}

export const getOrders = ({ page, limit, status = 'all', startDate, endDate }) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/api/seller/orders?${params.toString()}`);
}

export const refundOrder = () => {

}

export const reportOrder = () => {

}

export const getOrderDetail = (orderId) => {
    return api.get(`/api/seller/orders/${orderId}`);
};

export const getSellerStats = () => {
    return api.get(`/api/seller/dashboard/stats`);
}

export const getWithdrawalRequests = (params) => {
    const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'all',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
    }).toString();
    return api.get(`/api/seller/transactions?${queryString}`);
}

export const createWithdrawalRequest = (amount) => {
    return api.post(`/api/seller/transactions/withdraw`, {amount: amount});
}
const sellerService = {
    getAllProducts, deleteProduct, uploadInventory, getInventoryList, deleteInventoryById, 
    getOrders, getSellerStats, getWithdrawalRequests, createWithdrawalRequest
}

export default sellerService;