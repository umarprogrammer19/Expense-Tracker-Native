import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"

interface Expense {
    id: string
    description: string
    amount: number
    category: string
    date: string
    notes?: string
    userId?: string
}

interface ExpenseState {
    expenses: Expense[]
    loading: boolean
    error: string | null
}

// Mock data for demo purposes
const mockExpenses: Expense[] = [
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
        userId: "1",
    },
    {
        id: "4",
        description: "New Headphones",
        amount: 129.99,
        category: "Shopping",
        date: new Date(2023, 3, 10).toISOString(),
        userId: "1",
    },
    {
        id: "5",
        description: "Electricity Bill",
        amount: 75.2,
        category: "Utilities",
        date: new Date(2023, 3, 5).toISOString(),
        userId: "1",
    },
]

// Async thunk for fetching expenses
export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async (_, { rejectWithValue }) => {
    try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockExpenses
    } catch (error) {
        return rejectWithValue("Failed to fetch expenses")
    }
})

const initialState: ExpenseState = {
    expenses: [],
    loading: false,
    error: null,
}

const expenseSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        addExpense: (state, action: PayloadAction<Expense>) => {
            state.expenses.push(action.payload)
        },
        updateExpense: (state, action: PayloadAction<Expense>) => {
            const index = state.expenses.findIndex((expense) => expense.id === action.payload.id)
            if (index !== -1) {
                state.expenses[index] = action.payload
            }
        },
        deleteExpense: (state, action: PayloadAction<string>) => {
            state.expenses = state.expenses.filter((expense) => expense.id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.expenses = action.payload
                state.loading = false
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { addExpense, updateExpense, deleteExpense } = expenseSlice.actions

export default expenseSlice.reducer

