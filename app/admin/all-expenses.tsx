"use client"

import { useAppDispatch } from "@/hooks/reduxHook"
import { Ionicons } from "@expo/vector-icons"
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
import { fetchAllExpenses } from "../../store/slices/adminSlice"

export default function AllExpensesScreen() {
    const dispatch = useAppDispatch()
    const { allExpenses, users, loading } = useSelector((state: RootState) => state.admin)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<string | null>(null)

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

    // Filter expenses based on search query, selected category, and selected user
    const filteredExpenses = allExpenses.filter((expense) => {
        const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory ? expense.category === selectedCategory : true
        const matchesUser = selectedUser ? expense.userId === selectedUser : true
        return matchesSearch && matchesCategory && matchesUser
    })

    // Get unique categories for filter
    const categories = Array.from(new Set(allExpenses.map((expense) => expense.category)))

    const getUserName = (userId: string) => {
        const user = users.find((u) => u.id === userId)
        return user ? user.name : "Unknown User"
    }

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
        <TouchableOpacity style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
                <Ionicons name={getCategoryIcon(item.category)} size={24} color="#0066FF" />
            </View>
            <View style={styles.expenseDetails}>
                <Text style={styles.expenseDescription}>{item.description}</Text>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                <View style={styles.expenseMetaContainer}>
                    <Text style={styles.expenseUser}>{getUserName(item.userId)}</Text>
                    <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
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

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Category:</Text>
                        <TouchableOpacity
                            style={[styles.filterButton, selectedCategory === null && styles.selectedFilterButton]}
                            onPress={() => setSelectedCategory(null)}
                        >
                            <Text style={[styles.filterText, selectedCategory === null && styles.selectedFilterText]}>All</Text>
                        </TouchableOpacity>

                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[styles.filterButton, selectedCategory === category && styles.selectedFilterButton]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Ionicons
                                    name={getCategoryIcon(category)}
                                    size={16}
                                    color={selectedCategory === category ? "#FFFFFF" : "#666666"}
                                    style={styles.categoryIcon}
                                />
                                <Text style={[styles.filterText, selectedCategory === category && styles.selectedFilterText]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.filterDivider} />

                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>User:</Text>
                        <TouchableOpacity
                            style={[styles.filterButton, selectedUser === null && styles.selectedFilterButton]}
                            onPress={() => setSelectedUser(null)}
                        >
                            <Text style={[styles.filterText, selectedUser === null && styles.selectedFilterText]}>All</Text>
                        </TouchableOpacity>

                        {users.map((user) => (
                            <TouchableOpacity
                                key={user.id}
                                style={[styles.filterButton, selectedUser === user.id && styles.selectedFilterButton]}
                                onPress={() => setSelectedUser(user.id)}
                            >
                                <Text style={[styles.filterText, selectedUser === user.id && styles.selectedFilterText]}>
                                    {user.name.split(" ")[0]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
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
                            {searchQuery || selectedCategory || selectedUser
                                ? "Try changing your filters"
                                : "No expenses have been added yet"}
                        </Text>
                    </View>
                }
            />
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
    filterContainer: {
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    filterSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    filterLabel: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666666",
        marginRight: 10,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedFilterButton: {
        backgroundColor: "#0066FF",
    },
    filterText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666666",
    },
    selectedFilterText: {
        color: "#FFFFFF",
    },
    categoryIcon: {
        marginRight: 5,
    },
    filterDivider: {
        width: 1,
        height: 24,
        backgroundColor: "#E1E1E1",
        marginHorizontal: 10,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
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
    expenseMetaContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    expenseUser: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginRight: 10,
    },
    expenseDate: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#999999",
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
})

