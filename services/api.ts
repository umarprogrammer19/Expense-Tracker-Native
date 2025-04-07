import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for API requests
const API_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (userData: { name: string; email: string; password: string; role?: string }) => {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post('/api/auth/login', credentials);
        await AsyncStorage.setItem('token', response.data.token);
        return response.data;
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
    },
};

// Expense API
export const expenseAPI = {
    getExpenses: async () => {
        const response = await api.get('/api/expenses');
        return response.data;
    },

    addExpense: async (expenseData: any) => {
        const response = await api.post('/api/expenses', expenseData);
        return response.data;
    },

    updateExpense: async (id: string, expenseData: any) => {
        const response = await api.put(`/api/expenses/${id}`, expenseData);
        return response.data;
    },

    deleteExpense: async (id: string) => {
        const response = await api.delete(`/api/expenses/${id}`);
        return response.data;
    },
};

// Admin API
export const adminAPI = {
    getUsers: async () => {
        const response = await api.get('/api/users');
        return response.data;
    },

    getAllExpenses: async () => {
        const response = await api.get('/api/expenses/all');
        return response.data;
    },
};

export default api;