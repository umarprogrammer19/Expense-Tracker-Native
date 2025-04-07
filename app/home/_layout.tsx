"use client"
import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import { View, Text } from "react-native"

export default function HomeLayout() {
    const { isLoggedIn } = useAuth()

    // Protect this route
    if (!isLoggedIn) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Unauthorized. Please login.</Text>
            </View>
        )
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#0066FF",
                tabBarInactiveTintColor: "#8E8E93",
                tabBarLabelStyle: {
                    fontFamily: "Poppins-Medium",
                    fontSize: 12,
                },
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 5,
                },
                headerShown: true,
                headerTitleStyle: {
                    fontFamily: "Poppins-Medium",
                    fontSize: 18,
                },
                headerTitleAlign: "center",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                    title: "Expenses",
                    tabBarLabel: "Expenses",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="list-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: "Add Expense",
                    tabBarLabel: "Add",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    )
}

