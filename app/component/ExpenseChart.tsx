"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { LineChart, PieChart } from "react-native-chart-kit"
import { Ionicons } from "@expo/vector-icons"
import { formatCurrency } from "../utils/formatter"

type ChartData = {
    name: string
    value: number
}

type ExpenseChartProps = {
    categoryData: ChartData[]
    monthlyData: ChartData[]
    currency: string
}

const ExpenseChart = ({ categoryData, monthlyData, currency }: ExpenseChartProps) => {
    const [activeChart, setActiveChart] = useState<"pie" | "line">("pie")
    const screenWidth = Dimensions.get("window").width - 40

    // Skip rendering if no data
    if ((!categoryData || categoryData.length === 0) && (!monthlyData || monthlyData.length === 0)) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="bar-chart-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>No data available</Text>
            </View>
        )
    }

    // Colors for pie chart
    const chartColors = [
        "#3B82F6",
        "#F59E0B",
        "#EC4899",
        "#8B5CF6",
        "#10B981",
        "#6366F1",
        "#EF4444",
        "#0EA5E9",
        "#F97316",
        "#64748B",
    ]

    // Prepare data for pie chart
    const pieChartData = categoryData.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: chartColors[index % chartColors.length],
        legendFontColor: "#64748B",
        legendFontSize: 12,
    }))

    // Prepare data for line chart
    const lineChartData = {
        labels: monthlyData.map((item) => item.name),
        datasets: [
            {
                data: monthlyData.map((item) => item.value),
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    }

    // Calculate total
    const total = categoryData.reduce((sum, item) => sum + item.value, 0)

    return (
        <View style={styles.container}>
            <View style={styles.chartTypeSelector}>
                <TouchableOpacity
                    style={[styles.chartTypeButton, activeChart === "pie" && styles.activeChartTypeButton]}
                    onPress={() => setActiveChart("pie")}
                >
                    <Ionicons name="pie-chart-outline" size={18} color={activeChart === "pie" ? "#3B82F6" : "#64748B"} />
                    <Text style={[styles.chartTypeText, activeChart === "pie" && styles.activeChartTypeText]}>Categories</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.chartTypeButton, activeChart === "line" && styles.activeChartTypeButton]}
                    onPress={() => setActiveChart("line")}
                >
                    <Ionicons name="trending-up-outline" size={18} color={activeChart === "line" ? "#3B82F6" : "#64748B"} />
                    <Text style={[styles.chartTypeText, activeChart === "line" && styles.activeChartTypeText]}>Trends</Text>
                </TouchableOpacity>
            </View>

            {activeChart === "pie" && categoryData.length > 0 ? (
                <View>
                    <PieChart
                        data={pieChartData}
                        width={screenWidth}
                        height={200}
                        chartConfig={{
                            backgroundColor: "#FFFFFF",
                            backgroundGradientFrom: "#FFFFFF",
                            backgroundGradientTo: "#FFFFFF",
                            color: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                        }}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />

                    <View style={styles.legendContainer}>
                        {categoryData.slice(0, 5).map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: chartColors[index % chartColors.length] }]} />
                                <Text style={styles.legendName}>{item.name}</Text>
                                <Text style={styles.legendValue}>{formatCurrency(item.value, currency)}</Text>
                                <Text style={styles.legendPercent}>{((item.value / total) * 100).toFixed(1)}%</Text>
                            </View>
                        ))}

                        {categoryData.length > 5 && (
                            <TouchableOpacity style={styles.viewMoreButton}>
                                <Text style={styles.viewMoreText}>View all categories</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : activeChart === "line" && monthlyData.length > 0 ? (
                <View>
                    <LineChart
                        data={lineChartData}
                        width={screenWidth}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#FFFFFF",
                            backgroundGradientFrom: "#FFFFFF",
                            backgroundGradientTo: "#FFFFFF",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#3B82F6",
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />

                    <View style={styles.trendSummary}>
                        <View style={styles.trendItem}>
                            <Text style={styles.trendLabel}>Average</Text>
                            <Text style={styles.trendValue}>
                                {formatCurrency(monthlyData.reduce((sum, item) => sum + item.value, 0) / monthlyData.length, currency)}
                            </Text>
                        </View>

                        <View style={styles.trendItem}>
                            <Text style={styles.trendLabel}>Highest</Text>
                            <Text style={styles.trendValue}>
                                {formatCurrency(Math.max(...monthlyData.map((item) => item.value)), currency)}
                            </Text>
                        </View>

                        <View style={styles.trendItem}>
                            <Text style={styles.trendLabel}>Lowest</Text>
                            <Text style={styles.trendValue}>
                                {formatCurrency(Math.min(...monthlyData.map((item) => item.value)), currency)}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="bar-chart-outline" size={48} color="#CBD5E1" />
                    <Text style={styles.emptyText}>No data available</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    chartTypeSelector: {
        flexDirection: "row",
        marginBottom: 16,
        backgroundColor: "#F1F5F9",
        borderRadius: 20,
        padding: 4,
    },
    chartTypeButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderRadius: 16,
    },
    activeChartTypeButton: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    chartTypeText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#64748B",
        marginLeft: 4,
    },
    activeChartTypeText: {
        color: "#3B82F6",
    },
    legendContainer: {
        marginTop: 10,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendName: {
        flex: 1,
        fontSize: 14,
        color: "#1E293B",
    },
    legendValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#3B82F6",
        marginRight: 8,
    },
    legendPercent: {
        fontSize: 14,
        color: "#64748B",
        width: 50,
        textAlign: "right",
    },
    viewMoreButton: {
        alignItems: "center",
        paddingVertical: 8,
        marginTop: 8,
    },
    viewMoreText: {
        color: "#3B82F6",
        fontWeight: "600",
        fontSize: 14,
    },
    trendSummary: {
        flexDirection: "row",
        marginTop: 16,
        justifyContent: "space-between",
    },
    trendItem: {
        flex: 1,
        alignItems: "center",
    },
    trendLabel: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 4,
    },
    trendValue: {
        fontSize: 16,
        fontWeight: "600",
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
    },
})

export default ExpenseChart

