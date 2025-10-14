import React, { useState, useMemo } from 'react';
import type { Expense, Category } from '../types';
import { getCategoryIcon } from '../constants';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

type ActivePeriod = 'today' | 'thisWeek' | 'thisMonth' | null;

const HistoryView: React.FC<{ expenses: Expense[], requestDeleteExpense: (id: number) => void, requestEditExpense: (expense: Expense) => void, categories: Category[] }> = ({ expenses, requestDeleteExpense, requestEditExpense, categories }) => {
    const [filter, setFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [activePeriod, setActivePeriod] = useState<ActivePeriod>(null);

    const handlePeriodClick = (period: ActivePeriod) => {
        setActivePeriod(period);
        setSelectedDate(''); // Clear manual date selection
    };
    
    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setActivePeriod(null); // Clear period selection
    };

    const clearDateFilters = () => {
        setSelectedDate('');
        setActivePeriod(null);
    };

    const filteredExpenses = useMemo(() => {
        let tempExpenses = expenses;

        // Text filter
        if (filter) {
            tempExpenses = tempExpenses.filter(expense =>
                (expense.description || '').toLowerCase().includes(filter.toLowerCase()) ||
                expense.category.toLowerCase().includes(filter.toLowerCase())
            );
        }

        // Date filters
        if (selectedDate) {
            tempExpenses = tempExpenses.filter(expense => expense.date === selectedDate);
        } else if (activePeriod) {
             const today = new Date();
             today.setHours(0, 0, 0, 0);

             if (activePeriod === 'today') {
                const todayStr = today.toISOString().split('T')[0];
                tempExpenses = tempExpenses.filter(expense => expense.date === todayStr);
             } else if (activePeriod === 'thisWeek') {
                 // Sunday - Saturday : 0 - 6
                 const firstDayOfWeek = new Date(today);
                 const day = today.getDay();
                 const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                 firstDayOfWeek.setDate(diff);

                 const lastDayOfWeek = new Date(firstDayOfWeek);
                 lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

                 const startStr = firstDayOfWeek.toISOString().split('T')[0];
                 const endStr = lastDayOfWeek.toISOString().split('T')[0];
                 
                 tempExpenses = tempExpenses.filter(expense => expense.date >= startStr && expense.date <= endStr);
             } else if (activePeriod === 'thisMonth') {
                 const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                 const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                 const startStr = startOfMonth.toISOString().split('T')[0];
                 const endStr = endOfMonth.toISOString().split('T')[0];

                 tempExpenses = tempExpenses.filter(expense => expense.date >= startStr && expense.date <= endStr);
             }
        }

        return tempExpenses;
    }, [expenses, filter, selectedDate, activePeriod]);
    
    const isDateFilterActive = selectedDate !== '' || activePeriod !== null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Historial de Gastos</h1>

            <div className="bg-surface border border-border rounded-lg p-4 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search-filter" className="block text-sm font-medium text-text-secondary">Buscar</label>
                        <input 
                            id="search-filter"
                            type="text"
                            placeholder="Descripción o categoría..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="mt-1 w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="date-filter" className="block text-sm font-medium text-text-secondary">Fecha Específica</label>
                        <input
                            id="date-filter"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateInputChange}
                            className="mt-1 w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-text-secondary focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                     <label className="block text-sm font-medium text-text-secondary mb-2">Filtros Rápidos de Fecha</label>
                     <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => handlePeriodClick('today')} className={`px-3 py-1 text-sm rounded-full transition-colors ${activePeriod === 'today' ? 'bg-primary text-background font-semibold' : 'bg-border hover:bg-border/70 text-text-primary'}`}>Hoy</button>
                        <button onClick={() => handlePeriodClick('thisWeek')} className={`px-3 py-1 text-sm rounded-full transition-colors ${activePeriod === 'thisWeek' ? 'bg-primary text-background font-semibold' : 'bg-border hover:bg-border/70 text-text-primary'}`}>Esta Semana</button>
                        <button onClick={() => handlePeriodClick('thisMonth')} className={`px-3 py-1 text-sm rounded-full transition-colors ${activePeriod === 'thisMonth' ? 'bg-primary text-background font-semibold' : 'bg-border hover:bg-border/70 text-text-primary'}`}>Este Mes</button>
                        {isDateFilterActive && (
                            <button onClick={clearDateFilters} className="px-3 py-1 text-sm text-red-500 hover:bg-red-500/10 rounded-full transition-colors">Limpiar</button>
                        )}
                     </div>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
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
                                    <tr key={expense.id} className="hover:bg-background/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(expense.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{expense.description || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            <div className="flex items-center space-x-2">
                                                {getCategoryIcon(expense.category)}
                                                <span>{expense.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-red-500">{formatCurrency(expense.amount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button onClick={() => requestEditExpense(expense)} className="text-primary hover:text-yellow-400" aria-label={`Editar gasto: ${expense.description || expense.category}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => requestDeleteExpense(expense.id)} className="text-red-500 hover:text-red-400" aria-label={`Eliminar gasto: ${expense.description || expense.category}`}>
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
        </div>
    );
};

export default HistoryView;