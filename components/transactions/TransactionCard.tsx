"use client";

import { useFinanceStore, Transaction } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function TransactionCard({ transaction, onEdit, onDelete, compact = false }: TransactionCardProps) {
  const { categories } = useFinanceStore();
  
  const category = categories.find((c) => c.id === transaction.categoryId);
  const isExpense = transaction.amount < 0;
  
  if (!category) return null;

  return (
    <Card className={`overflow-hidden transition-all ${compact ? '' : 'hover:shadow-md'}`}>
      <CardContent className={compact ? 'p-3' : 'p-5'}>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div 
              className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center flex-shrink-0`}
              style={{ backgroundColor: category.color }}
            >
              <span className={`text-white font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="min-w-0">
              <p className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>
                {transaction.description}
              </p>
              <div className="flex items-center gap-2">
                <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                  {formatDate(transaction.date)}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <p className={`text-muted-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                  {category.name}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`font-medium whitespace-nowrap ${isExpense ? 'text-destructive' : 'text-emerald-500'}`}>
              {isExpense ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
            </span>
            
            {!compact && onEdit && onDelete && (
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onEdit}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}