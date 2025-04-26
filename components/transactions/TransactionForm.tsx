"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useFinanceStore, Transaction } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Amount must be a number",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  categoryId: z.string({
    required_error: "Please select a category",
  }),
});

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess: () => void;
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const { categories, addTransaction, updateTransaction } = useFinanceStore();
  const { toast } = useToast();
  const [isExpense, setIsExpense] = useState(transaction ? transaction.amount < 0 : true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction ? Math.abs(transaction.amount).toString() : "",
      date: transaction ? new Date(transaction.date) : new Date(),
      description: transaction?.description || "",
      categoryId: transaction?.categoryId || categories[0]?.id || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const amount = Number(values.amount) * (isExpense ? -1 : 1);
    
    if (transaction) {
      updateTransaction(transaction.id, {
        amount,
        date: values.date,
        description: values.description,
        categoryId: values.categoryId,
      });
      
      toast({
        title: "Transaction updated",
        description: "Your transaction has been updated successfully."
      });
    } else {
      addTransaction({
        amount,
        date: values.date,
        description: values.description,
        categoryId: values.categoryId,
      });
      
      toast({
        title: "Transaction added",
        description: "Your transaction has been added successfully."
      });
    }
    
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={isExpense ? "default" : "outline"}
            onClick={() => setIsExpense(true)}
            className="flex-1"
          >
            Expense
          </Button>
          <Button
            type="button"
            variant={!isExpense ? "default" : "outline"}
            onClick={() => setIsExpense(false)}
            className="flex-1"
          >
            Income
          </Button>
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input 
                    placeholder="0.00" 
                    {...field} 
                    className="pl-8" 
                    type="number"
                    step="0.01"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="What's this transaction for?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">
            {transaction ? "Update" : "Add"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}