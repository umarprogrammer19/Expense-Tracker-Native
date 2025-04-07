import { createStackNavigator } from "@react-navigation/stack"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import AuthNavigator from "./AuthNavigator"
import MainNavigator from "./MainNavigator"
import SplashScreen from "../(screens)/SplashScreen"

const Stack = createStackNavigator()

const RootNavigator = () => {
    const { token, loading } = useSelector((state: RootState) => state.auth)

    if (loading) {
        return <SplashScreen />
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {token ? (
                <Stack.Screen name="Main" component={MainNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    )
}

export default RootNavigator

