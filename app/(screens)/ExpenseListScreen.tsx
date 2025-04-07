"use client"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { useSelector } from "react-redux"
import { useAppDispatch } from "../hooks/hooks"
import { deleteExpense, fetchExpenses } from "../redux/slices/expenseSlice"
import type { RootState } from "../redux/store"

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
    const navigation = useNavigation()
    const { expenses, loading } = useSelector((state: RootState) => state.expenses)
    const { user } = useSelector((state: RootState) => state.auth)
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        loadExpenses()
    }, [])

    useEffect(() => {
        filterExpenses()
    }, [expenses, searchQuery, selectedCategory])

    const loadExpenses = async () => {
        try {
            await dispatch(fetchExpenses())
        } catch (error) {
            console.error("Error fetching expenses:", error)
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
        Alert.alert("Confirm Delete", "Are you sure you want to delete this expense?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await dispatch(deleteExpense(id))
                        Alert.alert("Success", "Expense deleted successfully")
                    } catch (error) {
                        console.error("Error deleting expense:", error)
                        Alert.alert("Error", "Failed to delete expense")
                    }
                },
            },
        ])
    }

    const handleEditExpense = (expense: Expense) => {
        navigation.navigate("AddExpense" as never, { expense } as never)
    }

    const formatCurrency = (amount: number, currency = "USD") => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount)
    }

    // Extract unique categories for filter
    const categories = Array.from(new Set(expenses.map((expense) => expense.category)))

    const renderCategoryFilter = () => (
        <View style={styles.categoryFilterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                    style={[styles.categoryChip, selectedCategory === null && styles.selectedCategoryChip]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text style={[styles.categoryChipText, selectedCategory === null && styles.selectedCategoryChipText]}>
                        All
                    </Text>
                </TouchableOpacity>

                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[styles.categoryChip, selectedCategory === category && styles.selectedCategoryChip]}
                        onPress={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    >
                        <Text style={[styles.categoryChipText, selectedCategory === category && styles.selectedCategoryChipText]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )

    const renderItem = ({ item }: { item: Expense }) => (
        <View style={styles.expenseItem}>
            <View style={styles.expenseDetails}>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                <Text style={styles.expenseDescription}>{item.description}</Text>
                <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
                {user?.role === "admin" && item.user && <Text style={styles.expenseUser}>Added by: {item.user.name}</Text>}
            </View>

            <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>{formatCurrency(item.amount, item.currency)}</Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditExpense(item)}>
                        <Ionicons name="pencil" size={16} color="#2e7d32" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteExpense(item._id)}>
                        <Ionicons name="trash" size={16} color="#d32f2f" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {renderCategoryFilter()}

            {loading ? (
                <ActivityIndicator size="large" color="#2e7d32" style={styles.loader} />
            ) : (
                <>
                    {filteredExpenses.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>No expenses found</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredExpenses}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.listContent}
                        />
                    )}
                </>
            )}

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddExpense" as never)}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        margin: 16,
        marginBottom: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
    },
    categoryFilterContainer: {
        marginHorizontal: 16,
        marginBottom: 8,
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#f0f0f0",
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    selectedCategoryChip: {
        backgroundColor: "#2e7d32",
        borderColor: "#2e7d32",
    },
    categoryChipText: {
        color: "#666",
    },
    selectedCategoryChipText: {
        color: "white",
    },
    listContent: {
        padding: 16,
        paddingBottom: 80, // Extra space for FAB
    },
    expenseItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
    expenseUser: {
        fontSize: 12,
        color: "#2e7d32",
        marginTop: 2,
        fontStyle: "italic",
    },
    expenseRight: {
        alignItems: "flex-end",
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2e7d32",
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: "row",
    },
    editButton: {
        padding: 4,
        marginRight: 8,
    },
    deleteButton: {
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        marginTop: 12,
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

export default ExpenseListScreen

