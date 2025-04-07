import { Stack } from "expo-router"

export default function AppLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="add-expense"
                options={{
                    presentation: "modal",
                    headerShown: true,
                    headerTitle: "Add Expense",
                    headerStyle: {
                        backgroundColor: "#1E293B",
                    },
                    headerTintColor: "#FFFFFF",
                }}
            />
        </Stack>
    )
}

