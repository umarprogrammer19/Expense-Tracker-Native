"use client"

import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store"
import { logout } from "../../store/slices/authSlice"

export default function ProfileScreen() {
    const dispatch = useDispatch<AppDispatch>()
    const { user, loading } = useSelector((state: RootState) => state.auth)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [darkModeEnabled, setDarkModeEnabled] = useState(false)
    const [biometricEnabled, setBiometricEnabled] = useState(false)

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: () => {
                        dispatch(logout())
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true },
        );
        localStorage.clear();
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.name}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{user?.role}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.editProfileButton}>
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Rest of the profile screen remains the same */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="person-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Personal Information</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Security</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="card-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Payment Methods</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <View style={styles.menuItemSwitch}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="notifications-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={notificationsEnabled ? "#0066FF" : "#F4F3F4"}
                    />
                </View>

                <View style={styles.menuItemSwitch}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="moon-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Dark Mode</Text>
                    <Switch
                        value={darkModeEnabled}
                        onValueChange={setDarkModeEnabled}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={darkModeEnabled ? "#0066FF" : "#F4F3F4"}
                    />
                </View>

                <View style={styles.menuItemSwitch}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="finger-print-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Biometric Authentication</Text>
                    <Switch
                        value={biometricEnabled}
                        onValueChange={setBiometricEnabled}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={biometricEnabled ? "#0066FF" : "#F4F3F4"}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="help-circle-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Help Center</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="chatbubble-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Contact Us</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="document-text-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.menuItemText}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FF3B30" size="small" />
                ) : (
                    <>
                        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    // Styles remain the same
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    header: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        marginBottom: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        color: "#333333",
    },
    profileEmail: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginTop: 2,
    },
    roleBadge: {
        backgroundColor: "#E6F0FF",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
        alignSelf: "flex-start",
        marginTop: 5,
    },
    roleText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
        textTransform: "capitalize",
    },
    editProfileButton: {
        backgroundColor: "#F0F7FF",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 15,
    },
    editProfileText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
    },
    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        color: "#333333",
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    menuItemSwitch: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    menuItemText: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#333333",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#FF3B30",
        marginLeft: 10,
    },
    versionContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    versionText: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#999999",
    },
})

