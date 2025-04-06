import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24 }}>Welcome, {user?.name}</Text>
            <Text style={{ marginBottom: 20 }}>Role: {user?.role}</Text>

            <Button title="Add Expense" onPress={() => navigation.navigate('AddExpense')} />
            <Button title="View Charts" onPress={() => navigation.navigate('Charts')} />

            {user?.role === 'admin' && <Button title="View All Expenses" onPress={() => navigation.navigate('ExpenseList')} />}
            <Button title="Logout" onPress={() => dispatch(logout())} />
        </View>
    );
};

export default DashboardScreen;
