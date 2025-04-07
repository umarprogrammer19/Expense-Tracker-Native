"use client"

import type React from "react"

import { useEffect } from "react"
import { Stack, useRouter, useSegments } from "expo-router"
import { Provider } from "react-redux"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import { ActivityIndicator, View } from "react-native"
import * as SplashScreen from "expo-splash-screen"

import { store } from "../store"
import { useAuth } from "../hooks/useAuth"
import { checkAuth } from "../store/slices/authSlice"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Auth context provider to manage authentication state
function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, userRole } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (isLoggedIn && inAuthGroup) {
      // If user is logged in and in auth group, redirect to appropriate screen
      if (userRole === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/home")
      }
    } else if (!isLoggedIn && !inAuthGroup) {
      // If user is not logged in and not in auth group, redirect to login
      router.replace("/login")
    }
  }, [isLoggedIn, segments, isLoading, userRole])

  return <>{children}</>
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  })

  useEffect(() => {
    // Initialize auth state
    store.dispatch(checkAuth())

    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    )
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  )
}

