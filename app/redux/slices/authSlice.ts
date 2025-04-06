import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';

interface AuthState {
    user: User | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
};

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', payload);
    await AsyncStorage.setItem('token', res.data.token);
    return res.data.user;
});

export const register = createAsyncThunk('auth/register', async (payload: { name: string; email: string; password: string; role: string }) => {
    await axios.post('http://localhost:5000/api/auth/register', payload);
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            AsyncStorage.removeItem('token');
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
