import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addExpense } from '../redux/slices/expenseSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

const AddExpenseScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('USD');

    const handleSubmit = async () => {
        await dispatch<any>(addExpense({
            amount: parseFloat(amount),
            category,
            description,
            currency,
            date: new Date().toISOString(),
            user: '', // server will handle from token
        }));
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Expense</Text>
            <TextInput placeholder="Amount" style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <TextInput placeholder="Category" style={styles.input} value={category} onChangeText={setCategory} />
            <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
            <TextInput placeholder="Currency (e.g. USD, PKR)" style={styles.input} value={currency} onChangeText={setCurrency} />
            <Button title="Save" onPress={handleSubmit} />
        </View>
    );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderBottomWidth: 1, padding: 10, marginBottom: 10 },
});
