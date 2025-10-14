import React, { useState, useMemo } from 'react';
import type { Category, Expense } from '../types';
import { getCategoryIcon } from '../constants';
import AddCategoryModal from './AddCategoryModal';
import ExpenseChart from './ExpenseChart';

// =====================================================================
// START: Inlined CategoryDetailView component
// =====================================================================
interface CategoryDetailViewProps {
  category: Category;
  allExpenses: Expense[];
  onBack: () => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ category, allExpenses, onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const categoryExpenses = useMemo(() => {
    return allExpenses.filter(expense => expense.category === category.name);
  }, [allExpenses, category.name]);
  
  const totalSpentInMonth = useMemo(() => {
    const currentMonthStr = currentDate.toISOString().slice(0, 7);
    return categoryExpenses
      .filter(e => e.date.startsWith(currentMonthStr))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [categoryExpenses, currentDate]);

  const expensesForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return categoryExpenses.filter(e => e.date === selectedDate);
  }, [selectedDate, categoryExpenses]);


  return (
    <div>
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-border transition-colors mr-4" aria-label="Volver a la lista de categorías">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center space-x-4">
            {getCategoryIcon(category.name, category.color, 'lg')}
            <div>
                 <h1 className="text-3xl font-bold text-text-primary">{category.name}</h1>
                 <p className="text-text-secondary">
                    Total gastado este mes: <span className="font-bold text-red-500">S/. {totalSpentInMonth.toFixed(2)}</span>
                 </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-surface p-6 rounded-xl border border-border shadow-sm">
          <ExpenseChart
            expenses={categoryExpenses}
            categories={[category]} 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate} 
            chartMode="byDay"
            barColor={category.color}
          />
        </div>
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border shadow-sm">
          {selectedDate ? (
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Gastos del {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </h3>
                {expensesForSelectedDay.length > 0 ? (
                  <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                    {expensesForSelectedDay.map(expense => (
                      <div key={expense.id} className="flex justify-between items-center bg-bkg p-3 rounded-lg">
                        <p className="text-sm font-medium text-text-primary truncate pr-4">{expense.description || 'Gasto'}</p>
                        <p className="text-sm font-bold text-red-500 whitespace-nowrap">S/. {expense.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-center text-text-secondary">
                    <p>No hay gastos registrados para este día.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <h3 className="font-semibold text-text-primary">Detalle de Gastos</h3>
                <p className="text-sm mt-1">Selecciona un día en el calendario para ver los gastos correspondientes.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
// =====================================================================
// END: Inlined CategoryDetailView component
// =====================================================================


interface CategoryViewProps {
    categories: Category[];
    onSaveCategory: (category: Category) => void;
    onDeleteCategory: (id: string) => void;
    expenses: Expense[];
}

const CategoryView: React.FC<CategoryViewProps> = ({ categories, onSaveCategory, onDeleteCategory, expenses }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleOpenModal = (category: Category | null = null) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCategoryToEdit(null);
        setIsModalOpen(false);
    };

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
    };
    
    const handleBackToList = () => {
        setSelectedCategory(null);
    };

    if (selectedCategory) {
        return (
            <CategoryDetailView 
                category={selectedCategory}
                allExpenses={expenses}
                onBack={handleBackToList}
            />
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Categorías</h1>
                    <p className="text-text-secondary">Organiza, crea y personaliza tus categorías de gastos.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20"
                >
                    + Crear Categoría
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat, index) => (
                    <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat)}
                        role="button"
                        tabIndex={0}
                        className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up cursor-pointer group"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {getCategoryIcon(cat.name, cat.color, 'lg')}
                        <p className="mt-3 font-bold text-text-primary">{cat.name}</p>
                        <div className="mt-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenModal(cat); }}
                                className="text-xs text-text-secondary hover:text-primary p-1 rounded-full bg-bkg hover:bg-border"
                                aria-label={`Editar categoría ${cat.name}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                            </button>
                            {!cat.isPredefined && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }}
                                    className="text-xs text-text-secondary hover:text-red-500 p-1 rounded-full bg-bkg hover:bg-border"
                                    aria-label={`Eliminar categoría ${cat.name}`}
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                 <AddCategoryModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={onSaveCategory}
                    existingCategory={categoryToEdit}
                    allCategories={categories}
                />
            )}
        </div>
    );
};

export default CategoryView;