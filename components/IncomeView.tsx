import React, { useState, useMemo } from 'react';
import type { Income } from '../types';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

const IncomeView: React.FC<{ income: Income[], requestDeleteIncome: (id: number) => void, onAddIncomeClick: () => void }> = ({ income, requestDeleteIncome, onAddIncomeClick }) => {
    const [filter, setFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const filteredIncome = useMemo(() => {
        let tempIncome = income;

        if (filter) {
            tempIncome = tempIncome.filter(i =>
                (i.description || '').toLowerCase().includes(filter.toLowerCase()) ||
                i.source.toLowerCase().includes(filter.toLowerCase())
            );
        }

        if (selectedDate) {
            tempIncome = tempIncome.filter(i => i.date === selectedDate);
        }

        return tempIncome;
    }, [income, filter, selectedDate]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Historial de Ingresos</h1>
                <button
                    onClick={onAddIncomeClick}
                    className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-transform duration-300 hover:scale-105 shadow-lg shadow-secondary/20"
                >
                    + Añadir Ingreso
                </button>
            </div>
            

            <div className="mb-6 flex flex-wrap items-end gap-4">
                 <div>
                    <label htmlFor="search-filter" className="block text-sm font-medium text-text-secondary">Buscar</label>
                    <input 
                        id="search-filter"
                        type="text"
                        placeholder="Descripción o fuente..."
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Fuente</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Monto</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Eliminar</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredIncome.length > 0 ? filteredIncome.map((inc) => (
                            <tr key={inc.id} className="hover:bg-bkg transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{inc.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{inc.description || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{inc.source}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-green-600">{formatCurrency(inc.amount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => requestDeleteIncome(inc.id)} className="text-red-500 hover:text-red-700" aria-label={`Eliminar ingreso: ${inc.description || inc.source}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-text-secondary">No se encontraron ingresos con los filtros aplicados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncomeView;