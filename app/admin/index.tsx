"use client"

import { useAppDispatch } from "@/hooks/reduxHook"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryPie, VictoryTheme } from "victory"
import type { RootState } from "../../store"
import { fetchAllExpenses } from "../../store/slices/adminSlice"

export default function AdminDashboardScreen() {
    const dispatch = useAppDispatch()
    const { allExpenses, users, loading } = useSelector((state: RootState) => state.admin)
    const [refreshing, setRefreshing] = useState(false)
    const [timeframe, setTimeframe] = useState("week") // 'week', 'month', 'year'

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        dispatch(fetchAllExpenses())
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    // Calculate total expenses
    const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Group expenses by category for pie chart
    const expensesByCategory = allExpenses.reduce(
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

    // Group expenses by user for bar chart
    const expensesByUser = allExpenses.reduce(
        (acc, expense) => {
            if (!acc[expense.userId]) {
                acc[expense.userId] = 0
            }
            acc[expense.userId] += expense.amount
            return acc
        },
        {} as Record<string, number>,
    )

    const barChartData = Object.keys(expensesByUser).map((userId) => {
        const user = users.find((u) => u.id === userId)
        return {
            x: user ? user.name.split(" ")[0] : userId,
            y: expensesByUser[userId],
        }
    })

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
                    <Text style={styles.greeting}>Admin Dashboard</Text>
                    <Text style={styles.subGreeting}>Overview of all user expenses</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: "#E6F0FF" }]}>
                            <Ionicons name="people-outline" size={24} color="#0066FF" />
                        </View>
                        <Text style={styles.statValue}>{users.length}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: "#FFF0E6" }]}>
                            <Ionicons name="receipt-outline" size={24} color="#FF8A3D" />
                        </View>
                        <Text style={styles.statValue}>{allExpenses.length}</Text>
                        <Text style={styles.statLabel}>Expenses</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: "#E6FFF0" }]}>
                            <Ionicons name="cash-outline" size={24} color="#00CC66" />
                        </View>
                        <Text style={styles.statValue}>${totalExpenses.toFixed(0)}</Text>
                        <Text style={styles.statLabel}>Total Amount</Text>
                    </View>
                </View>

                <View style={styles.timeframeContainer}>
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

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Expenses by User</Text>
                    {barChartData.length > 0 ? (
                        <VictoryChart theme={VictoryTheme.material} domainPadding={20} height={300}>
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
                            <VictoryBar
                                data={barChartData}
                                style={{
                                    data: { fill: "#0066FF", width: 20 },
                                }}
                                animate={{
                                    duration: 500,
                                    onLoad: { duration: 500 },
                                }}
                            />
                        </VictoryChart>
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No user expense data available</Text>
                        </View>
                    )}
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Export Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
                        <Ionicons name="mail-outline" size={20} color="#0066FF" />
                        <Text style={styles.secondaryActionButtonText}>Send Summary</Text>
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
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 5,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    statValue: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        color: "#333333",
    },
    statLabel: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        textAlign: "center",
    },
    timeframeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
    },
    timeframeButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    activeTimeframe: {
        backgroundColor: "#0066FF",
    },
    timeframeText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666666",
    },
    activeTimeframeText: {
        color: "#FFFFFF",
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
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginBottom: 30,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0066FF",
        borderRadius: 10,
        paddingVertical: 12,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    secondaryActionButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#0066FF",
    },
    actionButtonText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#FFFFFF",
        marginLeft: 8,
    },
    secondaryActionButtonText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
        marginLeft: 8,
    },
})

