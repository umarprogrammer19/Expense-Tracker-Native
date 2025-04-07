"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import { useRouter } from "expo-router"

export default function AdminSettingsScreen() {
    const dispatch = useDispatch()
    const router = useRouter()

    const [emailNotifications, setEmailNotifications] = useState(true)
    const [dataBackup, setDataBackup] = useState(true)
    const [userRegistration, setUserRegistration] = useState(true)
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [debugMode, setDebugMode] = useState(false)

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
                        router.replace("/login")
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true },
        )
    }

    const handleResetDatabase = () => {
        Alert.alert(
            "Reset Database",
            "Are you sure you want to reset the database? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Reset",
                    onPress: () => {
                        // In a real app, this would call an API to reset the database
                        Alert.alert("Success", "Database has been reset successfully.")
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true },
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General Settings</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Ionicons name="mail-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.settingText}>Email Notifications</Text>
                    <Switch
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={emailNotifications ? "#0066FF" : "#F4F3F4"}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Ionicons name="cloud-upload-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.settingText}>Automatic Data Backup</Text>
                    <Switch
                        value={dataBackup}
                        onValueChange={setDataBackup}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={dataBackup ? "#0066FF" : "#F4F3F4"}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Ionicons name="person-add-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.settingText}>Allow User Registration</Text>
                    <Switch
                        value={userRegistration}
                        onValueChange={setUserRegistration}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={userRegistration ? "#0066FF" : "#F4F3F4"}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>System Settings</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Ionicons name="construct-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.settingText}>Maintenance Mode</Text>
                    <Switch
                        value={maintenanceMode}
                        onValueChange={setMaintenanceMode}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={maintenanceMode ? "#0066FF" : "#F4F3F4"}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Ionicons name="bug-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.settingText}>Debug Mode</Text>
                    <Switch
                        value={debugMode}
                        onValueChange={setDebugMode}
                        trackColor={{ false: "#E1E1E1", true: "#BFD7FF" }}
                        thumbColor={debugMode ? "#0066FF" : "#F4F3F4"}
                    />
                </View>

                <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.settingIconContainer}>
                        <Ionicons name="download-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.settingText}>Export All Data</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.settingIconContainer}>
                        <Ionicons name="sync-outline" size={20} color="#0066FF" />
                    </View>
                    <Text style={styles.settingText}>Sync with Server</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Danger Zone</Text>

                <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleResetDatabase}>
                    <View style={[styles.settingIconContainer, styles.dangerIconContainer]}>
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </View>
                    <Text style={[styles.settingText, styles.dangerText]}>Reset Database</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Admin Panel v1.0.0</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        margin: 15,
        marginBottom: 0,
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
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    settingIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    dangerIconContainer: {
        backgroundColor: "#FFE6E6",
    },
    settingText: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#333333",
    },
    dangerText: {
        color: "#FF3B30",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    dangerButton: {
        borderBottomWidth: 0,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        margin: 15,
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

