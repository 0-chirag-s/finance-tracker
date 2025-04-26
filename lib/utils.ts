import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isValid, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const dateToFormat = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateToFormat) ? format(dateToFormat, 'MMM d, yyyy') : 'Invalid date';
}

export function getMonthYearString(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function getMonthName(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export const generateMonthsArray = () => {
  const months = [];
  const today = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    });
  }
  
  return months;
};