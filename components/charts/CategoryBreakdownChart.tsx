"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/lib/store";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryBreakdownChartProps {
  selectedMonth: string;
}

export function CategoryBreakdownChart({ selectedMonth }: CategoryBreakdownChartProps) {
  const { categories, getTotalExpensesByCategory } = useFinanceStore();
  
  const chartData = useMemo(() => {
    return categories
      .map((category) => {
        const amount = getTotalExpensesByCategory(category.id, selectedMonth);
        return {
          name: category.name,
          value: amount,
          color: category.color,
        };
      })
      .filter((item) => item.value > 0) // Only include categories with expenses
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [categories, getTotalExpensesByCategory, selectedMonth]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / chartData.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-8">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <span 
              className="inline-block w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartData.length > 0 ? (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={85}
            outerRadius={135}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No expenses recorded for this period</p>
        </div>
      )}
    </ResponsiveContainer>
  );
}