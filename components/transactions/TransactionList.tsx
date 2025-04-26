"use client";

import { useState } from "react";
import { useFinanceStore, Transaction as TransactionType } from "@/lib/store";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateMonthsArray } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TransactionList() {
  const { transactions, categories } = useFinanceStore();
  const { toast } = useToast();
  const months = generateMonthsArray();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  
  const filteredTransactions = [...transactions]
    .filter((transaction) => {
      if (selectedMonth && selectedMonth !== "all") {
        const transactionMonth = new Date(transaction.date).toISOString().substring(0, 7);
        if (transactionMonth !== selectedMonth) return false;
      }
      
      if (selectedCategory && selectedCategory !== "all" && transaction.categoryId !== selectedCategory) return false;
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleEdit = (transaction: TransactionType) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    useFinanceStore.getState().deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been deleted successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Add a new transaction to your financial records.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm 
              onSuccess={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>
                Update this transaction's details.
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <TransactionForm 
                transaction={selectedTransaction}
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4 pr-4">
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={() => handleEdit(transaction)}
                  onDelete={() => handleDelete(transaction.id)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">No transactions found</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add your first transaction
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}