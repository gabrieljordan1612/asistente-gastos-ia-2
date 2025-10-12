import React, { useState, useEffect, useMemo } from 'react';
import { getBudgets, upsertBudget } from '../services/supabaseService';
import type { Expense, Budget } from '../types';
import { getCategoryIcon, PREDEFINED_CATEGORIES } from '../constants';
import SetBudgetModal from './SetBudgetModal';
import Spinner from './Spinner';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

// Helper para obtener color basado en el porcentaje
const getProgressBarColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
};

const BudgetProgressBar: React.FC<{ spent: number; total: number }> = ({ spent, total }) => {
    const percentage = total > 0 ? (spent / total) * 100 : 0;
    const displayPercentage = Math.min(percentage, 100);
    const color = getProgressBarColor(percentage);

    return (
        <div className="w-full bg-border rounded-full h-4 mt-2">
            <div
                className={`h-4 rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${displayPercentage}%` }}
            ></div>
        </div>
    );
};

const BudgetView: React.FC<{ expenses: Expense[], onBudgetsUpdate: () => void, requestDeleteBudget: (id: number) => void }> = ({ expenses, onBudgetsUpdate, requestDeleteBudget }) => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'General' | 'Category'>('General');
    const [budgetToEdit, setBudgetToEdit] = useState<Omit<Budget, 'id' | 'user_id' | 'month'> | null>(null);

    const fetchBudgetsForMonth = async () => {
        setLoading(true);
        // FIX: The `getBudgets` function does not accept any arguments. It fetches all budgets for the user.
        const data = await getBudgets();
        setBudgets(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchBudgetsForMonth();
    }, [currentMonth]);

    const {
        mainBudget,
        categoryBudgets,
        totalSpent,
        spentByCategory,
    } = useMemo(() => {
        // FIX: Since all budgets are fetched, they need to be filtered for the current month.
        const budgetsForMonth = budgets.filter(b => b.month === currentMonth);
        const mainBudget = budgetsForMonth.find(b => b.category === 'General') || null;
        const categoryBudgets = budgetsForMonth.filter(b => b.category !== 'General').sort((a,b) => PREDEFINED_CATEGORIES.indexOf(a.category) - PREDEFINED_CATEGORIES.indexOf(b.category));
        
        let totalSpent = 0;
        const spentByCategory: { [key: string]: number } = {};

        expenses
            .filter(e => e.date.startsWith(currentMonth))
            .forEach(e => {
                totalSpent += e.amount;
                spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount;
            });
        
        return { mainBudget, categoryBudgets, totalSpent, spentByCategory };
    }, [budgets, expenses, currentMonth]);
    
    const canAddMoreCategories = useMemo(() => {
        const usedCategories = categoryBudgets.map(b => b.category);
        return PREDEFINED_CATEGORIES.some(c => !usedCategories.includes(c));
    }, [categoryBudgets]);

    const handleOpenModal = (type: 'General' | 'Category', budget?: Omit<Budget, 'id' | 'user_id' | 'month'> | null) => {
        if (type === 'Category' && !budget && !canAddMoreCategories) {
            return; // No abrir el modal si no hay más categorías para agregar
        }
        setModalType(type);
        setBudgetToEdit(budget || null);
        setIsModalOpen(true);
    };

    const handleSaveBudget = async (budgetData: { amount: number; category: string }) => {
        const budgetToSave = {
            month: currentMonth,
            ...budgetData
        };
        const savedBudget = await upsertBudget(budgetToSave);
        if (savedBudget) {
            await fetchBudgetsForMonth();
            onBudgetsUpdate(); // Notifica al padre para que recargue los presupuestos
        }
        setIsModalOpen(false);
    };
    
    const remainingAmount = mainBudget ? mainBudget.amount - totalSpent : 0;

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner className="w-12 h-12 text-primary" /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Presupuestos</h1>
            
            {/* Tarjeta de Presupuesto Principal */}
            <div className="bg-surface border border-border rounded-xl shadow-sm p-6 mb-8">
                {mainBudget ? (
                    <div>
                        <div className="flex justify-between items-start">
                           <div>
                                <h2 className="text-sm font-semibold text-text-secondary">Presupuesto Total del Mes</h2>
                                <p className="text-3xl font-bold text-text-primary mt-1">{formatCurrency(mainBudget.amount)}</p>
                           </div>
                           <button onClick={() => handleOpenModal('General', mainBudget)} className="text-sm font-medium text-primary hover:text-blue-700">Editar</button>
                        </div>
                        <BudgetProgressBar spent={totalSpent} total={mainBudget.amount} />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-text-secondary">Gastado: <span className="font-bold text-red-500">{formatCurrency(totalSpent)}</span></span>
                            <span className="text-text-secondary">
                                {remainingAmount >= 0 ? 'Restante: ' : 'Excedido: '}
                                <span className={`font-bold ${remainingAmount >=0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(Math.abs(remainingAmount))}
                                </span>
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <p className="mt-4 font-semibold text-text-primary">Aún no has definido tu presupuesto mensual.</p>
                        <p className="text-sm text-text-secondary">Establece un límite para empezar a controlar tus gastos.</p>
                        <button onClick={() => handleOpenModal('General')} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform duration-300 hover:scale-105">
                            Establecer Presupuesto Mensual
                        </button>
                    </div>
                )}
            </div>
            
            {/* Sección de Presupuestos por Categoría */}
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Presupuestos por Categoría</h2>
                    <button 
                        onClick={() => handleOpenModal('Category')} 
                        disabled={!canAddMoreCategories}
                        className="bg-secondary/10 text-secondary font-semibold text-sm py-2 px-4 rounded-lg hover:bg-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        + Agregar Categoría
                    </button>
                </div>
                {categoryBudgets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryBudgets.map(budget => {
                            const spent = spentByCategory[budget.category] || 0;
                            return (
                                <div key={budget.id} className="bg-surface border border-border rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            {getCategoryIcon(budget.category)}
                                            <span className="font-bold text-text-primary">{budget.category}</span>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <button onClick={() => handleOpenModal('Category', budget)} className="text-text-secondary hover:text-primary" aria-label={`Editar presupuesto de ${budget.category}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => requestDeleteBudget(budget.id)} className="text-text-secondary hover:text-red-500" aria-label={`Eliminar presupuesto de ${budget.category}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <BudgetProgressBar spent={spent} total={budget.amount} />
                                    <div className="text-xs text-text-secondary mt-1.5 flex justify-between">
                                        <span>{formatCurrency(spent)}</span>
                                        <span>de {formatCurrency(budget.amount)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-surface border-2 border-dashed border-border rounded-lg">
                        <p className="font-semibold text-text-secondary">Asigna presupuestos a categorías específicas</p>
                        <p className="text-sm text-text-secondary mt-1">Por ejemplo, "Comida", "Transporte", etc.</p>
                    </div>
                )}
            </div>

            <SetBudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveBudget}
                existingBudget={budgetToEdit}
                budgetType={modalType}
                existingCategories={categoryBudgets.map(b => b.category)}
            />
        </div>
    );
};

export default BudgetView;
