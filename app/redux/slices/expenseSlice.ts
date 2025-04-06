import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../../types';

interface ExpenseState {
    list: Expense[];
    loading: boolean;
}

const initialState: ExpenseState = {
    list: [],
    loading: false,
};

const getAuthHeaders = async () => ({
    headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
    },
});

export const fetchExpenses = createAsyncThunk('expenses/fetch', async () => {
    const res = await axios.get('http://localhost:5000/api/expenses', await getAuthHeaders());
    return res.data;
});

export const addExpense = createAsyncThunk('expenses/add', async (payload: Omit<Expense, '_id'>) => {
    const res = await axios.post('http://localhost:5000/api/expenses', payload, await getAuthHeaders());
    return res.data;
});

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchExpenses.fulfilled, (state, action) => {
            state.list = action.payload;
        });
        builder.addCase(addExpense.fulfilled, (state, action) => {
            state.list.push(action.payload);
        });
    },
});

export default expenseSlice.reducer;
