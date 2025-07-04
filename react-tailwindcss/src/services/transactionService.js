import api from '../axios';

export const getUserTransactions = async () => {
    // Due to axios interceptor, the response is already unwrapped to response.data
    // So this call returns the transactions array directly
    const transactions = await api.get('/api/transactions');
    console.log('Transaction API response:', transactions);
    
    // Ensure we return an array
    return Array.isArray(transactions) ? transactions : [];
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
