"use client"

import { useAppDispatch } from "@/hooks/reduxHook"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import { fetchAllExpenses } from "../../store/slices/adminSlice"

export default function UsersScreen() {
    const dispatch = useAppDispatch()
    const { users, loading } = useSelector((state: RootState) => state.admin)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState<string | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        dispatch(fetchAllExpenses())
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    // Filter users based on search query and selected role
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = selectedRole ? user.role === selectedRole : true
        return matchesSearch && matchesRole
    })

    const renderUserItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.userItem}>
            <View style={styles.userAvatarContainer}>
                <Text style={styles.userAvatarText}>
                    {item.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                </Text>
            </View>
            <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={styles.userMetaContainer}>
                    <View style={[styles.roleBadge, item.role === "admin" ? styles.adminRoleBadge : styles.userRoleBadge]}>
                        <Text style={[styles.roleText, item.role === "admin" ? styles.adminRoleText : styles.userRoleText]}>
                            {item.role}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>Joined: {new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
    )

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#666666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.roleFilterContainer}>
                <TouchableOpacity
                    style={[styles.roleFilterButton, selectedRole === null && styles.selectedRoleButton]}
                    onPress={() => setSelectedRole(null)}
                >
                    <Text style={[styles.roleFilterText, selectedRole === null && styles.selectedRoleText]}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleFilterButton, selectedRole === "user" && styles.selectedRoleButton]}
                    onPress={() => setSelectedRole("user")}
                >
                    <Text style={[styles.roleFilterText, selectedRole === "user" && styles.selectedRoleText]}>Users</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleFilterButton, selectedRole === "admin" && styles.selectedRoleButton]}
                    onPress={() => setSelectedRole("admin")}
                >
                    <Text style={[styles.roleFilterText, selectedRole === "admin" && styles.selectedRoleText]}>Admins</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={60} color="#CCCCCC" />
                        <Text style={styles.emptyText}>No users found</Text>
                        <Text style={styles.emptySubText}>
                            {searchQuery || selectedRole ? "Try changing your filters" : "Add your first user"}
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        margin: 15,
        paddingHorizontal: 15,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontFamily: "Poppins-Regular",
        fontSize: 14,
    },
    roleFilterContainer: {
        flexDirection: "row",
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    roleFilterButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedRoleButton: {
        backgroundColor: "#0066FF",
    },
    roleFilterText: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        color: "#666666",
    },
    selectedRoleText: {
        color: "#FFFFFF",
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 80,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    userAvatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    userAvatarText: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: "#0066FF",
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#333333",
    },
    userEmail: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginTop: 2,
    },
    userMetaContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 10,
    },
    userRoleBadge: {
        backgroundColor: "#E6F0FF",
    },
    adminRoleBadge: {
        backgroundColor: "#FFE6E6",
    },
    roleText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        textTransform: "capitalize",
    },
    userRoleText: {
        color: "#0066FF",
    },
    adminRoleText: {
        color: "#FF3B30",
    },
    dateText: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#999999",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 50,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: "#333333",
        marginTop: 20,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666666",
        marginTop: 5,
        textAlign: "center",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#0066FF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
})

