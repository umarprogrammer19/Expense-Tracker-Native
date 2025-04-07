"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../store"
import { checkAuth } from "../store/slices/authSlice"

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>()
    const { user, token, loading, error } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        dispatch(checkAuth())
    }, [dispatch])

    return {
        isLoggedIn: !!token,
        isLoading: loading,
        user,
        userRole: user?.role || null,
        error,
    }
}

