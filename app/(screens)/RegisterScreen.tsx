"use client"

import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../redux/slices/authSlice"
import type { RootState } from "../redux/store"
import { useNavigation } from "@react-navigation/native"

const RegisterScreen = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { loading, error } = useSelector((state: RootState) => state.auth)

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match")
            return
        }

        try {
            await dispatch(register({ name, email, password, role: "user" }))
            Alert.alert("Success", "Registration successful! Please login.", [
                { text: "OK", onPress: () => navigation.navigate("Login" as never) },
            ])
        } catch (err) {
            console.error("Registration error:", err)
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to track your expenses</Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
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
        justifyContent: "center",
    },
    formContainer: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2e7d32",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
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
    },
    button: {
        backgroundColor: "#2e7d32",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "red",
        marginBottom: 16,
        textAlign: "center",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginText: {
        color: "#666",
    },
    loginLink: {
        color: "#2e7d32",
        fontWeight: "600",
    },
})

export default RegisterScreen

