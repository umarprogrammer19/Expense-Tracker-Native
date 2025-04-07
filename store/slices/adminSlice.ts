import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { adminAPI } from "../../services/api"

interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin"
    createdAt: string
}

interface Expense {
    id: string
    description: string
    amount: number
    category: string
    date: string
    notes?: string
    userId: string
}

interface AdminState {
    users: User[]
    allExpenses: Expense[]
    loading: boolean
    error: string | null
}

export const fetchAllExpenses = createAsyncThunk("admin/fetchAllExpenses", async (_, { rejectWithValue }) => {
    try {
        // Fetch both users and all expenses in parallel
        const [users, expenses] = await Promise.all([adminAPI.getUsers(), adminAPI.getAllExpenses()])

        return {
            users,
            expenses,
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Failed to fetch data")
    }
})

const initialState: AdminState = {
    users: [],
    allExpenses: [],
    loading: false,
    error: null,
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllExpenses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllExpenses.fulfilled, (state, action) => {
                state.users = action.payload.users
                state.allExpenses = action.payload.expenses
                state.loading = false
            })
            .addCase(fetchAllExpenses.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearAdminError } = adminSlice.actions

export default adminSlice.reducer

