"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/lib/store";
import { format, subMonths, startOfMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

export function MonthlyExpensesChart() {
  const { transactions } = useFinanceStore();
  
  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(startOfMonth(new Date()), i);
      const monthKey = format(date, 'yyyy-MM');
      
      const monthlyTotal = Math.abs(
        transactions
          .filter(
            (transaction) => 
              format(new Date(transaction.date), 'yyyy-MM') === monthKey &&
              transaction.amount < 0
          )
          .reduce((acc, transaction) => acc + transaction.amount, 0)
      );
      
      return {
        month: format(date, 'MMM'),
        expenses: monthlyTotal
      };
    }).reverse();
    
    return months;
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false}
          tickMargin={8}
          stroke="var(--muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false}
          tickFormatter={(value) => `$${value}`}
          stroke="var(--muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="expenses" 
          fill="hsl(var(--chart-1))" 
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}