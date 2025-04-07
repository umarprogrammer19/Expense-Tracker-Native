"use client"

import { useAppDispatch } from "@/hooks/reduxHook"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import { fetchExpenses } from "../../store/slices/expenseSlice"

export default function ExpensesScreen() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { expenses, loading } = useSelector((state: RootState) => state.expenses)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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

    // Filter expenses based on search query and selected category
    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory ? expense.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    // Get unique categories for filter
    const categories = Array.from(new Set(expenses.map((expense) => expense.category)))

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

    const renderExpenseItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.expenseItem} onPress={() => router.push(`/expense/${item.id}`)}>
            <View style={styles.expenseIconContainer}>
                <Ionicons name={getCategoryIcon(item.category)} size={24} color="#0066FF" />
            </View>
            <View style={styles.expenseDetails}>
                <Text style={styles.expenseDescription}>{item.description}</Text>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        </TouchableOpacity>
    )

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#666666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.categoryFilterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.categoryFilterButton, selectedCategory === null && styles.selectedCategoryButton]}
                        onPress={() => setSelectedCategory(null)}
                    >
                        <Text style={[styles.categoryFilterText, selectedCategory === null && styles.selectedCategoryText]}>
                            All
                        </Text>
                    </TouchableOpacity>

                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[styles.categoryFilterButton, selectedCategory === category && styles.selectedCategoryButton]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Ionicons
                                name={getCategoryIcon(category)}
                                size={16}
                                color={selectedCategory === category ? "#FFFFFF" : "#666666"}
                                style={styles.categoryIcon}
                            />
                            <Text style={[styles.categoryFilterText, selectedCategory === category && styles.selectedCategoryText]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredExpenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={60} color="#CCCCCC" />
                        <Text style={styles.emptyText}>No expenses found</Text>
                        <Text style={styles.emptySubText}>
                            {searchQuery || selectedCategory ? "Try changing your filters" : "Add your first expense"}
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/home/add")}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        margin: 15,
        paddingHorizontal: 15,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontFamily: "Poppins-Regular",
        fontSize: 14,
    },
    categoryFilterContainer: {
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    categoryFilterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedCategoryButton: {
        backgroundColor: "#0066FF",
    },
    categoryIcon: {
        marginRight: 5,
    },
    categoryFilterText: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        color: "#666666",
    },
    selectedCategoryText: {
        color: "#FFFFFF",
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 80,
    },
    expenseItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    expenseIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    expenseDetails: {
        flex: 1,
    },
    expenseDescription: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#333333",
    },
    expenseCategory: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#0066FF",
        marginTop: 2,
    },
    expenseDate: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginTop: 2,
    },
    expenseAmount: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        color: "#333333",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 50,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        marginTop: 20,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginTop: 5,
        textAlign: "center",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#0066FF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
})

