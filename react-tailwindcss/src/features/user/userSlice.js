// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from '../../services/userService';
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, thunkAPI) => {
        try {
            const response = await userService.getUserProfile();
            // Backend trả về user object trực tiếp, không có wrapper .data
            return response; 
        } catch (error) {
            const message = 
                (error.response && 
                    error.response.data && 
                    error.response.data.message) ||
                error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        role: null,
        language: 'vn', // Example user preference
        profile: null,
        error: null
    },
    reducers: {
        setUserRole: (state, action) => {
            state.role = action.payload;
        },
        clearUserProfile: (state) => {
            state.role = null;
            state.profile = null;
            state.error = null;
        },
        setUserLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                // Set role from profile directly (not from nested user object)
                state.role = action.payload?.role;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setUserRole, clearUserProfile, setUserLanguage } = userSlice.actions;
export default userSlice.reducer;