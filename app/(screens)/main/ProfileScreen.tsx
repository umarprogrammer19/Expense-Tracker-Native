import { useAppDispatch } from "@/app/hooks/hooks"
import { Ionicons } from "@expo/vector-icons"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import type { RootState } from "../../store/store"

const ProfileScreen = () => {
    const dispatch = useAppDispatch()
    const { user } = useSelector((state: RootState) => state.auth)

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => dispatch(logout()),
            },
        ])
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{user?.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.role}>{user?.role === "admin" ? "Admin Account" : "User Account"}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="person-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>Change Password</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>Notifications</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="cash-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>Currency</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="language-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>Language</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="moon-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>Dark Mode</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Other</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="help-circle-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuText}>About</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                        <View style={[styles.menuIconContainer, styles.logoutIcon]}>
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    container: {
        flex: 1,
    },
    header: {
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#3B82F6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E293B",
    },
    role: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 4,
    },
    section: {
        backgroundColor: "#FFFFFF",
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#F1F5F9",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: "#1E293B",
    },
    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    logoutIcon: {
        backgroundColor: "#FEF2F2",
    },
    logoutText: {
        flex: 1,
        fontSize: 16,
        color: "#EF4444",
        fontWeight: "500",
    },
})

export default ProfileScreen

