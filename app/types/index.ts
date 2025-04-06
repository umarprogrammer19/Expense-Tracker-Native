// Auth Types
export interface User {
    id: string
    name: string
    role: "admin" | "user"
}

export interface AuthState {
    token: string | null
    user: User | null
    loading: boolean
    error: string | null
}

// Expense Types
export interface Expense {
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

export interface ExpenseState {
    expenses: Expense[]
    loading: boolean
    error: string | null
}

