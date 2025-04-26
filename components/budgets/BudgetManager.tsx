"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMonthsArray, formatCurrency } from "@/lib/utils";
import { BudgetComparisonChart } from "@/components/charts/BudgetComparisonChart";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BudgetManager() {
  const { categories, getTotalExpensesByCategory, getTotalExpenses, getMonthlyBudgetTotal } = useFinanceStore();
  
  const months = generateMonthsArray();
  const [selectedMonth, setSelectedMonth] = useState(months[0].value);
  
  const totalExpenses = getTotalExpenses(selectedMonth);
  const totalBudget = getMonthlyBudgetTotal();
  const budgetPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Budget Overview
        </h2>
        
        <Select
          value={selectedMonth}
          onValueChange={(value) => setSelectedMonth(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Budget</CardTitle>
          <CardDescription>
            Your overall monthly budget and spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Budget
                </p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">
                  Spent so far
                </p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{budgetPercentage.toFixed(0)}%</span>
              </div>
              <Progress 
                value={Math.min(budgetPercentage, 100)} 
                className="h-3"
                indicatorClassName={budgetPercentage > 100 ? "bg-destructive" : undefined}
              />
              
              <p className={`text-sm ${budgetPercentage > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {budgetPercentage > 100 
                  ? `You're ${formatCurrency(totalExpenses - totalBudget)} over budget`
                  : `You have ${formatCurrency(totalBudget - totalExpenses)} remaining`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Budget vs. actual spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <BudgetComparisonChart selectedMonth={selectedMonth} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
            <CardDescription>
              Individual category budgets and spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-6">
                {categories
                  .sort((a, b) => {
                    const aSpent = getTotalExpensesByCategory(a.id, selectedMonth);
                    const bSpent = getTotalExpensesByCategory(b.id, selectedMonth);
                    return bSpent / b.budgetAmount - aSpent / a.budgetAmount;
                  })
                  .map((category) => {
                    const spent = getTotalExpensesByCategory(category.id, selectedMonth);
                    const percentage = category.budgetAmount > 0 
                      ? (spent / category.budgetAmount) * 100 
                      : 0;
                    
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            {formatCurrency(spent)} / {formatCurrency(category.budgetAmount)}
                          </span>
                          <span className={percentage > 100 ? 'text-destructive' : ''}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="h-2"
                          indicatorClassName={percentage > 100 ? "bg-destructive" : undefined}
                          style={{ backgroundColor: `${category.color}20` }}
                          indicatorStyle={{ backgroundColor: category.color }}
                        />
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}