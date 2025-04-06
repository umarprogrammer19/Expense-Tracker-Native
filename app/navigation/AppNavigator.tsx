import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
// import ChartsScreen from '../screens/ChartsScreen';
import ExpenseListScreen from '../screens/ExpenseListScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
            {/* <Stack.Screen name="Charts" component={ChartsScreen} /> */}
            <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
