"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface BudgetComparisonChartProps {
  selectedMonth: string;
}

export function BudgetComparisonChart({ selectedMonth }: BudgetComparisonChartProps) {
  const { categories, getTotalExpensesByCategory } = useFinanceStore();
  
  const chartData = useMemo(() => {
    return categories
      .map((category) => {
        const expenses = getTotalExpensesByCategory(category.id, selectedMonth);
        const budget = category.budgetAmount;
        
        return {
          name: category.name.length > 12 ? category.name.substring(0, 12) + "..." : category.name,
          fullName: category.name,
          budget,
          spent: expenses,
          remaining: Math.max(0, budget - expenses),
          overspent: Math.max(0, expenses - budget)
        };
      })
      .filter((item) => item.budget > 0) // Only include categories with a budget
      .sort((a, b) => b.spent - a.spent); // Sort by spending
  }, [categories, getTotalExpensesByCategory, selectedMonth]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm">Budget: {formatCurrency(data.budget)}</p>
          <p className="text-sm">Spent: {formatCurrency(data.spent)}</p>
          {data.remaining > 0 && (
            <p className="text-sm text-emerald-500">Remaining: {formatCurrency(data.remaining)}</p>
          )}
          {data.overspent > 0 && (
            <p className="text-sm text-destructive">Overspent: {formatCurrency(data.overspent)}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {((data.spent / data.budget) * 100).toFixed(1)}% of budget
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartData.length > 0 ? (
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
          <XAxis 
            type="number" 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
            stroke="var(--muted-foreground)"
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            width={100}
            stroke="var(--muted-foreground)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-3))" opacity={0.7} radius={[0, 4, 4, 0]} />
          <Bar dataKey="spent" name="Spent" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
        </BarChart>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No budget data available for this period</p>
        </div>
      )}
    </ResponsiveContainer>
  );
}