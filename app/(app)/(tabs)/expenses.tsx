"use client"

import { useAppDispatch } from "@/app/hooks/hooks"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"
import { useSelector } from "react-redux"
import { deleteExpense, fetchExpenses } from "../../store/slices/expenseSlice"
import type { RootState } from "../../store/store"
import { formatCurrency } from "../../utils/formatter"

type Expense = {
    _id: string
    amount: number
    category: string
    date: string
    description: string
    currency: string
    user?: {
        _id: string
        name: string
    }
}

const ExpenseListScreen = () => {
    const dispatch = useAppDispatch()
    const router = useNavigation()
    const { expenses, loading } = useSelector((state: RootState) => state.expenses)
    const { user } = useSelector((state: RootState) => state.auth)
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false)

    useFocusEffect(
        useCallback(() => {
            loadExpenses()
        }, []),
    )

    useEffect(() => {
        filterExpenses()
    }, [expenses, searchQuery, selectedCategory])

    const loadExpenses = async () => {
        setRefreshing(true)
        try {
            await dispatch(fetchExpenses())
        } catch (error) {
            console.error("Error fetching expenses:", error)
        } finally {
            setRefreshing(false)
        }
    }

    const filterExpenses = () => {
        let filtered = [...expenses]

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (expense) =>
                    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expense.category.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter((expense) => expense.category === selectedCategory)
        }

        // Sort by date (newest first)
        filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setFilteredExpenses(filtered)
    }

    const handleDeleteExpense = (id: string) => {
        Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await dispatch(deleteExpense(id))
                        Toast.show({
                            type: "success",
                            text1: "Success",
                            text2: "Expense deleted successfully",
                        })
                    } catch (error) {
                        console.error("Error deleting expense:", error)
                        Toast.show({
                            type: "error",
                            text1: "Error",
                            text2: "Failed to delete expense",
                        })
                    }
                },
            },
        ])
    }

    // Extract unique categories for filter
    const categories = Array.from(new Set(expenses.map((expense: any) => expense.category)))

    const renderCategoryFilter = () => (
        <View style={styles.categoryFilterContainer}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={["All", ...categories]}
                keyExtractor={(item: any) => item}
                renderItem={({ item }: any) => (
                    <TouchableOpacity
                        style={[
                            styles.categoryChip,
                            (item === "All" && selectedCategory === null) || selectedCategory === item
                                ? { backgroundColor: getCategoryColor(item) }
                                : null,
                        ]}
                        onPress={() => setSelectedCategory(item === "All" ? null : item)}
                    >
                        <Text
                            style={[
                                styles.categoryChipText,
                                (item === "All" && selectedCategory === null) || selectedCategory === item
                                    ? styles.selectedCategoryChipText
                                    : null,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.categoryList}
            />
        </View>
    )

    const renderItem = ({ item }: { item: Expense }) => (
        <View style={styles.expenseItem}>
            <View style={styles.expenseLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
                    <Ionicons name={getCategoryIcon(item.category)} size={16} color="#FFFFFF" />
                </View>
            </View>

            <View style={styles.expenseDetails}>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                <Text style={styles.expenseDescription}>{item.description}</Text>
                <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
                {user?.role === "admin" && item.user && <Text style={styles.expenseUser}>Added by: {item.user.name}</Text>}
            </View>

            <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>{formatCurrency(item.amount, item.currency)}</Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            router.push({
                                pathname: "/(app)/add-expense",
                                params: { id: item._id },
                            })
                        }
                    >
                        <Ionicons name="pencil" size={16} color="#3B82F6" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteExpense(item._id)}>
                        <Ionicons name="trash" size={16} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search expenses..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94A3B8"
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={20} color="#64748B" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {renderCategoryFilter()}

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
                ) : (
                    <>
                        {filteredExpenses.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
                                <Text style={styles.emptyText}>No expenses found</Text>
                                {searchQuery || selectedCategory ? (
                                    <TouchableOpacity
                                        style={styles.clearFiltersButton}
                                        onPress={() => {
                                            setSearchQuery("")
                                            setSelectedCategory(null)
                                        }}
                                    >
                                        <Text style={styles.clearFiltersText}>Clear Filters</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.addFirstButton} onPress={() => router.push("/(app)/add-expense")}>
                                        <Text style={styles.addFirstButtonText}>Add Your First Expense</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <FlatList
                                data={filteredExpenses}
                                renderItem={renderItem}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={styles.listContent}
                                onRefresh={loadExpenses}
                                refreshing={refreshing}
                            />
                        )}
                    </>
                )}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(app)/add-expense")}>
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
        All: "apps-outline",
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
        All: "#3B82F6",
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
        paddingTop: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 20,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: "100%",
        fontSize: 16,
        color: "#1E293B",
    },
    categoryFilterContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    categoryList: {
        paddingHorizontal: 20,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#F1F5F9",
        borderRadius: 20,
        marginRight: 8,
    },
    categoryChipText: {
        color: "#64748B",
        fontWeight: "500",
    },
    selectedCategoryChipText: {
        color: "white",
        fontWeight: "600",
    },
    listContent: {
        padding: 20,
        paddingBottom: 80, // Extra space for FAB
    },
    expenseItem: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    expenseLeft: {
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
    expenseCategory: {
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
    expenseUser: {
        fontSize: 12,
        color: "#3B82F6",
        marginTop: 2,
        fontStyle: "italic",
    },
    expenseRight: {
        alignItems: "flex-end",
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1E293B",
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: "row",
    },
    actionButton: {
        padding: 6,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#94A3B8",
        marginTop: 12,
        marginBottom: 16,
    },
    clearFiltersButton: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    clearFiltersText: {
        color: "#64748B",
        fontWeight: "600",
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

export default ExpenseListScreen

