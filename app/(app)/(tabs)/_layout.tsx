import { Tabs } from "expo-router"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"
import { Ionicons } from "@expo/vector-icons"
import { Platform } from "react-native"

export default function TabsLayout() {
    const { user } = useSelector((state: RootState) => state.auth)

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#3B82F6",
                tabBarInactiveTintColor: "#64748B",
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    height: Platform.OS === "ios" ? 90 : 70,
                    paddingBottom: Platform.OS === "ios" ? 25 : 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
                headerStyle: {
                    backgroundColor: "#1E293B",
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                    title: user?.role === "admin" ? "All Expenses" : "My Expenses",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="list-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    )
}

