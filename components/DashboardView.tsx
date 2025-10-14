import React, { useState, useMemo } from 'react';
import ExpenseChart from './ExpenseChart';
import { getCategoryIcon } from '../constants';
import type { Expense, Budget, Category } from '../types';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

const SummaryCard: React.FC<{ title: string; value: string | number; color?: 'primary' | 'green' | 'red' | 'gray' | 'yellow'; message?: string }> = ({ title, value, color = 'primary', message }) => {
    
    const colorClasses = {
        primary: 'text-primary',
        green: 'text-green-600',
        red: 'text-red-600',
        gray: 'text-text-secondary',
        yellow: 'text-yellow-600',
    };

    return (
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-text-secondary font-semibold">{title}</h3>
            <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>{value}</p>
            {message && <p className="text-xs text-text-secondary mt-1">{message}</p>}
        </div>
    );
};

const RecentTransactionItem: React.FC<{ transaction: Expense, category?: Category }> = ({ transaction, category }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center space-x-4">
      {getCategoryIcon(transaction.category, category?.color || 'gray', 'sm')}
      <div>
        <p className="font-semibold text-text-primary text-sm">{transaction.description || transaction.category}</p>
        <p className="text-xs text-text-secondary">{new Date(transaction.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
        <p className={`font-bold text-sm shrink-0 text-red-500`}>{formatCurrency(transaction.amount)}</p>
    </div>
  </div>
);


const DashboardView: React.FC<{ 
    expenses: Expense[]; 
    budgets: Budget[]; 
    username: string | null; 
    categories: Category[];
    onAddExpenseClick: () => void;
}> = ({ expenses, budgets, username, categories, onAddExpenseClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  
  const {
      mainBudget,
      totalExpensesForMonth,
  } = useMemo(() => {
      const currentMonthStr = currentDate.toISOString().slice(0, 7); // YYYY-MM
      
      const mainBudget = budgets.find(b => b.month === currentMonthStr && b.category === 'General') || null;
      
      let totalExpenses = 0;
      expenses
          .filter(e => e.date.startsWith(currentMonthStr))
          .forEach(e => {
              totalExpenses += e.amount;
          });
      
      return { mainBudget, totalExpensesForMonth: totalExpenses };
  }, [budgets, expenses, currentDate]);

  const recentTransactions = expenses.slice(0, 5);

  const { remainingBudget, budgetExists } = useMemo(() => {
      if (mainBudget) {
          return { remainingBudget: mainBudget.amount - totalExpensesForMonth, budgetExists: true };
      }
      return { remainingBudget: 0, budgetExists: false };
  }, [mainBudget, totalExpensesForMonth]);
  
  return (
    <div className="space-y-8">
       {/* Mobile only FAB */}
      <button
        onClick={onAddExpenseClick}
        className="md:hidden fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg z-20 hover:bg-blue-700 transition-transform duration-300 hover:scale-110"
        aria-label="Agregar gasto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </button>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Hola, {username || 'Usuario'}!</h1>
            <p className="text-text-secondary">Bienvenido a tu panel de control financiero.</p>
        </div>
        <button
            onClick={onAddExpenseClick}
            className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 flex items-center space-x-2"
            aria-label="Agregar gasto"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
            <span>Agregar gasto</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Gastado este mes" value={formatCurrency(totalExpensesForMonth)} color="red" />
        {budgetExists ? (
            <SummaryCard 
                title="Presupuesto Restante" 
                value={formatCurrency(remainingBudget)} 
                color={remainingBudget >= 0 ? 'green' : 'red'}
                message={remainingBudget < 0 ? '¡Has excedido tu presupuesto!' : '¡Sigue así!'}
             />
        ) : (
             <SummaryCard 
                title="Presupuesto Restante" 
                value="No definido" 
                color="gray"
                message="Crea un presupuesto para empezar."
            />
        )}
        <SummaryCard 
            title="Gasto Total Histórico" 
            value={formatCurrency(expenses.reduce((acc, exp) => acc + exp.amount, 0))}
            color="primary"
        />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 bg-surface p-6 rounded-xl border border-border shadow-sm">
              <ExpenseChart 
                expenses={expenses}
                categories={categories}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Gastos Recientes</h2>
              </div>
              {recentTransactions.length > 0 ? (
                <div className="divide-y divide-border">
                  {recentTransactions.map(transaction => {
                    const category = categories.find(c => c.name === transaction.category);
                    return <RecentTransactionItem key={transaction.id} transaction={transaction} category={category} />
                  })}
                </div>
              ) : (
                  <div className="text-center py-10 h-full flex flex-col justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="mt-4 text-sm font-semibold text-text-secondary">Aún no tienes gastos.</p>
                      <p className="text-xs text-text-secondary">Agrega tu primer gasto para empezar.</p>
                  </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardView;