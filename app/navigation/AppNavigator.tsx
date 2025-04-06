import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Ionicons } from "@expo/vector-icons"

// Screens
import LoginScreen from "../(screens)/LoginScreen"
import RegisterScreen from "../(screens)/RegisterScreen"
import DashboardScreen from "../(screens)/DashboardScreen"
import ExpenseListScreen from "../(screens)/ExpenseListScreen"
import AddExpenseScreen from "../(screens)/AddExpenseScreen"

// Stack navigators
const AuthStack = createStackNavigator()
const MainStack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Auth navigator
const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
)

// Tab navigator for main app
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
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />
                },
                tabBarActiveTintColor: "#2e7d32",
                tabBarInactiveTintColor: "gray",
                headerStyle: {
                    backgroundColor: "#2e7d32",
                },
                headerTintColor: "#fff",
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
                    headerRight: () => (
                        <Ionicons name="person-circle-outline" size={24} color="#fff" style={{ marginRight: 16 }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Expenses"
                component={ExpenseListScreen}
                options={{
                    title: user?.role === "admin" ? "All Expenses" : "My Expenses",
                }}
            />
        </Tab.Navigator>
    )
}

// Main navigator
const MainNavigator = () => (
    <MainStack.Navigator>
        <MainStack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <MainStack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={({ route }: any) => ({
                title: route.params?.expense ? "Edit Expense" : "Add Expense",
                headerStyle: {
                    backgroundColor: "#2e7d32",
                },
                headerTintColor: "#fff",
            })}
        />
    </MainStack.Navigator>
)

// Root navigator
const AppNavigator = () => {
    const { token }: any = useSelector((state: RootState) => state.auth)

    return <NavigationContainer>{token ? <MainNavigator /> : <AuthNavigator />}</NavigationContainer>
}

export default AppNavigator

