"use client"
import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import { View, Text } from "react-native"

export default function AdminLayout() {
    const { isLoggedIn, userRole } = useAuth()

    // Protect this route for admin only
    if (!isLoggedIn || userRole !== "admin") {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Unauthorized. Admin access only.</Text>
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
                    title: "Admin Dashboard",
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="users"
                options={{
                    title: "Users",
                    tabBarLabel: "Users",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="people-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="all-expenses"
                options={{
                    title: "All Expenses",
                    tabBarLabel: "Expenses",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="list-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="settings-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    )
}

