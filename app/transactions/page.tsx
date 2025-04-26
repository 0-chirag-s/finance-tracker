import { Metadata } from 'next';
import TransactionList from '@/components/transactions/TransactionList';

export const metadata: Metadata = {
  title: 'Transactions - Personal Finance Visualizer',
  description: 'Manage your financial transactions',
};

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your financial transactions.
        </p>
      </div>
      <TransactionList />
    </div>
  );
}