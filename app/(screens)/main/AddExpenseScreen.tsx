"use client"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { useState } from "react"
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import DatePicker from "react-native-date-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../hooks/hooks"
import type { MainStackParamList } from "../../navigation/MainNavigator"
import { addExpense, updateExpense } from "../../store/slices/expenseSlice"
import type { RootState } from "../../store/store"

type AddExpenseScreenNavigationProp = StackNavigationProp<MainStackParamList>

const CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Housing",
    "Healthcare",
    "Education",
    "Travel",
    "Other",
]

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"]

const AddExpenseScreen = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation<AddExpenseScreenNavigationProp>()
    const route = useRoute()
    const { loading } = useSelector((state: RootState) => state.expenses)

    // Check if we're editing an existing expense
    const expenseToEdit = route.params?.expense
    const isEditing = !!expenseToEdit

    const [amount, setAmount] = useState(isEditing ? expenseToEdit.amount.toString() : "")
    const [description, setDescription] = useState(isEditing ? expenseToEdit.description : "")
    const [category, setCategory] = useState(isEditing ? expenseToEdit.category : CATEGORIES[0])
    const [date, setDate] = useState(isEditing ? new Date(expenseToEdit.date) : new Date())
    const [currency, setCurrency] = useState(isEditing ? expenseToEdit.currency : "USD")
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showCategoryPicker, setShowCategoryPicker] = useState(false)
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)

    const handleSubmit = async () => {
        if (!amount || !description || !category) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please fill in all required fields",
            })
            return
        }

        if (isNaN(Number.parseFloat(amount))) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Amount must be a valid number",
            })
            return
        }

        const expenseData = {
            amount: Number.parseFloat(amount),
            description,
            category,
            date: date.toISOString(),
            currency,
        }

        try {
            if (isEditing) {
                await dispatch(updateExpense({ id: expenseToEdit._id, expenseData }))
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Expense updated successfully",
                })
                navigation.goBack()
            } else {
                await dispatch(addExpense(expenseData))
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Expense added successfully",
                })
                navigation.goBack()
            }
        } catch (error) {
            console.error("Error saving expense:", error)
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to save expense",
            })
        }
    }

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDate(selectedDate)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.formContainer}>
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountLabel}>Amount</Text>
                            <View style={styles.amountInputContainer}>
                                <TouchableOpacity style={styles.currencyButton} onPress={() => setShowCurrencyPicker(true)}>
                                    <Text style={styles.currencyText}>{currency}</Text>
                                    <Ionicons name="chevron-down" size={16} color="#64748B" />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.amountInput}
                                    placeholder="0.00"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Category</Text>
                            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowCategoryPicker(true)}>
                                <View style={styles.categoryIconContainer}>
                                    <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) }]}>
                                        <Ionicons name={getCategoryIcon(category)} size={16} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.pickerButtonText}>{category}</Text>
                                </View>
                                <Ionicons name="chevron-down" size={16} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="What was this expense for?"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.dateText}>
                                    {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && <DatePicker
                            date={date}
                            onDateChange={setDate}
                            mode="date"
                        />}

                        {showCategoryPicker && (
                            <View style={styles.pickerOverlay}>
                                <View style={styles.pickerContainer}>
                                    <View style={styles.pickerHeader}>
                                        <Text style={styles.pickerTitle}>Select Category</Text>
                                        <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                                            <Ionicons name="close" size={24} color="#64748B" />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView>
                                        {CATEGORIES.map((cat) => (
                                            <TouchableOpacity
                                                key={cat}
                                                style={styles.pickerItem}
                                                onPress={() => {
                                                    setCategory(cat)
                                                    setShowCategoryPicker(false)
                                                }}
                                            >
                                                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(cat) }]}>
                                                    <Ionicons name={getCategoryIcon(cat)} size={16} color="#FFFFFF" />
                                                </View>
                                                <Text style={[styles.pickerItemText, cat === category && styles.pickerItemTextSelected]}>
                                                    {cat}
                                                </Text>
                                                {cat === category && <Ionicons name="checkmark" size={20} color="#3B82F6" />}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        )}

                        {showCurrencyPicker && (
                            <View style={styles.pickerOverlay}>
                                <View style={styles.pickerContainer}>
                                    <View style={styles.pickerHeader}>
                                        <Text style={styles.pickerTitle}>Select Currency</Text>
                                        <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                                            <Ionicons name="close" size={24} color="#64748B" />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView>
                                        {CURRENCIES.map((curr) => (
                                            <TouchableOpacity
                                                key={curr}
                                                style={styles.pickerItem}
                                                onPress={() => {
                                                    setCurrency(curr)
                                                    setShowCurrencyPicker(false)
                                                }}
                                            >
                                                <Text style={[styles.pickerItemText, curr === currency && styles.pickerItemTextSelected]}>
                                                    {curr}
                                                </Text>
                                                {curr === currency && <Ionicons name="checkmark" size={20} color="#3B82F6" />}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>{isEditing ? "Update Expense" : "Add Expense"}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    formContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    amountContainer: {
        marginBottom: 24,
    },
    amountLabel: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        color: "#1E293B",
    },
    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    currencyButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 56,
        marginRight: 8,
    },
    currencyText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginRight: 4,
    },
    amountInput: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E293B",
        height: 56,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        color: "#1E293B",
    },
    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#1E293B",
        minHeight: 56,
        textAlignVertical: "top",
    },
    pickerButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 16,
        height: 56,
    },
    categoryIconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    categoryIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    pickerButtonText: {
        fontSize: 16,
        color: "#1E293B",
    },
    dateButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 16,
        height: 56,
    },
    dateText: {
        fontSize: 16,
        color: "#1E293B",
    },
    pickerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    pickerContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        width: "90%",
        maxHeight: "70%",
        padding: 20,
    },
    pickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1E293B",
    },
    pickerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    pickerItemText: {
        flex: 1,
        fontSize: 16,
        color: "#1E293B",
        marginLeft: 8,
    },
    pickerItemTextSelected: {
        color: "#3B82F6",
        fontWeight: "600",
    },
    submitButton: {
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default AddExpenseScreen

