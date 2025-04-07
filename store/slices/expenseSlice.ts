import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { expenseAPI } from "../../services/api"

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

export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async (_, { rejectWithValue }) => {
    try {
        const expenses = await expenseAPI.getExpenses()
        return expenses
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Failed to fetch expenses")
    }
})

export const addExpenseAsync = createAsyncThunk(
    "expenses/addExpense",
    async (expenseData: Omit<Expense, "id">, { rejectWithValue }) => {
        try {
            const newExpense = await expenseAPI.addExpense(expenseData)
            return newExpense
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Failed to add expense")
        }
    },
)

export const updateExpenseAsync = createAsyncThunk(
    "expenses/updateExpense",
    async ({ id, expenseData }: { id: string; expenseData: Partial<Expense> }, { rejectWithValue }) => {
        try {
            const updatedExpense = await expenseAPI.updateExpense(id, expenseData)
            return updatedExpense
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Failed to update expense")
        }
    },
)

export const deleteExpenseAsync = createAsyncThunk(
    "expenses/deleteExpense",
    async (id: string, { rejectWithValue }) => {
        try {
            await expenseAPI.deleteExpense(id)
            return id
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Failed to delete expense")
        }
    },
)

const initialState: ExpenseState = {
    expenses: [],
    loading: false,
    error: null,
}

const expenseSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        clearExpenseError: (state) => {
            state.error = null
        },
        // Keep these sync actions for optimistic updates
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
        // Fetch Expenses
        builder.addCase(fetchExpenses.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchExpenses.fulfilled, (state, action) => {
            state.expenses = action.payload
            state.loading = false
        })
        builder.addCase(fetchExpenses.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Add Expense
        builder.addCase(addExpenseAsync.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(addExpenseAsync.fulfilled, (state, action) => {
            state.expenses.push(action.payload)
            state.loading = false
        })
        builder.addCase(addExpenseAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Update Expense
        builder.addCase(updateExpenseAsync.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(updateExpenseAsync.fulfilled, (state, action) => {
            const index = state.expenses.findIndex((expense) => expense.id === action.payload.id)
            if (index !== -1) {
                state.expenses[index] = action.payload
            }
            state.loading = false
        })
        builder.addCase(updateExpenseAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Delete Expense
        builder.addCase(deleteExpenseAsync.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deleteExpenseAsync.fulfilled, (state, action) => {
            state.expenses = state.expenses.filter((expense) => expense.id !== action.payload)
            state.loading = false
        })
        builder.addCase(deleteExpenseAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    },
})

export const { clearExpenseError, addExpense, updateExpense, deleteExpense } = expenseSlice.actions

export default expenseSlice.reducer

