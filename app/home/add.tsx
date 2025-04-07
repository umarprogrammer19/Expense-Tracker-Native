"use client"

import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import DatePicker from "react-native-date-picker"
import { addExpenseAsync } from "../../store/slices/expenseSlice"
import type { AppDispatch, RootState } from "../../store"

const categories = [
    { id: "food", name: "Food", icon: "fast-food-outline" },
    { id: "transport", name: "Transport", icon: "car-outline" },
    { id: "entertainment", name: "Entertainment", icon: "film-outline" },
    { id: "shopping", name: "Shopping", icon: "cart-outline" },
    { id: "utilities", name: "Utilities", icon: "flash-outline" },
    { id: "health", name: "Health", icon: "medical-outline" },
    { id: "education", name: "Education", icon: "book-outline" },
    { id: "other", name: "Other", icon: "cash-outline" },
]

export default function AddExpenseScreen() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { loading, error } = useSelector((state: RootState) => state.expenses)

    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState(new Date())
    const [notes, setNotes] = useState("")
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!description.trim()) {
            newErrors.description = "Description is required"
        }

        if (!amount.trim()) {
            newErrors.amount = "Amount is required"
        } else if (isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
            newErrors.amount = "Amount must be a positive number"
        }

        if (!category) {
            newErrors.category = "Category is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            const expenseData = {
                description,
                amount: Number.parseFloat(amount),
                category,
                date: date.toISOString(),
                notes,
            }

            await dispatch(addExpenseAsync(expenseData)).unwrap()
            router.back()
        } catch (error: any) {
            console.error("Error adding expense:", error)
            Alert.alert("Error", error || "Failed to add expense. Please try again.")
        }
    }

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDate(selectedDate)
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Add New Expense</Text>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, errors.description && styles.inputError]}
                            placeholder="What did you spend on?"
                            value={description}
                            onChangeText={setDescription}
                        />
                        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Amount ($)</Text>
                        <TextInput
                            style={[styles.input, errors.amount && styles.inputError]}
                            placeholder="0.00"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Category</Text>
                        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                        <View style={styles.categoriesContainer}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.categoryButton, category === cat.id && styles.selectedCategoryButton]}
                                    onPress={() => setCategory(cat.id)}
                                >
                                    <Ionicons name={cat.icon as any} size={20} color={category === cat.id ? "#FFFFFF" : "#666666"} />
                                    <Text style={[styles.categoryText, category === cat.id && styles.selectedCategoryText]}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                            <Ionicons name="calendar-outline" size={20} color="#666666" />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DatePicker
                                date={date}
                                onDateChange={setDate}
                                mode="date"
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Notes (Optional)</Text>
                        <TextInput
                            style={[styles.input, styles.notesInput]}
                            placeholder="Add any additional details..."
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Add Expense</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    // Styles remain the same
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#333333",
    },
    errorContainer: {
        backgroundColor: "#FFEBEE",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    formContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        backgroundColor: "#F9F9F9",
    },
    inputError: {
        borderColor: "#FF3B30",
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        marginTop: 5,
    },
    notesInput: {
        height: 100,
        textAlignVertical: "top",
        paddingTop: 15,
    },
    categoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
    },
    categoryButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F7FA",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    selectedCategoryButton: {
        backgroundColor: "#0066FF",
    },
    categoryText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666666",
        marginLeft: 5,
    },
    selectedCategoryText: {
        color: "#FFFFFF",
    },
    datePickerButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: "#F9F9F9",
    },
    dateText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#333333",
    },
    submitButton: {
        backgroundColor: "#0066FF",
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Poppins-Medium",
    },
})

