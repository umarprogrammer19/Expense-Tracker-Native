"use client"

import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native"
import { Link, useRouter } from "expo-router"
import { useDispatch } from "react-redux"
import { login } from "../../store/slices/authSlice"

export default function LoginScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }

        try {
            setIsLoading(true)
            setError("")

            // In a real app, this would be an API call
            // For demo purposes, we'll simulate login with different roles
            let userRole: "user" | "admin" = "user"
            if (email === "admin@example.com") {
                userRole = "admin"
            }

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            dispatch(
                login({
                    user: {
                        id: "1",
                        email,
                        name: email.split("@")[0],
                        role: userRole,
                    },
                    token: "sample-token-12345",
                }),
            )

            // Router will handle redirection based on role in _layout.tsx
        } catch (err) {
            setError("Invalid credentials. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.logo} />
                    <Text style={styles.appName}>Expense Tracker</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}>Register</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    <View style={styles.demoAccountsContainer}>
                        <Text style={styles.demoAccountsTitle}>Demo Accounts:</Text>
                        <Text style={styles.demoAccount}>User: user@example.com / password</Text>
                        <Text style={styles.demoAccount}>Admin: admin@example.com / password</Text>
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
    logoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
    },
    appName: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#0066FF",
        marginTop: 10,
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
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: "#0066FF",
        fontSize: 14,
        fontFamily: "Poppins-Medium",
    },
    loginButton: {
        backgroundColor: "#0066FF",
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Poppins-Medium",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    registerText: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
    },
    registerLink: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
    },
    demoAccountsContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
    },
    demoAccountsTitle: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        marginBottom: 5,
    },
    demoAccount: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginTop: 3,
    },
})

