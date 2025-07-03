import api from "../axios";

export const getAdminStats = () => {
    return api.get(`/api/admin/stats`);
}
export const getUserStats = (page = 1, limit = 10, role = 'all', status = 'all', search = '') => {
    return api.get(`/api/admin/users?page=${page}&limit=${limit}&role=${role}&status=${status}&search=${search}`);
}

export const changeUserRole = (role, userId) => {
    return api.put(`/api/admin/users/role`, {role: role, userId: userId});
}

export const changeUserStatus = (status, userId) => {
    return api.put(`/api/admin/users/status`, {status: status, userId: userId});
}

export const updateUser = (userId, userData) => {
    return api.put(`/api/admin/users/${userId}`, userData);
};

export const getAdminProducts = (params) => {
    const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'all',
        seller: params.seller || 'all',
        search: params.search || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
    }).toString();
    
    return api.get(`/api/admin/products?${queryString}`);
};

export const changeProductStatus = (productId, status) => {
    return api.put(`/api/admin/products/${productId}/status`, { status });
};

export const getProductStats = () => {
    return api.get('/api/admin/products/stats');
};

export const getTransactionStats = () => {
    return api.get('/api/admin/transactions/stats');
};

export const getTransactions = (params) => {
    const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        type: params.type || 'all',
        status: params.status || 'all',
        search: params.search || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
    }).toString();
    
    return api.get(`/api/admin/transactions?${queryString}`);
};

export const approveWithdraw = (transactionId) => {
    return api.put(`/api/admin/transactions/${transactionId}/approve`);
};

export const rejectWithdraw = (transactionId, reason) => {
    return api.put(`/api/admin/transactions/${transactionId}/reject`, { reason });
};

export const getOrderStats = () => {
    return api.get('/api/admin/stats');
};

export const getAdminOrders = (params) => {
    const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'all',
        search: params.search || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
    }).toString();
    
    return api.get(`/api/orders/all?${queryString}`);
};

export const updateOrderStatus = (orderId, status) => {
    return api.put(`/api/orders/status`, { orderId, status });
};
const adminService = {
    getAdminStats
}

export default adminService;