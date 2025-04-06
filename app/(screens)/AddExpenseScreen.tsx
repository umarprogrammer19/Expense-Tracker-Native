"use client"

import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { addExpense, updateExpense } from "../redux/slices/expenseSlice"
import type { RootState } from "../redux/store"
import { useNavigation, useRoute } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"

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
    const dispatch = useDispatch()
    const navigation = useNavigation()
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

    const handleSubmit = async () => {
        if (!amount || !description || !category) {
            Alert.alert("Error", "Please fill in all required fields")
            return
        }

        if (isNaN(Number.parseFloat(amount))) {
            Alert.alert("Error", "Amount must be a valid number")
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
                Alert.alert("Success", "Expense updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
            } else {
                await dispatch(addExpense(expenseData))
                Alert.alert("Success", "Expense added successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
            }
        } catch (error) {
            console.error("Error saving expense:", error)
            Alert.alert("Error", "Failed to save expense")
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
                <View style={styles.formContainer}>
                    <Text style={styles.title}>{isEditing ? "Edit Expense" : "Add New Expense"}</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Amount*</Text>
                        <View style={styles.amountContainer}>
                            <View style={styles.currencyContainer}>
                                <Picker
                                    selectedValue={currency}
                                    onValueChange={(itemValue) => setCurrency(itemValue)}
                                    style={styles.currencyPicker}
                                >
                                    {CURRENCIES.map((curr) => (
                                        <Picker.Item key={curr} label={curr} value={curr} />
                                    ))}
                                </Picker>
                            </View>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0.00"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Category*</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={category}
                                onValueChange={(itemValue) => setCategory(itemValue)}
                                style={styles.picker}
                            >
                                {CATEGORIES.map((cat) => (
                                    <Picker.Item key={cat} label={cat} value={cat} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="What was this expense for?"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                            <Ionicons name="calendar" size={20} color="#666" />
                        </TouchableOpacity>

                        {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>{isEditing ? "Update Expense" : "Add Expense"}</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContainer: {
        flexGrow: 1,
    },
    formContainer: {
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 6,
        color: "#333",
    },
    input: {
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 48,
    },
    amountContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    currencyContainer: {
        width: 100,
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginRight: 8,
        height: 48,
        overflow: "hidden",
    },
    currencyPicker: {
        height: 48,
        width: "100%",
    },
    amountInput: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        height: 48,
    },
    pickerContainer: {
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        height: 48,
        overflow: "hidden",
    },
    picker: {
        height: 48,
        width: "100%",
    },
    dateButton: {
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        height: 48,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
    submitButton: {
        backgroundColor: "#2e7d32",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButton: {
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    cancelButtonText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default AddExpenseScreen

