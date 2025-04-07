"use client"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { useEffect, useState } from "react"
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"
import ExpenseChart from "../../component/ExpenseChart"
import { useAppDispatch } from "../../hooks/hooks"
import type { MainStackParamList } from "../../navigation/MainNavigator"
import { fetchExpenses } from "../../store/slices/expenseSlice"
import type { RootState } from "../../store/store"
import { formatCurrency } from "../../utils/formatter"

type DashboardScreenNavigationProp = StackNavigationProp<MainStackParamList>

const DashboardScreen = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation<DashboardScreenNavigationProp>()
    const { user } = useSelector((state: RootState) => state.auth)
    const { expenses, loading } = useSelector((state: RootState) => state.expenses)
    const [refreshing, setRefreshing] = useState(false)
    const [totalExpense, setTotalExpense] = useState(0)
    const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number }>({})
    const [currency, setCurrency] = useState("USD")
    const [monthlyExpenses, setMonthlyExpenses] = useState<{ [key: string]: number }>({})

    useEffect(() => {
        loadExpenses()
    }, [])

    useEffect(() => {
        if (expenses.length > 0) {
            calculateTotals()
            calculateMonthlyExpenses()
            // Set currency based on the first expense's currency (assuming consistent currency)
            if (expenses[0].currency) {
                setCurrency(expenses[0].currency)
            }
        }
    }, [expenses])

    const loadExpenses = async () => {
        try {
            await dispatch(fetchExpenses())
        } catch (error) {
            console.error("Error fetching expenses:", error)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadExpenses()
        setRefreshing(false)
    }

    const calculateTotals = () => {
        const total = expenses.reduce((sum: number, expense: { amount: number }) => sum + expense.amount, 0)
        setTotalExpense(total)

        // Calculate category totals
        const categories: { [key: string]: number } = {}
        expenses.forEach((expense: { category: string; amount: number }) => {
            const category = expense.category
            if (categories[category]) {
                categories[category] += expense.amount
            } else {
                categories[category] = expense.amount
            }
        })
        setCategoryTotals(categories)
    }

    const calculateMonthlyExpenses = () => {
        const months: { [key: string]: number } = {}

        expenses.forEach((expense: any) => {
            const date = new Date(expense.date)
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

            if (months[monthYear]) {
                months[monthYear] += expense.amount
            } else {
                months[monthYear] = expense.amount
            }
        })

        setMonthlyExpenses(months)
    }

    // Get recent expenses (last 5)
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <ScrollView
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name}</Text>
                        <Text style={styles.role}>{user?.role === "admin" ? "Admin Account" : "User Account"}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>
                            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryCards}>
                    <View style={[styles.summaryCard, styles.totalCard]}>
                        <View style={styles.summaryIconContainer}>
                            <Ionicons name="wallet-outline" size={24} color="#3B82F6" />
                        </View>
                        <Text style={styles.summaryLabel}>Total Expenses</Text>
                        <Text style={styles.summaryAmount}>{formatCurrency(totalExpense, currency)}</Text>
                    </View>

                    <View style={[styles.summaryCard, styles.categoryCard]}>
                        <View style={styles.summaryIconContainer}>
                            <Ionicons name="pie-chart-outline" size={24} color="#8B5CF6" />
                        </View>
                        <Text style={styles.summaryLabel}>Categories</Text>
                        <Text style={styles.summaryAmount}>{Object.keys(categoryTotals).length}</Text>
                    </View>
                </View>

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
                ) : (
                    <>
                        <View style={styles.chartContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Expense Breakdown</Text>
                                <TouchableOpacity>
                                    <Text style={styles.seeAllText}>See Details</Text>
                                </TouchableOpacity>
                            </View>
                            <ExpenseChart
                                categoryData={Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))}
                                monthlyData={Object.entries(monthlyExpenses).map(([name, value]) => ({ name, value }))}
                                currency={currency}
                            />
                        </View>

                        <View style={styles.recentExpensesContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Expenses</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("Tabs", { screen: "Expenses" })}>
                                    <Text style={styles.seeAllText}>See All</Text>
                                </TouchableOpacity>
                            </View>

                            {recentExpenses.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
                                    <Text style={styles.emptyText}>No expenses recorded yet</Text>
                                    <TouchableOpacity style={styles.addFirstButton} onPress={() => navigation.navigate("AddExpense")}>
                                        <Text style={styles.addFirstButtonText}>Add Your First Expense</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                recentExpenses.map((expense) => (
                                    <TouchableOpacity
                                        key={expense._id}
                                        style={styles.expenseItem}
                                        onPress={() => navigation.navigate("AddExpense", { expense })}
                                    >
                                        <View style={styles.expenseCategory}>
                                            <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(expense.category) }]}>
                                                <Ionicons name={getCategoryIcon(expense.category)} size={16} color="#FFFFFF" />
                                            </View>
                                        </View>
                                        <View style={styles.expenseDetails}>
                                            <Text style={styles.expenseCategoryText}>{expense.category}</Text>
                                            <Text style={styles.expenseDescription}>{expense.description}</Text>
                                            <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</Text>
                                        </View>
                                        <Text style={styles.expenseAmount}>{formatCurrency(expense.amount, expense.currency)}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddExpense")}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

// Helper functions for category icons and colors
const getCategoryIcon = (category: string): any => {
    const icons: { [key: string]: any } = {
        Food: "restaurant-outline",
        Transport: "car-outline",
        Entertainment: "film-outline",
        Shopping: "cart-outline",
        Utilities: "flash-outline",
        Housing: "home-outline",
        Healthcare: "medical-outline",
        Education: "school-outline",
        Travel: "airplane-outline",
        Other: "ellipsis-horizontal-outline",
    }

    return icons[category] || "ellipsis-horizontal-outline"
}

const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
        Food: "#F59E0B",
        Transport: "#3B82F6",
        Entertainment: "#EC4899",
        Shopping: "#8B5CF6",
        Utilities: "#10B981",
        Housing: "#6366F1",
        Healthcare: "#EF4444",
        Education: "#0EA5E9",
        Travel: "#F97316",
        Other: "#64748B",
    }

    return colors[category] || "#64748B"
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    greeting: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E293B",
    },
    role: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 4,
    },
    dateContainer: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    date: {
        fontSize: 12,
        color: "#64748B",
        fontWeight: "500",
    },
    summaryCards: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    totalCard: {
        marginRight: 10,
    },
    categoryCard: {
        marginLeft: 10,
    },
    summaryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E293B",
    },
    chartContainer: {
        backgroundColor: "#FFFFFF",
        margin: 20,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    recentExpensesContainer: {
        backgroundColor: "#FFFFFF",
        margin: 20,
        marginTop: 0,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 80, // Extra space for FAB
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1E293B",
    },
    seeAllText: {
        color: "#3B82F6",
        fontWeight: "600",
        fontSize: 14,
    },
    expenseItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    expenseCategory: {
        marginRight: 12,
    },
    categoryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    expenseDetails: {
        flex: 1,
    },
    expenseCategoryText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
    },
    expenseDescription: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 2,
    },
    expenseDate: {
        fontSize: 12,
        color: "#94A3B8",
        marginTop: 2,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1E293B",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
    },
    emptyText: {
        marginTop: 10,
        color: "#94A3B8",
        fontSize: 14,
        marginBottom: 16,
    },
    addFirstButton: {
        backgroundColor: "#EFF6FF",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addFirstButtonText: {
        color: "#3B82F6",
        fontWeight: "600",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#3B82F6",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    loader: {
        marginTop: 30,
    },
})

export default DashboardScreen

