"use client"

import { useAppDispatch } from "@/hooks/reduxHook"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"
import { VictoryAxis, VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from "victory"
import type { RootState } from "../../store"
import { fetchExpenses } from "../../store/slices/expenseSlice"

export default function DashboardScreen() {
    const dispatch = useAppDispatch()
    const { expenses, loading } = useSelector((state: RootState) => state.expenses)
    const { user } = useSelector((state: RootState) => state.auth)
    const [refreshing, setRefreshing] = useState(false)
    const [timeframe, setTimeframe] = useState("week") // 'week', 'month', 'year'

    useEffect(() => {
        loadExpenses()
    }, [])

    const loadExpenses = async () => {
        dispatch(fetchExpenses())
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadExpenses()
        setRefreshing(false)
    }

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Group expenses by category for pie chart
    const expensesByCategory = expenses.reduce(
        (acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0
            }
            acc[expense.category] += expense.amount
            return acc
        },
        {} as Record<string, number>,
    )

    const pieChartData = Object.keys(expensesByCategory).map((category) => ({
        x: category,
        y: expensesByCategory[category],
    }))

    // Group expenses by date for line chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
    }).reverse()

    const expensesByDate = last7Days.map((date) => {
        const dailyTotal = expenses
            .filter((expense) => expense.date.split("T")[0] === date)
            .reduce((sum, expense) => sum + expense.amount, 0)

        return {
            x: new Date(date).getDate(), // Just show the day number
            y: dailyTotal,
        }
    })

    // Get recent expenses
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case "food":
                return "fast-food-outline"
            case "transport":
                return "car-outline"
            case "entertainment":
                return "film-outline"
            case "shopping":
                return "cart-outline"
            case "utilities":
                return "flash-outline"
            default:
                return "cash-outline"
        }
    }

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={["right", "left"]}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {user?.name}</Text>
                    <Text style={styles.subGreeting}>Here's your expense summary</Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Total Expenses</Text>
                    <Text style={styles.summaryAmount}>${totalExpenses.toFixed(2)}</Text>

                    <View style={styles.timeframeSelector}>
                        <TouchableOpacity
                            style={[styles.timeframeButton, timeframe === "week" && styles.activeTimeframe]}
                            onPress={() => setTimeframe("week")}
                        >
                            <Text style={[styles.timeframeText, timeframe === "week" && styles.activeTimeframeText]}>Week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.timeframeButton, timeframe === "month" && styles.activeTimeframe]}
                            onPress={() => setTimeframe("month")}
                        >
                            <Text style={[styles.timeframeText, timeframe === "month" && styles.activeTimeframeText]}>Month</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.timeframeButton, timeframe === "year" && styles.activeTimeframe]}
                            onPress={() => setTimeframe("year")}
                        >
                            <Text style={[styles.timeframeText, timeframe === "year" && styles.activeTimeframeText]}>Year</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Spending Trend</Text>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        height={200}
                        padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
                    >
                        <VictoryAxis
                            tickFormat={(t: string) => `${t}`}
                            style={{
                                axis: { stroke: "#E1E1E1" },
                                tickLabels: { fontSize: 10, padding: 5 },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickFormat={(t: string) => `$${t}`}
                            style={{
                                axis: { stroke: "#E1E1E1" },
                                tickLabels: { fontSize: 10, padding: 5 },
                            }}
                        />
                        <VictoryLine
                            data={expensesByDate}
                            style={{
                                data: { stroke: "#0066FF", strokeWidth: 2 },
                            }}
                            animate={{
                                duration: 500,
                                onLoad: { duration: 500 },
                            }}
                        />
                    </VictoryChart>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Expenses by Category</Text>
                    {pieChartData.length > 0 ? (
                        <VictoryPie
                            data={pieChartData}
                            colorScale={["#0066FF", "#5EDFFF", "#B2FCFF", "#ECFCFF", "#FFC2E2"]}
                            width={300}
                            height={300}
                            innerRadius={70}
                            labelRadius={({ innerRadius }: any) => (innerRadius || 0) + 30}
                            style={{
                                labels: { fontSize: 12, fill: "#333333" },
                            }}
                            animate={{
                                duration: 500,
                                onLoad: { duration: 500 },
                            }}
                        />
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No expense data available</Text>
                        </View>
                    )}
                </View>

                <View style={styles.recentExpensesContainer}>
                    <Text style={styles.recentExpensesTitle}>Recent Expenses</Text>

                    {recentExpenses.length > 0 ? (
                        recentExpenses.map((expense) => (
                            <View key={expense.id} style={styles.expenseItem}>
                                <View style={styles.expenseIconContainer}>
                                    <Ionicons name={getCategoryIcon(expense.category)} size={24} color="#0066FF" />
                                </View>
                                <View style={styles.expenseDetails}>
                                    <Text style={styles.expenseCategory}>{expense.category}</Text>
                                    <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No recent expenses</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.viewAllButton}>
                        <Text style={styles.viewAllButtonText}>View All Expenses</Text>
                        <Ionicons name="arrow-forward" size={16} color="#0066FF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#333333",
    },
    subGreeting: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginTop: 5,
    },
    summaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        margin: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    summaryTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#666666",
    },
    summaryAmount: {
        fontSize: 32,
        fontFamily: "Poppins-Bold",
        color: "#0066FF",
        marginTop: 5,
        marginBottom: 15,
    },
    timeframeSelector: {
        flexDirection: "row",
        borderRadius: 10,
        backgroundColor: "#F5F7FA",
        padding: 4,
    },
    timeframeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 8,
    },
    activeTimeframe: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    timeframeText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666666",
    },
    activeTimeframeText: {
        color: "#0066FF",
    },
    chartContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        margin: 15,
        marginTop: 0,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    recentExpensesContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        margin: 15,
        marginTop: 0,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 30,
    },
    recentExpensesTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        marginBottom: 15,
    },
    expenseItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    expenseIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    expenseDetails: {
        flex: 1,
    },
    expenseCategory: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#333333",
    },
    expenseDate: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666666",
    },
    expenseAmount: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#333333",
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        paddingVertical: 10,
    },
    viewAllButtonText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
        marginRight: 5,
    },
    noDataContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    noDataText: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
    },
})

