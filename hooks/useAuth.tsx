"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

export function useAuth() {
    const { user, token, loading } = useSelector((state: RootState) => state.auth)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate checking token validity or refreshing token
        const checkAuth = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))
                setIsLoading(false)
            } catch (error) {
                console.error("Auth check error:", error)
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [token])

    return {
        isLoggedIn: !!token,
        isLoading: isLoading || loading,
        user,
        userRole: user?.role || null,
    }
}

