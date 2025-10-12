import React, { useState, useEffect } from 'react';
import { PALETTE, PALETTE_COLORS } from '../constants';
import type { Category } from '../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  existingCategory: Category | null;
  allCategories: Category[];
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSave, existingCategory, allCategories }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE_COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingCategory) {
      setName(existingCategory.name);
      setColor(existingCategory.color);
    } else {
      // Reset for new category
      setName('');
      setColor(PALETTE_COLORS[0]);
    }
    setError('');
  }, [existingCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    
    const nameExists = allCategories.some(
      c => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== existingCategory?.id
    );
    if (nameExists) {
      setError('Ya existe una categoría con este nombre.');
      return;
    }

    const categoryToSave: Category = {
      id: existingCategory?.id || crypto.randomUUID(),
      name: trimmedName,
      color,
      isPredefined: existingCategory?.isPredefined || false,
    };

    onSave(categoryToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-text-primary mb-6">
            {existingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-text-secondary">Nombre</label>
              <input
                type="text"
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={existingCategory?.isPredefined || false}
                placeholder="Ej: Educación"
                className="mt-1 block w-full bg-bkg border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-200"
              />
               {existingCategory?.isPredefined && <p className="text-xs text-text-secondary mt-1">El nombre de las categorías predefinidas no se puede cambiar.</p>}
            </div>
            <div>
                 <label className="block text-sm font-medium text-text-secondary">Color</label>
                 <div className="mt-2 grid grid-cols-9 gap-2">
                     {PALETTE_COLORS.map(colorKey => (
                         <button
                            type="button"
                            key={colorKey}
                            onClick={() => setColor(colorKey)}
                            className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${PALETTE[colorKey].bg}`}
                         >
                            {color === colorKey && (
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                         </button>
                     ))}
                 </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-primary bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-green-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;