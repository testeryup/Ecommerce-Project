// src/middlewares/authMiddleware.js
import { setAuthToken } from '../axios';
import { logout } from '../features/auth/authSlice';

export const authMiddleware = (storeAPI) => (next) => (action) => {
    // Handle successful login
    console.log("Action in middleware:", action.type, action.payload);
    
    if (action.type === 'auth/login/fulfilled' || 
        action.type === 'auth/refreshToken/fulfilled' || 
        action.type === 'auth/register/fulfilled') {
        
        // Check if payload has token
        if (action.payload && action.payload.token) {
            console.log("Setting token in middleware:", action.payload.token);
            setAuthToken(action.payload.token);
        } else {
            console.warn("No token found in payload:", action.payload);
        }
    }

    // Handle successful logout
    if (action.type === 'auth/logout/fulfilled') {
        console.log("Clearing token in middleware");
        setAuthToken(null);
    }

    // Handle refreshToken rejected to trigger logout
    if (action.type === 'auth/refreshToken/rejected') {
        console.log("Refresh token rejected, logging out");
        storeAPI.dispatch(logout());
    }

    return next(action);
};