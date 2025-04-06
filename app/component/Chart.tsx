import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native"
import { BarChart, PieChart } from "react-native-chart-kit"
import { Ionicons } from "@expo/vector-icons"

type ChartData = {
    name: string
    value: number
}

type ChartProps = {
    data: ChartData[]
    currency?: string
}

const Chart = ({ data, currency = "USD" }: ChartProps) => {
    const screenWidth = Dimensions.get("window").width - 40

    // Skip rendering if no data
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No data available</Text>
            </View>
        )
    }

    // Colors for pie chart
    const chartColors = [
        "#2e7d32",
        "#388e3c",
        "#43a047",
        "#4caf50",
        "#66bb6a",
        "#81c784",
        "#a5d6a7",
        "#c8e6c9",
        "#e8f5e9",
        "#f1f8e9",
    ]

    // Prepare data for pie chart
    const pieChartData = data.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: chartColors[index % chartColors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
    }))

    // Prepare data for bar chart
    const barChartData = {
        labels: data.map((item) => item.name.substring(0, 3)),
        datasets: [
            {
                data: data.map((item) => item.value),
            },
        ],
    }

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Expense by Category</Text>
                    <PieChart
                        data={pieChartData}
                        width={screenWidth}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                </View>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Expense Comparison</Text>
                    <BarChart
                        data={barChartData}
                        width={Math.max(screenWidth, data.length * 60)}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#2e7d32",
                            },
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </View>
            </ScrollView>

            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: chartColors[index % chartColors.length] }]} />
                        <Text style={styles.legendName}>{item.name}</Text>
                        <Text style={styles.legendValue}>{formatCurrency(item.value)}</Text>
                        <Text style={styles.legendPercent}>{((item.value / total) * 100).toFixed(1)}%</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    chartContainer: {
        marginVertical: 10,
        alignItems: "center",
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
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
        color: "#333",
    },
    legendValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2e7d32",
        marginRight: 8,
    },
    legendPercent: {
        fontSize: 14,
        color: "#666",
        width: 50,
        textAlign: "right",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
    },
    emptyText: {
        marginTop: 10,
        color: "#999",
        fontSize: 14,
    },
})

export default Chart

