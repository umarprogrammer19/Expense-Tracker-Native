export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface Expense {
    _id: string;
    user: string;
    amount: number;
    category: string;
    currency: string;
    date: string;
    description: string;
}
