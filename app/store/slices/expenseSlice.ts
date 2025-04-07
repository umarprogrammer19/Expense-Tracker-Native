import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// API URL - Replace with your actual backend URL
const API_URL = "http://localhost:5000/api"

// Types
type Expense = {
    _id: string
    amount: number
    category: string
    date: string
    description: string
    currency: string
    user?: {
        _id: string
        name: string
    }
}

type ExpenseState = {
    expenses: Expense[]
    loading: boolean
    error: string | null
}

type ExpenseData = {
    amount: number
    category: string
    date: string
    description: string
    currency: string
}

// Helper to get auth token
const getAuthToken = async () => {
    const token = await AsyncStorage.getItem("token")
    return token
}

// Async thunks
export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async (_, { rejectWithValue }) => {
    try {
        const token = await getAuthToken()

        if (!token) {
            return rejectWithValue("No auth token found")
        }

        const config = {
            headers: {
                "x-auth-token": token,
            },
        }

        const response = await axios.get(`${API_URL}/expenses`, config)
        return response.data
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Failed to fetch expenses")
    }
})

export const addExpense = createAsyncThunk(
    "expenses/addExpense",
    async (expenseData: ExpenseData, { rejectWithValue }) => {
        try {
            const token = await getAuthToken()

            if (!token) {
                return rejectWithValue("No auth token found")
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                },
            }

            const response = await axios.post(`${API_URL}/expenses`, expenseData, config)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Failed to add expense")
        }
    },
)

export const updateExpense = createAsyncThunk(
    "expenses/updateExpense",
    async ({ id, expenseData }: { id: string; expenseData: ExpenseData }, { rejectWithValue }) => {
        try {
            const token = await getAuthToken()

            if (!token) {
                return rejectWithValue("No auth token found")
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                },
            }

            const response = await axios.put(`${API_URL}/expenses/${id}`, expenseData, config)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Failed to update expense")
        }
    },
)

export const deleteExpense = createAsyncThunk("expenses/deleteExpense", async (id: string, { rejectWithValue }) => {
    try {
        const token = await getAuthToken()

        if (!token) {
            return rejectWithValue("No auth token found")
        }

        const config = {
            headers: {
                "x-auth-token": token,
            },
        }

        await axios.delete(`${API_URL}/expenses/${id}`, config)
        return id
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Failed to delete expense")
    }
})

// Initial state
const initialState: ExpenseState = {
    expenses: [],
    loading: false,
    error: null,
}

// Slice
const expenseSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false
                state.expenses = action.payload
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Add Expense
            .addCase(addExpense.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.loading = false
                state.expenses.push(action.payload)
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Update Expense
            .addCase(updateExpense.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.loading = false
                state.expenses = state.expenses.map((expense) =>
                    expense._id === action.payload._id ? action.payload : expense,
                )
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Delete Expense
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.loading = false
                state.expenses = state.expenses.filter((expense) => expense._id !== action.payload)
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearError } = expenseSlice.actions
export default expenseSlice.reducer

