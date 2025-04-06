import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// API URL
const API_URL = "http://localhost:5000/api"

// Types
type User = {
    id: string
    name: string
    role: "admin" | "user"
}

type AuthState = {
    token: string | null
    user: User | null
    loading: boolean
    error: string | null
}

type LoginCredentials = {
    email: string
    password: string
}

type RegisterData = {
    name: string
    email: string
    password: string
    role: "admin" | "user"
}

// Async thunks
export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials)

        // Save token to AsyncStorage
        await AsyncStorage.setItem("token", response.data.token)
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user))

        return response.data
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Login failed. Please check your credentials.")
    }
})

export const register = createAsyncThunk("auth/register", async (userData: RegisterData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData)
        return response.data
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Registration failed. Please try again.")
    }
})

export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const user = await AsyncStorage.getItem("user")

        if (!token || !user) {
            return rejectWithValue("No token or user found")
        }

        return { token, user: JSON.parse(user) }
    } catch (error) {
        return rejectWithValue("Failed to load user")
    }
})

export const logout = createAsyncThunk("auth/logout", async () => {
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("user")
    return null
})

// Initial state
const initialState: AuthState = {
    token: null,
    user: null,
    loading: false,
    error: null,
}

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.token
                state.user = action.payload.user
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Register
            .addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.token
                state.user = action.payload.user
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false
                state.token = null
                state.user = null
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.token = null
                state.user = null
            })
    },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

