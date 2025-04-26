import { Metadata } from 'next';
import CategoryManager from '@/components/categories/CategoryManager';

export const metadata: Metadata = {
  title: 'Categories - Personal Finance Visualizer',
  description: 'Manage your transaction categories',
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage your transaction categories and set monthly budgets.
        </p>
      </div>
      <CategoryManager />
    </div>
  );
}