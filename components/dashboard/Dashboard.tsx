"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyExpensesChart } from "@/components/charts/MonthlyExpensesChart";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { BudgetComparisonChart } from "@/components/charts/BudgetComparisonChart";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMonthsArray, formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const { 
    transactions, 
    categories, 
    getTotalExpenses, 
    getMonthlyBudgetTotal
  } = useFinanceStore();
  
  const months = generateMonthsArray();
  const [selectedMonth, setSelectedMonth] = useState(months[0].value);
  
  // Get the latest 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const totalExpenses = getTotalExpenses(selectedMonth);
  const totalBudget = getMonthlyBudgetTotal();
  const budgetRemaining = totalBudget - totalExpenses;
  const budgetPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Track your spending, manage your budget, and visualize your finances.
        </p>
      </div>

      <div className="w-full flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
          
          <div className="my-4">
            <Select
              value={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
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

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                  <p className="text-xs text-muted-foreground">
                    {budgetPercentage > 100 ? 'Exceeding budget by ' : 'Using '}
                    {budgetPercentage.toFixed(1)}% of monthly budget
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
                  <p className="text-xs text-muted-foreground">
                    {budgetRemaining > 0 
                      ? `${formatCurrency(budgetRemaining)} remaining`
                      : `${formatCurrency(Math.abs(budgetRemaining))} over budget`}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.length > 0 && (
                    <div className="text-2xl font-bold">
                      {formatCurrency(Math.max(...categories.map(cat => 
                        getTotalExpenses(selectedMonth)
                      )))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {categories.length > 0 
                      ? categories
                          .sort((a, b) => {
                            const aTotal = useFinanceStore.getState().getTotalExpensesByCategory(a.id, selectedMonth);
                            const bTotal = useFinanceStore.getState().getTotalExpensesByCategory(b.id, selectedMonth);
                            return bTotal - aTotal;
                          })[0]?.name || 'No categories'
                      : 'No categories'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                  <CardDescription>
                    Your expenses over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <MonthlyExpensesChart />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your 5 most recent transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction) => (
                          <TransactionCard 
                            key={transaction.id} 
                            transaction={transaction} 
                            compact
                          />
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No transactions yet
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  How your spending is distributed across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <CategoryBreakdownChart selectedMonth={selectedMonth} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs. Actual</CardTitle>
                <CardDescription>
                  Compare your planned budget with actual spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <BudgetComparisonChart selectedMonth={selectedMonth} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}