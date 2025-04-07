import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authAPI } from "../../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
    name: string
    email?: string
    role: "user" | "admin"
}

interface AuthState {
    user: any;
    token: string | null
    loading: boolean
    error: string | null
}

// Check if token exists in AsyncStorage on app start
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem("token")
        if (!token) return { user: null, token: null }

        // In a real app, you might want to validate the token with the server
        // For now, we'll just parse the JWT to get the user ID
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join(""),
        )
        const { id } = JSON.parse(jsonPayload)

        // Fetch user data
        // In a real app, you would have an endpoint to get user data by token
        // For now, we'll just return a basic user object
        return {
            user: { id, name: "User", role: "user" },
            token,
        }
    } catch (error) {
        return rejectWithValue("Authentication failed")
    }
})

export const register = createAsyncThunk(
    "auth/register",
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            await authAPI.register(userData)
            // After registration, login the user
            const loginData = await authAPI.login({
                email: userData.email,
                password: userData.password,
            })
            return loginData
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Registration failed")
        }
    },
)

export const login = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const data = await authAPI.login(credentials)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Login failed")
        }
    },
)

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await authAPI.logout()
        return null
    } catch (error: any) {
        return rejectWithValue("Logout failed")
    }
})

const initialState: AuthState = {
    user: null,
    token: null,
    loading: true, // Start with loading true to check for existing token
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
    },
    extraReducers: (builder) => {
        // Check Auth
        builder.addCase(checkAuth.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.loading = false
        })
        builder.addCase(checkAuth.rejected, (state, action) => {
            state.user = null
            state.token = null
            state.loading = false
            state.error = action.payload as string
        })

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.loading = false
        })
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.loading = false
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Logout
        builder.addCase(logout.pending, (state) => {
            state.loading = true
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null
            state.token = null
            state.loading = false
        })
        builder.addCase(logout.rejected, (state) => {
            state.loading = false
        })
    },
})

export const { clearError, updateUser } = authSlice.actions

export default authSlice.reducer

