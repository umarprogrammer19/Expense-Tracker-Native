import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import DashboardScreen from "../(screens)/main/DashboardScreen"
import ExpenseListScreen from "../(screens)/main/ExpenseListScreen"
import AddExpenseScreen from "../(screens)/main/AddExpenseScreen"
import ProfileScreen from "../(screens)/main/ProfileScreen"
import { Ionicons } from "@expo/vector-icons"
import { Platform } from "react-native"

export type MainStackParamList = {
    Tabs: undefined
    AddExpense: { expense?: any } | undefined
}

export type TabStackParamList = {
    Dashboard: undefined
    Expenses: undefined
    Profile: undefined
}

const Tab = createBottomTabNavigator<TabStackParamList>()
const Stack = createStackNavigator<MainStackParamList>()

const TabNavigator = () => {
    const { user } = useSelector((state: RootState) => state.auth)

    return (
        <Tab.Navigator
            screenOptions={({ route }: any) => ({
                tabBarIcon: ({ focused, color, size }: any) => {
                    let iconName

                    if (route.name === "Dashboard") {
                        iconName = focused ? "home" : "home-outline"
                    } else if (route.name === "Expenses") {
                        iconName = focused ? "list" : "list-outline"
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline"
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />
                },
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
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    title: "Dashboard",
                }}
            />
            <Tab.Screen
                name="Expenses"
                component={ExpenseListScreen}
                options={{
                    title: user?.role === "admin" ? "All Expenses" : "My Expenses",
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: "Profile",
                }}
            />
        </Tab.Navigator>
    )
}

const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={({ route }: any) => ({
                    title: route.params?.expense ? "Edit Expense" : "Add Expense",
                    headerStyle: {
                        backgroundColor: "#1E293B",
                    },
                    headerTintColor: "#FFFFFF",
                })}
            />
        </Stack.Navigator>
    )
}

export default MainNavigator

