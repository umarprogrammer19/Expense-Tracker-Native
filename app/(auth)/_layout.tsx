import { Stack } from "expo-router"
import { View } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function AuthLayout() {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#FFFFFF" },
                    animation: "slide_from_right",
                }}
            />
        </View>
    )
}

