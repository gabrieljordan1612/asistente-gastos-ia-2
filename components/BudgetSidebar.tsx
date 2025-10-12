import React from 'react';
import type { Budget } from '../types';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

interface BudgetSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    mainBudget: Budget | null;
    totalExpenses: number;
    onEditClick: () => void;
}

const BudgetSidebar: React.FC<BudgetSidebarProps> = ({ isOpen, setIsOpen, mainBudget, totalExpenses, onEditClick }) => {
    
    const percentage = mainBudget && mainBudget.amount > 0 ? (totalExpenses / mainBudget.amount) * 100 : 0;
    const remaining = mainBudget ? mainBudget.amount - totalExpenses : 0;
    
    const getProgressBarColor = (p: number) => {
        if (p > 95) return 'bg-red-500';
        if (p > 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const barColor = getProgressBarColor(percentage);

    return (
        <>
            {/* Botón de activación */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed top-1/2 -translate-y-1/2 right-0 z-50 bg-surface border-l border-t border-b border-border rounded-l-lg p-2 shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-[-320px]' : 'translate-x-0'}`}
                aria-label="Toggle Budget Sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </button>

            {/* Panel de la barra lateral */}
            <aside className={`fixed top-0 right-0 h-full w-80 bg-surface border-l border-border shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-text-primary">Presupuesto del Mes</h2>
                         <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {mainBudget ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center mt-4">
                            {/* Barra de Progreso Vertical */}
                            <div className="relative w-20 h-64 bg-border rounded-full flex flex-col-reverse overflow-hidden">
                                <div
                                    className={`w-full ${barColor} transition-all duration-500`}
                                    style={{ height: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>
                            
                            <div className="mt-6 w-full space-y-4">
                                <div>
                                    <p className="text-sm text-text-secondary">Gastado</p>
                                    <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary">Presupuesto Total</p>
                                    <p className="text-2xl font-bold text-text-primary">{formatCurrency(mainBudget.amount)}</p>
                                </div>
                                <hr className="border-border"/>
                                <div>
                                    <p className="text-sm text-text-secondary">{remaining >= 0 ? 'Restante' : 'Excedido'}</p>
                                    <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(Math.abs(remaining))}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => { onEditClick(); setIsOpen(false); }} className="mt-auto w-full bg-primary/10 text-primary font-bold py-3 px-4 rounded-lg hover:bg-primary/20 transition-colors">
                                Editar Presupuesto
                            </button>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center">
                            <p className="text-text-secondary">Aún no has definido un presupuesto para este mes.</p>
                            <button onClick={() => { onEditClick(); setIsOpen(false); }} className="mt-4 w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                                + Establecer Presupuesto
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default BudgetSidebar;