import React, { useState, useMemo } from 'react';
import type { Expense, Category } from '../types';
import { getCategoryIcon } from '../constants';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

const HistoryView: React.FC<{ expenses: Expense[], requestDeleteExpense: (id: number) => void, requestEditExpense: (expense: Expense) => void, categories: Category[] }> = ({ expenses, requestDeleteExpense, requestEditExpense, categories }) => {
    const [filter, setFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const filteredExpenses = useMemo(() => {
        let tempExpenses = expenses;

        if (filter) {
            tempExpenses = tempExpenses.filter(expense =>
                (expense.description || '').toLowerCase().includes(filter.toLowerCase()) ||
                expense.category.toLowerCase().includes(filter.toLowerCase())
            );
        }

        if (selectedDate) {
            tempExpenses = tempExpenses.filter(expense => expense.date === selectedDate);
        }

        return tempExpenses;
    }, [expenses, filter, selectedDate]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Historial de Gastos</h1>

            <div className="mb-6 flex flex-wrap items-end gap-4">
                 <div>
                    <label htmlFor="search-filter" className="block text-sm font-medium text-text-secondary">Buscar</label>
                    <input 
                        id="search-filter"
                        type="text"
                        placeholder="Descripción o categoría..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="mt-1 w-full max-w-xs bg-surface border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <label htmlFor="date-filter" className="block text-sm font-medium text-text-secondary">Fecha</label>
                    <input
                        id="date-filter"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-1 bg-surface border border-border rounded-md shadow-sm py-2 px-3 text-text-secondary focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-bkg">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Fecha</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Descripción</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Categoría</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Monto</th>
                            <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => {
                            const category = categories.find(c => c.name === expense.category);
                            return (
                                <tr key={expense.id} className="hover:bg-bkg transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{expense.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{expense.description || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        <div className="flex items-center space-x-2">
                                            {getCategoryIcon(expense.category, category?.color || 'gray')}
                                            <span>{expense.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-red-500">{formatCurrency(expense.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => requestEditExpense(expense)} className="text-primary hover:text-blue-700" aria-label={`Editar gasto: ${expense.description || expense.category}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => requestDeleteExpense(expense.id)} className="text-red-500 hover:text-red-700" aria-label={`Eliminar gasto: ${expense.description || expense.category}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-text-secondary">No se encontraron gastos con los filtros aplicados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryView;