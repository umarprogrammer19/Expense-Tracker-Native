import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

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

// Mock data for demo purposes
const mockUsers: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "user@example.com",
        role: "user",
        createdAt: new Date(2023, 1, 15).toISOString(),
    },
    {
        id: "2",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date(2023, 0, 10).toISOString(),
    },
    {
        id: "3",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        createdAt: new Date(2023, 2, 5).toISOString(),
    },
    {
        id: "4",
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "user",
        createdAt: new Date(2023, 2, 20).toISOString(),
    },
]

const mockAllExpenses: Expense[] = [
    {
        id: "1",
        description: "Grocery Shopping",
        amount: 85.75,
        category: "Food",
        date: new Date(2023, 3, 15).toISOString(),
        notes: "Weekly grocery shopping at Whole Foods",
        userId: "1",
    },
    {
        id: "2",
        description: "Uber Ride",
        amount: 24.5,
        category: "Transport",
        date: new Date(2023, 3, 14).toISOString(),
        userId: "1",
    },
    {
        id: "3",
        description: "Movie Tickets",
        amount: 32.0,
        category: "Entertainment",
        date: new Date(2023, 3, 12).toISOString(),
        notes: "Watched Avengers with friends",
        userId: "3",
    },
    {
        id: "4",
        description: "New Headphones",
        amount: 129.99,
        category: "Shopping",
        date: new Date(2023, 3, 10).toISOString(),
        userId: "3",
    },
    {
        id: "5",
        description: "Electricity Bill",
        amount: 75.2,
        category: "Utilities",
        date: new Date(2023, 3, 5).toISOString(),
        userId: "4",
    },
    {
        id: "6",
        description: "Office Supplies",
        amount: 45.3,
        category: "Shopping",
        date: new Date(2023, 3, 8).toISOString(),
        userId: "4",
    },
    {
        id: "7",
        description: "Dinner with Clients",
        amount: 120.0,
        category: "Food",
        date: new Date(2023, 3, 7).toISOString(),
        userId: "1",
    },
]

// Async thunk for fetching all expenses (admin only)
export const fetchAllExpenses = createAsyncThunk("admin/fetchAllExpenses", async (_, { rejectWithValue }) => {
    try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
            users: mockUsers,
            expenses: mockAllExpenses,
        }
    } catch (error) {
        return rejectWithValue("Failed to fetch data")
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
    reducers: {},
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

export default adminSlice.reducer

