// src/services/authService.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
}

const register = async (email, password, username) => {
    const response = await api.post('/api/auth/register', { email, password, username });
    return response.data;
}

const logout = () => {
    return api.get('/api/auth/logout');
}

const refresh = () => {
    // This will use authApi internally without causing circular dependency
    return import('./authApi').then(module => module.default.get('/api/auth/refresh'));
}

const authService = {
    login, register, logout, refresh
};

export default authService;