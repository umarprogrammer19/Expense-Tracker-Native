"use client"

import { Redirect } from "expo-router"
import { useAuth } from "../hooks/useAuth"
import { View, ActivityIndicator } from "react-native"

export default function Index() {
  const { isLoggedIn, isLoading, userRole } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    )
  }

  if (isLoggedIn) {
    return userRole === "admin" ? <Redirect href="/admin" /> : <Redirect href="/home" />
  }

  return <Redirect href="/login" />
}

