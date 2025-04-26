"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFinanceStore, Category } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Category name is required",
  }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
  budgetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Budget must be a positive number",
  }),
});

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { addCategory, updateCategory } = useFinanceStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      color: category?.color?.startsWith('#') 
        ? category.color 
        : category?.color || "#3B82F6",
      budgetAmount: category?.budgetAmount.toString() || "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const budgetAmount = Number(values.budgetAmount);
    
    if (category) {
      updateCategory(category.id, {
        name: values.name,
        color: values.color,
        budgetAmount,
      });
      
      toast({
        title: "Category updated",
        description: "Your category has been updated successfully."
      });
    } else {
      addCategory({
        name: values.name,
        color: values.color,
        budgetAmount,
      });
      
      toast({
        title: "Category added",
        description: "Your category has been added successfully."
      });
    }
    
    onSuccess();
  }

  // Predefined colors
  const colorOptions = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#ec4899", // pink
    "#64748b", // slate
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: field.value }}
                  ></div>
                  <Input type="text" placeholder="#3B82F6" {...field} />
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded-full border border-input"
                    style={{ backgroundColor: color }}
                    onClick={() => form.setValue("color", color)}
                  ></button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budgetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Budget</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input 
                    placeholder="0" 
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">
            {category ? "Update" : "Add"} Category
          </Button>
        </div>
      </form>
    </Form>
  );
}