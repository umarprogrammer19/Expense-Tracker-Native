"use client"

import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native"
import { Link, useRouter } from "expo-router"
import { useDispatch } from "react-redux"
import { register } from "../../store/slices/authSlice"

export default function RegisterScreen() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const dispatch = useDispatch()
    const router = useRouter()

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            setIsLoading(true)
            setError("")

            // In a real app, this would be an API call
            // For demo purposes, we'll simulate registration
            await new Promise((resolve) => setTimeout(resolve, 1000))

            dispatch(
                register({
                    user: {
                        id: Math.random().toString(36).substr(2, 9),
                        email,
                        name,
                        role: "user",
                    },
                    token: "sample-token-" + Math.random().toString(36).substr(2, 9),
                }),
            )

            // Router will handle redirection in _layout.tsx
        } catch (err) {
            setError("Registration failed. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput style={styles.input} placeholder="Enter your full name" value={name} onChangeText={setName} />
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

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    formContainer: {
        width: "100%",
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        color: "#333333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginBottom: 30,
    },
    errorText: {
        color: "#FF3B30",
        marginBottom: 15,
        fontFamily: "Poppins-Regular",
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
    registerButton: {
        backgroundColor: "#0066FF",
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Poppins-Medium",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    loginText: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
    },
    loginLink: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
    },
})

