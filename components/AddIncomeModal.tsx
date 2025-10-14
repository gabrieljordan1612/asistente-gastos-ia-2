import React, { useState, useCallback, useEffect } from 'react';
import type { Income } from '../types';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveIncome: (income: Partial<Omit<Income, 'user_id' | 'created_at'>>) => void;
  incomeToEdit?: Income | null;
}

const PREDEFINED_SOURCES = ["Salario", "Freelance", "Ventas", "Regalo", "Inversiones", "Otro"];

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onSaveIncome, incomeToEdit }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [source, setSource] = useState(PREDEFINED_SOURCES[0]);
  const [customSource, setCustomSource] = useState('');
  const [isCustomSource, setIsCustomSource] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!incomeToEdit;

  const resetForm = useCallback(() => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setSource(PREDEFINED_SOURCES[0]);
    setCustomSource('');
    setIsCustomSource(false);
    setError('');
    setDescription('');
  }, []);
  
  useEffect(() => {
    if (isOpen) {
        if (isEditing && incomeToEdit) {
            setAmount(String(incomeToEdit.amount));
            setDate(incomeToEdit.date);
            setDescription(incomeToEdit.description || '');

            const isPredefined = PREDEFINED_SOURCES.includes(incomeToEdit.source);
            if (isPredefined) {
                setSource(incomeToEdit.source);
                setIsCustomSource(incomeToEdit.source === 'Otro');
                setCustomSource('');
            } else {
                setSource('Otro');
                setIsCustomSource(true);
                setCustomSource(incomeToEdit.source);
            }
            setError('');
        } else {
            resetForm();
        }
    }
  }, [isOpen, isEditing, incomeToEdit, resetForm]);


  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSource = isCustomSource ? customSource.trim() : source;
    if (!amount || !finalSource || !date) {
        setError('Por favor, completa todos los campos requeridos.');
        return;
    }
    
    const incomeData: Partial<Omit<Income, 'user_id' | 'created_at'>> = {
      amount: parseFloat(amount),
      source: finalSource,
      date,
      description
    };

    if (isEditing) {
        incomeData.id = incomeToEdit.id;
    }

    onSaveIncome(incomeData);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-center mb-2 text-text-primary">
                {isEditing ? 'Editar Ingreso' : 'Agregar Nuevo Ingreso'}
            </h2>
            <p className="text-center text-text-secondary mb-6">
                {isEditing ? 'Ajusta los detalles de tu ingreso.' : 'Registra el dinero que has recibido.'}
            </p>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Monto (S/.)</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required autoFocus
                            className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Fecha</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required
                            className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Descripción (Opcional)</label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Fuente del Ingreso</label>
                    <div className="grid grid-cols-3 gap-2">
                        {PREDEFINED_SOURCES.map(cat => (
                            <button key={cat} type="button" onClick={() => { setSource(cat); setIsCustomSource(cat === 'Otro'); }}
                                className={`py-2 px-3 text-sm rounded-md transition-all ${source === cat ? 'bg-primary text-background font-semibold' : 'bg-border hover:bg-border/70 text-text-primary'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                {isCustomSource && (
                    <div className="animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                        <label htmlFor="customSource" className="block text-sm font-medium text-text-secondary">Fuente Personalizada</label>
                        <input type="text" id="customSource" value={customSource} onChange={(e) => setCustomSource(e.target.value)} required
                            className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-text-primary bg-border border border-transparent rounded-md hover:bg-border/70 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-background bg-primary rounded-md hover:bg-yellow-500 transition-colors">{isEditing ? 'Guardar Cambios' : 'Guardar Ingreso'}</button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default AddIncomeModal;