"use client"

import { useNavigation } from '@react-navigation/native'
import { Slot, useSegments } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"
import { Provider, useSelector } from "react-redux"
import { checkAuth } from "./store/slices/authSlice"
import type { RootState } from "./store/store"
import { store } from "./store/store"


// Keep the splash screen visible while we check authentication
SplashScreen.preventAutoHideAsync()

// Auth check component
function AuthCheck() {
  const { token, loading } = useSelector((state: RootState) => state.auth)
  const segments: any = useSegments()
  const router = useNavigation()

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (!token && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace("/(auth)/login")
    } else if (token && inAuthGroup) {
      // Redirect to the home page if authenticated
      router.replace("/(app)/(tabs)")
    }

    // Hide splash screen once auth check is complete
    SplashScreen.hideAsync()
  }, [token, loading, segments])

  return <Slot />
}

export default function RootLayout() {
  useEffect(() => {
    // Check if user is already logged in
    store.dispatch(checkAuth())
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AuthCheck />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}

