import axios from '../axios';

const inventoryService = {
    // Upload inventory với subscription support
    uploadInventory: (data) => {
        return axios.post('/api/inventory/', data);
    },

    // Lấy danh sách inventory với filter
    getInventory: (params = {}) => {
        return axios.get('/api/inventory/', { params });
    },

    // Gia hạn subscription
    renewSubscription: (data) => {
        return axios.post('/api/inventory/renew-subscription', data);
    },

    // Reset password tài khoản
    resetAccountPassword: (accountId) => {
        return axios.post(`/api/inventory/reset-password/${accountId}`);
    },

    // Lấy thống kê subscription
    getSubscriptionStats: () => {
        return axios.get('/api/inventory/stats/subscriptions');
    },

    // Lấy tài khoản sắp hết hạn
    getExpiringSoon: (hours = 24) => {
        return axios.get(`/api/inventory/expiring-soon?hours=${hours}`);
    },

    // Legacy methods (giữ lại để tương thích)
    getInventoryBySkuId: (skuId) => {
        return axios.get(`/api/inventory/${skuId}`);
    },

    deleteInventoryById: (data) => {
        return axios.delete('/api/inventory/', { data });
    }
};

export default inventoryService;
