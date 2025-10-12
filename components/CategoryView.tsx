import React, { useState, useMemo } from 'react';
import type { Expense } from '../types';
import { PREDEFINED_CATEGORIES, getCategoryIcon } from '../constants';
import ExpenseCalendarChart from './ExpenseChart';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

interface CategoryViewProps {
    expenses: Expense[];
    requestDeleteExpense: (id: number) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ expenses, requestDeleteExpense }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const expensesForCategory = useMemo(() => {
        if (!selectedCategory) return [];
        return expenses.filter(e => e.category === selectedCategory);
    }, [expenses, selectedCategory]);

    const expensesToList = useMemo(() => {
        if (!selectedDate) {
            return [];
        }
        return expensesForCategory.filter(e => e.date === selectedDate);
    }, [expensesForCategory, selectedDate]);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setCurrentDate(new Date());
        setSelectedDate(null);
    };

    if (!selectedCategory) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Categorías</h1>
                <p className="text-text-secondary mb-8">Selecciona una categoría para ver los gastos detallados.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {PREDEFINED_CATEGORIES.map((cat, index) => (
                        <div
                            key={cat}
                            onClick={() => handleCategorySelect(cat)}
                            className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-primary animate-fade-in-up"
                            style={{ animationDelay: `${index * 80}ms` }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleCategorySelect(cat)}
                        >
                            {getCategoryIcon(cat, 'lg')}
                            <p className="mt-4 font-bold text-text-primary">{cat}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up" style={{ animationDuration: '0.5s' }}>
            <div className="mb-6">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Todas las categorías
                </button>
            </div>
            
            <div className="flex items-center mb-8">
                 {getCategoryIcon(selectedCategory, 'lg')}
                 <h1 className="text-3xl font-bold text-text-primary ml-4">Gastos de {selectedCategory}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3 bg-surface p-6 rounded-xl border border-border shadow-sm">
                    <ExpenseCalendarChart 
                        expenses={expensesForCategory}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        chartMode="byDay"
                    />
                </div>
                <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border shadow-sm">
                    <h2 className="text-xl font-bold mb-2">Detalle de Gastos</h2>
                    <p className="text-sm text-text-secondary mb-4 h-10">
                        {selectedDate 
                            ? `Mostrando gastos del ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}.`
                            : 'Selecciona un día en el calendario para ver el detalle.'
                        }
                    </p>
                    <div className="border border-border rounded-lg overflow-hidden shadow-sm min-h-[200px]">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-bkg">
                                <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Descripción</th>
                                    <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Monto</th>
                                    <th scope="col" className="relative px-4 py-2"><span className="sr-only">Eliminar</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {expensesToList.length > 0 ? (
                                    expensesToList.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-bkg transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-primary">{expense.description || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-right text-red-500">{formatCurrency(expense.amount)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => requestDeleteExpense(expense.id)} className="text-red-500 hover:text-red-700" aria-label={`Eliminar gasto: ${expense.description || expense.category}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 text-text-secondary">No hay gastos para la fecha seleccionada.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
// Fix: Add default export for the component.
export default CategoryView;
