"use client"

import { useState, useEffect } from "react"
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
    Alert,
} from "react-native"
import { Link, useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { login, clearError } from "../../store/slices/authSlice"
import type { AppDispatch, RootState } from "../../store"

export default function LoginScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { loading, error } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        // Clear any previous errors when component mounts
        dispatch(clearError())
    }, [dispatch])

    useEffect(() => {
        // Show error alert if login fails
        if (error) {
            Alert.alert("Login Failed", error)
        }
    }, [error])

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields")
            return
        }

        dispatch(login({ email, password }))
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

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
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
    // Styles remain the same
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

