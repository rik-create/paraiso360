import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatCurrency(amount: number, currency: string = 'PHP'): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: currency }).format(amount);
}
