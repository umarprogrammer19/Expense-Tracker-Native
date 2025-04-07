"use client"

import { useState, useEffect } from "react"
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
    Alert,
} from "react-native"
import { Link, useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { register, clearError } from "../../store/slices/authSlice"
import type { AppDispatch, RootState } from "../../store"

export default function RegisterScreen() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { loading, error } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        // Clear any previous errors when component mounts
        dispatch(clearError())
    }, [dispatch])

    useEffect(() => {
        // Show error alert if registration fails
        if (error) {
            Alert.alert("Registration Failed", error)
        }
    }, [error])

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match")
            return
        }

        dispatch(register({ name, email, password }))
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

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

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.registerButtonText}>Register</Text>}
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

