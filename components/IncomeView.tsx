
import React, { useState, useMemo } from 'react';
import type { Income } from '../types';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

const IncomeSourceIcon = () => (
    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    </div>
);


const IncomeView: React.FC<{ 
    income: Income[], 
    requestDeleteIncome: (id: number) => void, 
    requestEditIncome: (income: Income) => void,
    onAddIncomeClick: () => void 
}> = ({ income, requestDeleteIncome, requestEditIncome, onAddIncomeClick }) => {
    const [filter, setFilter] = useState('');

    const filteredIncome = useMemo(() => {
        if (!filter) {
            return income;
        }
        return income.filter(item =>
            (item.description || '').toLowerCase().includes(filter.toLowerCase()) ||
            item.source.toLowerCase().includes(filter.toLowerCase())
        );
    }, [income, filter]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Historial de Ingresos</h1>
                    <p className="text-text-secondary mt-1">Consulta y gestiona todos tus ingresos registrados.</p>
                </div>
                <button
                    onClick={onAddIncomeClick}
                    className="bg-primary text-background font-bold py-2 px-5 rounded-lg hover:bg-yellow-500 transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 flex items-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Agregar Ingreso</span>
                </button>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 mb-6 shadow-sm">
                <label htmlFor="search-filter" className="block text-sm font-medium text-text-secondary">Buscar</label>
                <input 
                    id="search-filter"
                    type="text"
                    placeholder="Descripción o fuente..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mt-1 w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Fecha</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Descripción</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Fuente</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Monto</th>
                                <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredIncome.length > 0 ? filteredIncome.map((item) => (
                                <tr key={item.id} className="hover:bg-background/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(item.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{item.description || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{item.source}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-green-500">{formatCurrency(item.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => requestEditIncome(item)} className="text-primary hover:text-yellow-400" aria-label={`Editar ingreso: ${item.description || item.source}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => requestDeleteIncome(item.id)} className="text-red-500 hover:text-red-400" aria-label={`Eliminar ingreso: ${item.description || item.source}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-text-secondary">No se encontraron ingresos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

             {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredIncome.length > 0 ? filteredIncome.map((item) => (
                    <div key={item.id} className="bg-surface border border-border rounded-lg p-4 shadow-sm space-y-3 animate-fade-in-up">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <IncomeSourceIcon />
                                <span className="font-bold text-text-primary capitalize">{item.description || item.source}</span>
                            </div>
                            <span className="font-bold text-lg text-green-500">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-text-secondary">
                                <span>{new Date(item.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                <span className="mx-1">·</span>
                                <span>{item.source}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => requestEditIncome(item)} className="text-primary hover:text-yellow-400 p-1" aria-label={`Editar ingreso: ${item.description || item.source}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => requestDeleteIncome(item.id)} className="text-red-500 hover:text-red-400 p-1" aria-label={`Eliminar ingreso: ${item.description || item.source}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-16 text-text-secondary bg-surface rounded-lg">
                        <p>Aún no tienes ingresos registrados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncomeView;
