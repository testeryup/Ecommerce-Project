import api from '../axios';

export const getUserTransactions = async () => {
    const response = await api.get('/api/transactions');
    return response.data;
};

export const createTopupPaymentLink = async (amount) => {
    const response = await api.post('/api/transactions/topup', { amount });
    return response.data;
};

const transactionService = {
    getUserTransactions,
    createTopupPaymentLink
};

export default transactionService;
