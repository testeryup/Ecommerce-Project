import axios from '../axios';

const subscriptionService = {
    // Bắt đầu subscription mới
    startSubscription: (data) => {
        return axios.post('/api/subscription/start', data);
    },

    // Gia hạn subscription
    renewSubscription: (accountId, additionalDays, orderId) => {
        return axios.post('/api/inventory/renew-subscription', {
            accountId,
            additionalDays,
            orderId
        });
    },

    // Lấy thông tin subscription của user
    getUserSubscriptions: () => {
        return axios.get('/api/user/subscriptions');
    },

    // Kiểm tra tài khoản có thể gia hạn không
    checkRenewable: (accountId) => {
        return axios.get(`/api/subscription/renewable/${accountId}`);
    },

    // Lấy lịch sử subscription
    getSubscriptionHistory: (accountId) => {
        return axios.get(`/api/subscription/history/${accountId}`);
    },

    // Thông báo sắp hết hạn
    getExpiringNotifications: () => {
        return axios.get('/api/subscription/expiring-notifications');
    }
};

export default subscriptionService;
