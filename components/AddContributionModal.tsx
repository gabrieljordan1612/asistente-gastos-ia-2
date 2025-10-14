import React, { useState, useEffect } from 'react';
import type { Goal, GoalContribution } from '../types';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contribution: Omit<GoalContribution, 'id'|'user_id'|'created_at'|'goal_id'>) => void;
  goal: Goal | null;
}

const AddContributionModal: React.FC<AddContributionModalProps> = ({ isOpen, onClose, onSave, goal }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contributionAmount = parseFloat(amount);
    if (!goal || isNaN(contributionAmount) || contributionAmount <= 0) {
      setError('Por favor, ingresa un monto válido.');
      return;
    }
    if (contributionAmount > (goal.target_amount - goal.current_amount)) {
        if (!confirm(`Este aporte excede el monto restante para tu meta. ¿Deseas continuar?`)) {
            return;
        }
    }

    onSave({ amount: contributionAmount, date });
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-text-primary mb-2">Aportar a "{goal.name}"</h2>
          <p className="text-sm text-text-secondary mb-4">
            Restante: <span className="font-semibold text-primary">S/. {(goal.target_amount - goal.current_amount).toFixed(2)}</span>
          </p>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="contribution-amount" className="block text-sm font-medium text-text-secondary">Monto (S/.)</label>
                <input type="number" id="contribution-amount" value={amount} onChange={e => setAmount(e.target.value)} required autoFocus
                  className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div className="w-1/2">
                <label htmlFor="contribution-date" className="block text-sm font-medium text-text-secondary">Fecha</label>
                <input type="date" id="contribution-date" value={date} onChange={e => setDate(e.target.value)} required
                  className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-primary bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700">Guardar Aporte</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal;
