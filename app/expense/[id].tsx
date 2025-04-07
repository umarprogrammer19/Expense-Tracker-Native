"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { Ionicons } from "@expo/vector-icons"
import { deleteExpense } from "../../store/slices/expenseSlice"
import type { RootState } from "../../store"

export default function ExpenseDetailScreen() {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const { expenses } = useSelector((state: RootState) => state.expenses)
    const { user } = useSelector((state: RootState) => state.auth)
    const [isDeleting, setIsDeleting] = useState(false)

    // Find the expense with the matching ID
    const expense = expenses.find((exp) => exp.id === id)

    if (!expense) {
        return (
            <View style={styles.container}>
                <View style={styles.notFoundContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color="#CCCCCC" />
                    <Text style={styles.notFoundText}>Expense not found</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const handleDelete = () => {
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            setIsDeleting(true)
                            // In a real app, this would be an API call
                            await new Promise((resolve) => setTimeout(resolve, 1000))
                            dispatch(deleteExpense(expense.id))
                            router.back()
                        } catch (error) {
                            console.error("Error deleting expense:", error)
                            Alert.alert("Error", "Failed to delete expense. Please try again.")
                        } finally {
                            setIsDeleting(false)
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true },
        )
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
            case "health":
                return "medical-outline"
            case "education":
                return "book-outline"
            default:
                return "cash-outline"
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Expense Details</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.expenseCard}>
                    <View style={styles.expenseIconContainer}>
                        <Ionicons name={getCategoryIcon(expense.category)} size={30} color="#0066FF" />
                    </View>
                    <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseCategory}>{expense.category}</Text>
                    <Text style={styles.expenseDate}>
                        {new Date(expense.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </View>

                {expense.notes && (
                    <View style={styles.detailCard}>
                        <Text style={styles.detailTitle}>Notes</Text>
                        <Text style={styles.detailText}>{expense.notes}</Text>
                    </View>
                )}

                <View style={styles.detailCard}>
                    <Text style={styles.detailTitle}>Payment Method</Text>
                    <Text style={styles.detailText}>Credit Card</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailTitle}>Created By</Text>
                    <Text style={styles.detailText}>{user?.name}</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/expense/edit/${expense.id}`)}>
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.editButtonText}>Edit Expense</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isDeleting}>
                        {isDeleting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    backIconButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: "#333333",
    },
    expenseCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    expenseIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    expenseAmount: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        color: "#333333",
        marginBottom: 10,
    },
    expenseDescription: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        marginBottom: 5,
    },
    expenseCategory: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
        marginBottom: 5,
    },
    expenseDate: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
    },
    detailCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    detailTitle: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666666",
        marginBottom: 5,
    },
    detailText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#333333",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 30,
    },
    editButton: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0066FF",
        borderRadius: 10,
        paddingVertical: 12,
        marginRight: 10,
    },
    editButtonText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#FFFFFF",
        marginLeft: 8,
    },
    deleteButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF3B30",
        borderRadius: 10,
        paddingVertical: 12,
    },
    deleteButtonText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#FFFFFF",
        marginLeft: 8,
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    notFoundText: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        marginTop: 20,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: "#0066FF",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    backButtonText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#FFFFFF",
    },
})

