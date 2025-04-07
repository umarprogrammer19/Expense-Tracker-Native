"use client"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import Chart from "../component/Chart"
import { useAppDispatch } from "../hooks/hooks"
import { fetchExpenses } from "../redux/slices/expenseSlice"
import type { RootState } from "../redux/store"

const DashboardScreen = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation()
    const { user } = useSelector((state: RootState) => state.auth)
    const { expenses, loading } = useSelector((state: RootState) => state.expenses)
    const [refreshing, setRefreshing] = useState(false)
    const [totalExpense, setTotalExpense] = useState(0)
    const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number }>({})
    const [currency, setCurrency] = useState("USD")

    useEffect(() => {
        loadExpenses()
    }, [])

    useEffect(() => {
        if (expenses.length > 0) {
            calculateTotals()
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
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
        setTotalExpense(total)

        // Calculate category totals
        const categories: { [key: string]: number } = {}
        expenses.forEach((expense) => {
            const category = expense.category
            if (categories[category]) {
                categories[category] += expense.amount
            } else {
                categories[category] = expense.amount
            }
        })
        setCategoryTotals(categories)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount)
    }

    // Get recent expenses (last 5)
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, {user?.name}</Text>
                <Text style={styles.role}>{user?.role === "admin" ? "Admin" : "User"}</Text>
            </View>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Total Expenses</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(totalExpense)}</Text>
            </View>

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#2e7d32" style={styles.loader} />
            ) : (
                <>
                    <View style={styles.chartContainer}>
                        <Text style={styles.sectionTitle}>Expense Breakdown</Text>
                        <Chart
                            data={Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))}
                            currency={currency}
                        />
                    </View>

                    <View style={styles.recentExpensesContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Expenses</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("ExpenseList" as never)}
                                style={styles.viewAllButton}
                            >
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        {recentExpenses.length === 0 ? (
                            <Text style={styles.noExpensesText}>No expenses recorded yet</Text>
                        ) : (
                            recentExpenses.map((expense) => (
                                <View key={expense._id} style={styles.expenseItem}>
                                    <View style={styles.expenseDetails}>
                                        <Text style={styles.expenseCategory}>{expense.category}</Text>
                                        <Text style={styles.expenseDescription}>{expense.description}</Text>
                                        <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</Text>
                                    </View>
                                    <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                                </View>
                            ))
                        )}
                    </View>
                </>
            )}

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddExpense" as never)}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 20,
        backgroundColor: "#2e7d32",
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    role: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: 4,
    },
    summaryCard: {
        backgroundColor: "white",
        margin: 16,
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 16,
        color: "#666",
    },
    summaryAmount: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2e7d32",
        marginTop: 8,
    },
    chartContainer: {
        backgroundColor: "white",
        margin: 16,
        padding: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recentExpensesContainer: {
        backgroundColor: "white",
        margin: 16,
        padding: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        color: "#333",
    },
    viewAllButton: {
        padding: 4,
    },
    viewAllText: {
        color: "#2e7d32",
        fontWeight: "600",
    },
    expenseItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    expenseDetails: {
        flex: 1,
    },
    expenseCategory: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    expenseDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    expenseDate: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2e7d32",
    },
    noExpensesText: {
        textAlign: "center",
        color: "#999",
        padding: 20,
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#2e7d32",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    loader: {
        marginTop: 30,
    },
})

export default DashboardScreen

