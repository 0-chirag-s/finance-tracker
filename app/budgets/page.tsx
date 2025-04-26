import { Metadata } from 'next';
import BudgetManager from '@/components/budgets/BudgetManager';

export const metadata: Metadata = {
  title: 'Budgets - Personal Finance Visualizer',
  description: 'Set and manage your monthly budgets',
};

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">
          Set monthly budgets and track your spending.
        </p>
      </div>
      <BudgetManager />
    </div>
  );
}