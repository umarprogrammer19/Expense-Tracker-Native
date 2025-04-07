import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import expenseReducer from "./slices/expenseSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expenseReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

