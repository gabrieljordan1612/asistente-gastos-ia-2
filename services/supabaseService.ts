import { supabase } from './supabaseClient';
import type { Expense, Budget, Income } from '../types';

// Omitimos los campos que son generados automáticamente por la base de datos o el servicio
type ExpenseInsert = Omit<Expense, 'id' | 'user_id' | 'created_at'>;
type IncomeInsert = Omit<Income, 'id' | 'user_id' | 'created_at'>;

export const getExpenses = async (): Promise<Expense[] | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    console.error("No user logged in");
    return null;
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching expenses:', error.message);
    return null;
  }

  return data;
};

export const addExpense = async (expense: ExpenseInsert): Promise<Expense | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    console.error("No user logged in");
    return null;
  }

  const expenseToInsert = { ...expense, user_id: user.id };

  const { data, error } = await supabase
    .from('expenses')
    .insert([expenseToInsert])
    .select()
    .single(); // .single() is fine here as we are inserting and selecting one record

  if (error) {
    console.error('Error adding expense:', error.message);
    return null;
  }

  return data;
};

export const updateExpense = async (id: number, expense: Partial<ExpenseInsert>): Promise<Expense | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
        console.error("No user logged in");
        return null;
    }

    const { data, error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

    if (error) {
        console.error('Error updating expense:', error.message);
        return null;
    }
    
    if (data && data.length > 0) {
        return data[0];
    }
    return null;
};

export const deleteExpense = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting expense:', error.message);
    return false;
  }

  return true;
};

// --- Funciones para Ingresos ---
export const getIncome = async (): Promise<Income[] | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    console.error("No user logged in");
    return null;
  }

  const { data, error } = await supabase
    .from('income')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching income:', error.message);
    return null;
  }
  return data;
};

export const addIncome = async (income: IncomeInsert): Promise<Income | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    console.error("No user logged in");
    return null;
  }

  const incomeToInsert = { ...income, user_id: user.id };

  const { data, error } = await supabase
    .from('income')
    .insert([incomeToInsert])
    .select()
    .single();

  if (error) {
    console.error('Error adding income:', error.message);
    return null;
  }
  return data;
};

export const updateIncome = async (id: number, income: Partial<IncomeInsert>): Promise<Income | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
        console.error("No user logged in");
        return null;
    }

    const { data, error } = await supabase
        .from('income')
        .update(income)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

    if (error) {
        console.error('Error updating income:', error.message);
        return null;
    }
    
    if (data && data.length > 0) {
        return data[0];
    }
    return null;
};

export const deleteIncome = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('income')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting income:', error.message);
    return false;
  }
  return true;
};


// --- Funciones para Presupuestos ---

export const getBudgets = async (): Promise<Budget[] | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    console.error("No user logged in");
    return null;
  }

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching budgets:', error.message);
    return null;
  }
  return data;
};

export const upsertBudget = async (budget: Omit<Budget, 'id' | 'user_id'>): Promise<Budget | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
        console.error("No user logged in");
        return null;
    }

    // Usamos upsert para crear o actualizar un presupuesto para un mes/categoría dados
    // Se asume una restricción UNIQUE en (user_id, month, category) en la base de datos
    const { data, error } = await supabase
        .from('budgets')
        .upsert({ ...budget, user_id: user.id }, { onConflict: 'user_id, month, category' })
        .select()
        .single();
    
    if (error) {
        console.error('Error upserting budget:', error.message);
        return null;
    }
    return data;
};

export const deleteBudget = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting budget:', error.message);
    return false;
  }

  return true;
};