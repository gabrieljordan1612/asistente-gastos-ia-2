import React, { useState, useEffect } from 'react';
import type { Goal } from '../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at' | 'current_amount'>>) => void;
  existingGoal: Goal | null;
}

const EMOJI_SUGGESTIONS = ['✈️', '🏠', '💻', '🚗', '🎓', '🎁', '🚑', '📈'];

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSave, existingGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [error, setError] = useState('');

  const isEditing = !!existingGoal;

  useEffect(() => {
    if (isOpen) {
      if (isEditing && existingGoal) {
        setName(existingGoal.name);
        setTargetAmount(String(existingGoal.target_amount));
        setTargetDate(existingGoal.target_date);
        setEmoji(existingGoal.emoji);
      } else {
        setName('');
        setTargetAmount('');
        setTargetDate(new Date().toISOString().split('T')[0]);
        setEmoji('🎯');
      }
      setError('');
    }
  }, [isOpen, isEditing, existingGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (!name.trim() || isNaN(amount) || amount <= 0 || !targetDate) {
      setError('Por favor, completa todos los campos correctamente.');
      return;
    }

    const goalData = { name, target_amount: amount, target_date: targetDate, emoji };
    onSave(goalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            {isEditing ? 'Editar Meta de Ahorro' : 'Nueva Meta de Ahorro'}
          </h2>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="goal-name" className="block text-sm font-medium text-text-secondary">Nombre de la Meta</label>
              <input type="text" id="goal-name" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Viaje a Cusco"
                className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="target-amount" className="block text-sm font-medium text-text-secondary">Monto Objetivo (S/.)</label>
                <input type="number" id="target-amount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required placeholder="1500"
                  className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div className="w-1/2">
                <label htmlFor="target-date" className="block text-sm font-medium text-text-secondary">Fecha Objetivo</label>
                <input type="date" id="target-date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Elige un Ícono</label>
              <div className="flex items-center space-x-2">
                {EMOJI_SUGGESTIONS.map(e => (
                  <button type="button" key={e} onClick={() => setEmoji(e)} className={`text-2xl p-2 rounded-lg transition-all ${emoji === e ? 'bg-primary/20 scale-125' : 'hover:bg-bkg'}`}>
                    {e}
                  </button>
                ))}
                <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} className="w-12 text-2xl p-2 bg-bkg border border-border rounded-md text-center"/>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-primary bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700">{isEditing ? 'Guardar Cambios' : 'Crear Meta'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
