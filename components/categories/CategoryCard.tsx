"use client";

import { useFinanceStore, Category } from "@/lib/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
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

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const { getTotalExpensesByCategory, getBudgetProgress } = useFinanceStore();
  
  // Calculate for current month
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthlySpent = getTotalExpensesByCategory(category.id, currentMonth);
  const progress = getBudgetProgress(category.id, currentMonth);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div 
        className="h-2"
        style={{ backgroundColor: category.color }}
      ></div>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: category.color }}
            >
              <span className="text-white font-medium text-xs">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="font-medium">{category.name}</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Monthly Budget</span>
              <span className="font-medium">{formatCurrency(category.budgetAmount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Spent this month</span>
              <span className="font-medium">{formatCurrency(monthlySpent)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span className={`font-medium ${monthlySpent > category.budgetAmount ? 'text-destructive' : ''}`}>
                {monthlySpent > category.budgetAmount 
                  ? `-${formatCurrency(monthlySpent - category.budgetAmount)}` 
                  : formatCurrency(category.budgetAmount - monthlySpent)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress 
              value={Math.min(progress, 100)} 
              className="h-2"
              indicatorClassName={progress > 100 ? "bg-destructive" : undefined}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-3 flex justify-end gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
          className="h-8"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this category? All associated transactions will be moved to the "Other" category.
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
      </CardFooter>
    </Card>
  );
}