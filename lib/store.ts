import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  budgetAmount: number;
};

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getTransactionsByMonth: (month: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTotalExpensesByCategory: (categoryId: string, month?: string) => number;
  getTotalExpenses: (month?: string) => number;
  getBudgetProgress: (categoryId: string, month?: string) => number;
  getMonthlyBudgetTotal: () => number;
}

// Default categories with colors matching our design system
const defaultCategories: Category[] = [
  { id: 'food', name: 'Food & Dining', color: 'hsl(var(--chart-1))', budgetAmount: 500 },
  { id: 'housing', name: 'Housing', color: 'hsl(var(--chart-2))', budgetAmount: 1200 },
  { id: 'transportation', name: 'Transportation', color: 'hsl(var(--chart-3))', budgetAmount: 300 },
  { id: 'entertainment', name: 'Entertainment', color: 'hsl(var(--chart-4))', budgetAmount: 200 },
  { id: 'utilities', name: 'Utilities', color: 'hsl(var(--chart-5))', budgetAmount: 250 },
  { id: 'other', name: 'Other', color: 'hsl(var(--muted-foreground))', budgetAmount: 300 },
];

// Sample transactions for demo purposes
const sampleTransactions: Transaction[] = [
  {
    id: uuidv4(),
    amount: -55.99,
    date: new Date(2023, 11, 5),
    description: 'Grocery shopping',
    categoryId: 'food',
  },
  {
    id: uuidv4(),
    amount: -12.50,
    date: new Date(2023, 11, 7),
    description: 'Movie tickets',
    categoryId: 'entertainment',
  },
  {
    id: uuidv4(),
    amount: -1200,
    date: new Date(2023, 11, 1),
    description: 'Rent payment',
    categoryId: 'housing',
  },
  {
    id: uuidv4(),
    amount: -42.30,
    date: new Date(2023, 10, 25),
    description: 'Gas station',
    categoryId: 'transportation',
  },
  {
    id: uuidv4(),
    amount: -120.75,
    date: new Date(2023, 10, 20),
    description: 'Electricity bill',
    categoryId: 'utilities',
  },
  {
    id: uuidv4(),
    amount: -85.63,
    date: new Date(2023, 9, 15),
    description: 'Internet service',
    categoryId: 'utilities',
  },
];

export const useFinanceStore = create<FinanceState>()(
  devtools(
    persist(
      (set, get) => ({
        transactions: sampleTransactions,
        categories: defaultCategories,
        
        addTransaction: (transaction) => {
          const newTransaction = { 
            ...transaction, 
            id: uuidv4() 
          };
          
          set((state) => ({
            transactions: [...state.transactions, newTransaction],
          }));
        },
        
        updateTransaction: (id, updatedTransaction) => {
          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction.id === id
                ? { ...transaction, ...updatedTransaction }
                : transaction
            ),
          }));
        },
        
        deleteTransaction: (id) => {
          set((state) => ({
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
          }));
        },
        
        addCategory: (category) => {
          const newCategory = { 
            ...category, 
            id: uuidv4() 
          };
          
          set((state) => ({
            categories: [...state.categories, newCategory],
          }));
        },
        
        updateCategory: (id, updatedCategory) => {
          set((state) => ({
            categories: state.categories.map((category) =>
              category.id === id
                ? { ...category, ...updatedCategory }
                : category
            ),
          }));
        },
        
        deleteCategory: (id) => {
          const hasTransactions = get().transactions.some(
            (transaction) => transaction.categoryId === id
          );
          
          if (hasTransactions) {
            // Migrate transactions to "Other" category
            set((state) => ({
              transactions: state.transactions.map((transaction) =>
                transaction.categoryId === id
                  ? { ...transaction, categoryId: 'other' }
                  : transaction
              ),
            }));
          }
          
          set((state) => ({
            categories: state.categories.filter((category) => category.id !== id && category.id !== 'other'),
          }));
        },
        
        getTransactionsByMonth: (month) => {
          return get().transactions.filter(
            (transaction) => format(new Date(transaction.date), 'yyyy-MM') === month
          );
        },
        
        getTransactionsByCategory: (categoryId) => {
          return get().transactions.filter(
            (transaction) => transaction.categoryId === categoryId
          );
        },
        
        getTotalExpensesByCategory: (categoryId, month) => {
          let transactions = get().transactions.filter(
            (transaction) => transaction.categoryId === categoryId && transaction.amount < 0
          );
          
          if (month) {
            transactions = transactions.filter(
              (transaction) => format(new Date(transaction.date), 'yyyy-MM') === month
            );
          }
          
          return Math.abs(
            transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
          );
        },
        
        getTotalExpenses: (month) => {
          let transactions = get().transactions.filter(
            (transaction) => transaction.amount < 0
          );
          
          if (month) {
            transactions = transactions.filter(
              (transaction) => format(new Date(transaction.date), 'yyyy-MM') === month
            );
          }
          
          return Math.abs(
            transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
          );
        },
        
        getBudgetProgress: (categoryId, month) => {
          const category = get().categories.find((c) => c.id === categoryId);
          if (!category || category.budgetAmount === 0) return 0;
          
          const expenses = get().getTotalExpensesByCategory(categoryId, month);
          return (expenses / category.budgetAmount) * 100;
        },
        
        getMonthlyBudgetTotal: () => {
          return get().categories.reduce((acc, category) => acc + category.budgetAmount, 0);
        }
      }),
      {
        name: 'finance-store',
      }
    )
  )
);