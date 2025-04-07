"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { StatusBar } from "react-native"
import store from "./redux/store"
import AppNavigator from "./navigation/AppNavigator"
import { loadUser } from "./redux/slices/authSlice"
import { Redirect } from "expo-router"

const App = () => {
  useEffect(() => {
    // Load user from AsyncStorage on app start
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#2e7d32" barStyle="light-content" />
      <AppNavigator />
    </Provider>
  )
}

// Redirect from the root to the appropriate starting point
export default function Index() {
  return <Redirect href="/" />
}

