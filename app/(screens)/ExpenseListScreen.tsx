import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../redux/slices/expenseSlice';
import { RootState } from '../redux/store';

const ExpenseListScreen = () => {
    const dispatch = useDispatch();
    const expenses = useSelector((state: RootState) => state.expenses.list);

    useEffect(() => {
        dispatch<any>(fetchExpenses());
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>All Expenses</Text>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10, padding: 10, backgroundColor: '#eee' }}>
                        <Text>💰 {item.amount} {item.currency}</Text>
                        <Text>📅 {new Date(item.date).toDateString()}</Text>
                        <Text>📂 {item.category}</Text>
                        <Text>📝 {item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default ExpenseListScreen;
