import React from 'react';

export interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description: string;
  user_id: string;
  created_at: string;
}

export interface Income {
    id: number;
    user_id: string;
    amount: number;
    source: string; // Ej: Salario, Freelance, Venta
    date: string; // YYYY-MM-DD
    description: string;
    created_at: string;
}

export interface Budget {
  id: number;
  user_id: string;
  month: string; // YYYY-MM
  category: string; // 'General' para el presupuesto principal
  amount: number;
}

export interface ExtractedData {
  amount: number | null;
  date: string | null;
  description: string | null;
}

export interface Plan {
  name: string;
  price: string;
}

// FIX: Define and export the View type to be used across components.
export type View =
  | 'dashboard'
  | 'history'
  | 'categories'
  | 'budgets'
  | 'income'
  | 'reports'
  | 'offers'
  | 'settings';
