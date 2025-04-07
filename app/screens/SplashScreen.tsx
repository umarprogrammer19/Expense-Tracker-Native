import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Ionicons name="wallet-outline" size={80} color="#3B82F6" />
                <Text style={styles.title}>ExpenseTracker</Text>
            </View>
            <ActivityIndicator size="large" color="#3B82F6" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1E293B",
        marginTop: 10,
    },
})

export default SplashScreen

