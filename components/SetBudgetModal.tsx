import React, { useState, useEffect } from 'react';
import { PREDEFINED_CATEGORIES } from '../constants';
import type { Budget } from '../types';

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: { amount: number; category: string }) => void;
  existingBudget?: Omit<Budget, 'id' | 'user_id' | 'month'> | null;
  budgetType: 'General' | 'Category';
  existingCategories: string[];
}

const SetBudgetModal: React.FC<SetBudgetModalProps> = ({ isOpen, onClose, onSave, existingBudget, budgetType, existingCategories }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(PREDEFINED_CATEGORIES[0]);

  useEffect(() => {
    if (isOpen) {
        if (existingBudget) {
            setAmount(String(existingBudget.amount));
            if (budgetType === 'Category') {
                setCategory(existingBudget.category);
            }
        } else {
            // Resetea el formulario al abrir para un nuevo presupuesto
            setAmount('');
            // Encuentra la primera categoría predefinida que aún no tiene un presupuesto
            const nextCategory = PREDEFINED_CATEGORIES.find(c => !existingCategories.includes(c)) || PREDEFINED_CATEGORIES[0];
            setCategory(nextCategory);
        }
    }
  }, [isOpen, existingBudget, budgetType, existingCategories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(amount);
    if (!isNaN(finalAmount) && finalAmount > 0) {
      onSave({
        amount: finalAmount,
        category: budgetType === 'General' ? 'General' : category,
      });
      onClose();
    }
  };
  
  // Filtra las categorías disponibles para el selector, permitiendo la actual si se está editando
  const availableCategories = PREDEFINED_CATEGORIES.filter(c => !existingCategories.includes(c) || c === (existingBudget?.category));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-text-primary mb-4">
            {existingBudget ? 'Editar' : 'Establecer'} Presupuesto {budgetType === 'General' ? 'Mensual' : 'de Categoría'}
          </h2>
          <div className="space-y-4">
            {budgetType === 'Category' && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Categoría</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={!!existingBudget} // Deshabilita si se edita, la categoría no debe cambiar
                  className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  {availableCategories.length > 0 ? availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  )) : <option>No hay más categorías</option>}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Monto (S/.)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="Ej: 1200.00"
                className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-primary bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetBudgetModal;