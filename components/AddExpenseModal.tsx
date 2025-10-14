import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { extractExpenseDataFromImage } from '../services/geminiService';
import Spinner from './Spinner';
import type { Expense, Category } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Partial<Omit<Expense, 'user_id' | 'created_at'>>) => void;
  categories: Category[];
  expenseToEdit?: Expense | null;
}

type Status = 'idle' | 'analyzing' | 'manual' | 'confirm';

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSave, categories, expenseToEdit }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories.length > 0 ? categories[0].name : '');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const isEditing = !!expenseToEdit;

  const resetForm = useCallback(() => {
    setStatus('idle');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory(categories.length > 0 ? categories[0].name : '');
    setError('');
    setImagePreview(null);
    setDescription('');
  }, [categories]);
  
  // Update form based on mode (add/edit)
  useEffect(() => {
    if (isOpen) {
        if (isEditing && expenseToEdit) {
            setStatus('manual');
            setAmount(String(expenseToEdit.amount));
            setDate(expenseToEdit.date);
            setDescription(expenseToEdit.description || '');
            setCategory(expenseToEdit.category || (categories.length > 0 ? categories[0].name : ''));
            setImagePreview(null);
            setError('');
        } else {
            resetForm();
        }
    }
  }, [isOpen, isEditing, expenseToEdit, resetForm, categories]);

  const handleClose = () => {
    // We don't call resetForm here because onClose from parent will trigger the useEffect
    onClose();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError('');
      setStatus('analyzing');
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await extractExpenseDataFromImage(base64String, file.type);
        if (result.amount && result.date) {
          setAmount(String(result.amount));
          setDate(result.date);
          setDescription(result.description || '');
          setStatus('confirm');
        } else {
          setError('No pudimos leer los datos. Por favor, ingrésalos manualmente.');
          setStatus('manual');
        }
      };
    }
  };
  
  const handleManualEntryClick = () => {
    setImagePreview(null);
    setStatus('manual');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) {
        setError('Por favor, completa todos los campos requeridos.');
        return;
    }
    const expenseData: Partial<Omit<Expense, 'user_id' | 'created_at'>> = {
      amount: parseFloat(amount),
      category: category,
      date,
      description
    };

    if (isEditing) {
        expenseData.id = expenseToEdit.id;
    }

    onSave(expenseData);
    handleClose();
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (status) {
      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Spinner className="w-12 h-12 text-primary" />
            <p className="text-lg text-text-secondary">Analizando tu comprobante...</p>
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-h-48 rounded-lg object-contain" />}
          </div>
        );
      case 'manual':
      case 'confirm':
        return (
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-center mb-2 text-text-primary">
                {isEditing ? 'Editar Gasto' : (status === 'confirm' ? 'Confirma los Datos' : 'Nuevo Gasto Manual')}
            </h2>
            <p className="text-center text-text-secondary mb-6">
                {isEditing ? 'Ajusta los detalles de tu gasto.' : 'Ajusta los detalles y categoriza tu gasto.'}
            </p>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Monto (S/.)</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required
                            className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Fecha</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required
                            className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Descripción (Opcional)</label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Categoría</label>
                    <div className="grid grid-cols-3 gap-2">
                        {categories.map(cat => (
                            <button key={cat.id} type="button" onClick={() => setCategory(cat.name)}
                                className={`py-2 px-3 text-sm rounded-md transition-all ${category === cat.name ? 'bg-primary text-white font-semibold' : 'bg-gray-100 hover:bg-gray-200 text-text-primary'}`}>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-text-primary bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 transition-colors">{isEditing ? 'Guardar Cambios' : 'Guardar Gasto'}</button>
            </div>
          </form>
        );
      default:
        // This case should not be reachable in edit mode
        if (isEditing) return null;
        return (
          <div className="text-center flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Agregar Nuevo Gasto</h2>
            <div className="w-full p-8 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-primary hover:bg-bkg transition-all">
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-primary font-semibold">Sube una captura o boleta</p>
                    <p className="text-xs text-text-secondary">PNG, JPG, GIF hasta 10MB</p>
                </label>
            </div>
            <div className="my-4 text-text-secondary">O</div>
            <button onClick={handleManualEntryClick} className="w-full bg-surface border border-border text-text-primary py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
              Agregar Gasto Manualmente
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg h-[600px] p-6 transform transition-all" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AddExpenseModal;