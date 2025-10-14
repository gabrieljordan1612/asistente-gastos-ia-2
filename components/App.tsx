import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import LeftSidebar from './components/LeftSidebar';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import BudgetView from './components/BudgetView';
import SettingsView from './components/SettingsView';
import AddExpenseModal from './components/AddExpenseModal';
import ConfirmationModal from './components/ConfirmationModal';
import { getExpenses, addExpense, deleteExpense, getBudgets, deleteBudget, getIncome, addIncome, deleteIncome, upsertBudget, updateExpense, updateIncome } from './services/supabaseService';
import type { Expense, Budget, Income, Plan, View, Category } from './types';
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import AwaitingConfirmationPage from './components/AwaitingConfirmationPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import CheckoutPage from './components/CheckoutPage';
import CategoryView from './components/CategoryView';
import ReportsView from './components/ReportsView';
import OffersView from './components/OffersView';
import IncomeView from './components/IncomeView';
import AddIncomeModal from './components/AddIncomeModal';
import BudgetSidebar from './components/BudgetSidebar';
import { PREDEFINED_CATEGORIES } from './constants';
import NotificationToast from './components/NotificationToast';


const defaultCategories: Category[] = [
    { id: '1', name: 'Comida', color: 'orange', isPredefined: true },
    { id: '2', name: 'Transporte', color: 'blue', isPredefined: true },
    { id: '3', name: 'Salud', color: 'red', isPredefined: true },
    { id: '4', name: 'Ropa', color: 'purple', isPredefined: true },
    { id: '5', name: 'Entretenimiento', color: 'yellow', isPredefined: true },
    { id: '6', name: 'Servicios', color: 'teal', isPredefined: true },
];

const getInitialCategories = (): Category[] => {
    try {
        const stored = localStorage.getItem('user-categories');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.every(c => 'id' in c && 'name' in c && 'color' in c)) {
                 return parsed;
            }
        }
    } catch (e) {
        console.error("Failed to parse categories from localStorage", e);
    }
    return defaultCategories;
};
  
type AuthView = 
  | 'landing' 
  | 'signIn' 
  | 'signUp' 
  | 'awaitingConfirmation' 
  | 'resetPassword' 
  | 'checkout';

type Notification = { type: 'success' | 'error'; message: string } | null;


const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [authView, setAuthView] = useState<AuthView>('landing');
    const [notification, setNotification] = useState<Notification>(null);
    
    // App Data State
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [income, setIncome] = useState<Income[]>([]);
    const [categories, setCategories] = useState<Category[]>(getInitialCategories);

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
    const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null);
    const [isBudgetSidebarOpen, setIsBudgetSidebarOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'expense' | 'budget' | 'income' | 'category', id: number | string } | null>(null);
    
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('user-categories', JSON.stringify(categories));
        } catch (e) {
            console.error("Failed to save categories to localStorage", e);
        }
    }, [categories]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 4000); // Auto-dismiss after 4 seconds
            return () => clearTimeout(timer);
        }
    }, [notification]);
    
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setUsername(session?.user?.user_metadata?.username ?? session?.user?.email ?? null);
            
            if (_event === 'PASSWORD_RECOVERY') {
                setAuthView('resetPassword');
            }
            
            setLoading(false);
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setUsername(session?.user?.user_metadata?.username ?? session?.user?.email ?? null);
            setLoading(false);
        });
        
        const handleResize = () => {
          setIsSidebarOpen(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const [expensesData, budgetsData, incomeData] = await Promise.all([
            getExpenses(),
            getBudgets(),
            getIncome(),
        ]);
        setExpenses(expensesData?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []);
        setBudgets(budgetsData || []);
        setIncome(incomeData?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if(session) {
            fetchData();
        }
    }, [session, fetchData]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setExpenses([]);
        setBudgets([]);
        setIncome([]);
        localStorage.removeItem('user-categories');
        setCategories(defaultCategories);
        setCurrentView('dashboard');
        setAuthView('landing');
    };

    const handleSaveCategory = (category: Category) => {
        setCategories(prev => {
            const existingIndex = prev.findIndex(c => c.id === category.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = category;
                return updated;
            } else {
                return [...prev, category];
            }
        });
    };
    
    const requestDeleteCategory = (id: string) => {
        const categoryToDelete = categories.find(c => c.id === id);
        if (categoryToDelete?.isPredefined) {
            setNotification({ type: 'error', message: 'No se pueden eliminar las categorías predefinidas.' });
            return;
        }
        setItemToDelete({ type: 'category', id });
        setIsConfirmationModalOpen(true);
    };

    const handleSaveExpense = async (expenseData: Partial<Omit<Expense, 'user_id' | 'created_at'>>) => {
        if (expenseData.id) { // UPDATE
            const { id, ...updateData } = expenseData;
            const updatedExpense = await updateExpense(id, updateData);
            if (updatedExpense) {
                setExpenses(prev => 
                    prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                );
                setNotification({ type: 'success', message: 'Gasto actualizado satisfactoriamente.' });
            } else {
                setNotification({ type: 'error', message: 'Error al actualizar el gasto.' });
                await fetchData(); // Fallback
            }
        } else { // ADD
            const newExpense = await addExpense(expenseData as Omit<Expense, 'id' | 'user_id' | 'created_at'>);
            if (newExpense) {
               setExpenses(prev => 
                   [...prev, newExpense]
                   .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
               );
               setNotification({ type: 'success', message: 'Gasto agregado correctamente.' });
            } else {
               setNotification({ type: 'error', message: 'Error al agregar el gasto.' });
            }
        }
        handleCloseExpenseModal();
    };

    const requestEditExpense = (expense: Expense) => {
        setExpenseToEdit(expense);
        setIsAddExpenseModalOpen(true);
    };

    const requestDeleteExpense = (id: number) => {
        setItemToDelete({ type: 'expense', id });
        setIsConfirmationModalOpen(true);
    };
    
    const handleCloseExpenseModal = () => {
        setIsAddExpenseModalOpen(false);
        setExpenseToEdit(null);
    };

    const handleSaveIncome = async (incomeData: Partial<Omit<Income, 'user_id' | 'created_at'>>) => {
        if (incomeData.id) { // UPDATE
            const updatedIncome = await updateIncome(incomeData.id, incomeData as Omit<Income, 'id' | 'user_id' | 'created_at'>);
            if (updatedIncome) {
                setIncome(prev => prev.map(i => i.id === updatedIncome.id ? updatedIncome : i).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setNotification({ type: 'success', message: 'Ingreso actualizado correctamente.' });
                await fetchData(); // Refetch budgets in case they are affected
            } else {
                setNotification({ type: 'error', message: 'Error al actualizar el ingreso.' });
            }
        } else { // ADD
            const newIncome = await addIncome(incomeData as Omit<Income, 'id' | 'user_id' | 'created_at'>);
            if (newIncome) {
                setIncome(prev => [...prev, newIncome].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setNotification({ type: 'success', message: 'Ingreso agregado correctamente.' });
                await fetchData(); // Refetch budgets
            } else {
                setNotification({ type: 'error', message: 'Error al agregar el ingreso.' });
            }
        }
        handleCloseIncomeModal();
    };

    const requestEditIncome = (incomeItem: Income) => {
        setIncomeToEdit(incomeItem);
        setIsAddIncomeModalOpen(true);
    };
    
    const handleCloseIncomeModal = () => {
        setIsAddIncomeModalOpen(false);
        setIncomeToEdit(null);
    };

    const requestDeleteIncome = (id: number) => {
        setItemToDelete({ type: 'income', id });
        setIsConfirmationModalOpen(true);
    };

    const requestDeleteBudget = (id: number) => {
        setItemToDelete({ type: 'budget', id });
        setIsConfirmationModalOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        let success = false;
        let successMessage = '';
        let errorMessage = '';

        try {
            if (itemToDelete.type === 'expense') {
                success = await deleteExpense(itemToDelete.id as number);
                if (success) {
                    setExpenses(prev => prev.filter(e => e.id !== itemToDelete.id));
                    successMessage = 'Gasto eliminado correctamente.';
                } else {
                    errorMessage = 'No se pudo eliminar el gasto.';
                }
            } else if (itemToDelete.type === 'income') {
                success = await deleteIncome(itemToDelete.id as number);
                if (success) {
                    setIncome(prev => prev.filter(i => i.id !== itemToDelete.id));
                    successMessage = 'Ingreso eliminado correctamente.';
                    await fetchData(); // Refetch related data like budgets
                } else {
                    errorMessage = 'No se pudo eliminar el ingreso.';
                }
            } else if (itemToDelete.type === 'budget') {
                success = await deleteBudget(itemToDelete.id as number);
                if (success) {
                    setBudgets(prev => prev.filter(b => b.id !== itemToDelete.id));
                    successMessage = 'Presupuesto eliminado correctamente.';
                } else {
                    errorMessage = 'No se pudo eliminar el presupuesto.';
                }
            } else if (itemToDelete.type === 'category') {
                setCategories(prev => prev.filter(c => c.id !== itemToDelete.id));
                success = true; // Local operation
                successMessage = 'Categoría eliminada correctamente.';
            }

            if (success) {
                setNotification({ type: 'success', message: successMessage });
            } else if (errorMessage) {
                setNotification({ type: 'error', message: errorMessage });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Ocurrió un error inesperado.' });
        } finally {
            setIsConfirmationModalOpen(false);
            setItemToDelete(null);
        }
    };

    
    const totalExpensesForMonth = expenses
          .filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7)))
          .reduce((acc, e) => acc + e.amount, 0);
          
    const mainBudgetForMonth = budgets.find(b => b.month === new Date().toISOString().slice(0, 7) && b.category === 'General') || null;

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView expenses={expenses} budgets={budgets} username={username} categories={categories} onAddExpenseClick={() => setIsAddExpenseModalOpen(true)} />;
            case 'history':
                return <HistoryView expenses={expenses} requestDeleteExpense={requestDeleteExpense} requestEditExpense={requestEditExpense} categories={categories} />;
            case 'categories':
                 return <CategoryView 
                    categories={categories} 
                    onSaveCategory={handleSaveCategory} 
                    onDeleteCategory={requestDeleteCategory}
                    expenses={expenses} 
                 />;
            case 'budgets':
                return <BudgetView expenses={expenses} onBudgetsUpdate={fetchData} requestDeleteBudget={requestDeleteBudget} categories={categories} />;
            case 'income':
                return <IncomeView income={income} requestDeleteIncome={requestDeleteIncome} requestEditIncome={requestEditIncome} onAddIncomeClick={() => setIsAddIncomeModalOpen(true)}/>;
            case 'reports':
                return <ReportsView />;
            case 'offers':
                return <OffersView />;
            case 'settings':
                return <SettingsView user={user} username={username} />;
            default:
                return <DashboardView expenses={expenses} budgets={budgets} username={username} categories={categories} onAddExpenseClick={() => setIsAddExpenseModalOpen(true)} />;
        }
    };
    
    const handleNavigateToCheckout = (plan: Plan) => {
        setSelectedPlan(plan);
        setAuthView('checkout');
    };

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
    }
    
    if (!session) {
        // ... (auth views remain unchanged)
        switch (authView) {
            case 'signIn':
                return <SignInPage 
                    onNavigateToSignUp={() => setAuthView('signUp')} 
                    onSignInSuccess={() => {}}
                    onNavigateToLanding={() => setAuthView('landing')}
                    notification={notification}
                 />;
            case 'signUp':
                return <SignUpPage 
                    onNavigateToSignIn={() => setAuthView('signIn')} 
                    onSignUpSuccess={() => setAuthView('awaitingConfirmation')}
                    onNavigateToLanding={() => setAuthView('landing')}
                />;
            case 'awaitingConfirmation':
                return <AwaitingConfirmationPage onNavigateToSignIn={() => setAuthView('signIn')} />;
            case 'resetPassword':
                return <ResetPasswordPage onPasswordUpdated={() => {
                    setNotification({type: 'success', message: 'Contraseña actualizada con éxito. Por favor, inicia sesión.'});
                    setAuthView('signIn');
                }} />;
            case 'checkout':
                if (!selectedPlan) {
                    setAuthView('landing');
                    return null;
                }
                return <CheckoutPage plan={selectedPlan} onNavigateToLanding={() => setAuthView('landing')} />;
            case 'landing':
            default:
                return <LandingPage 
                    onNavigateToSignIn={() => setAuthView('signIn')} 
                    onNavigateToSignUp={() => setAuthView('signUp')}
                    onNavigateToCheckout={handleNavigateToCheckout}
                />;
        }
    }

    return (
        <div className="bg-background min-h-screen flex text-text-primary font-sans">
            {notification && <NotificationToast notification={notification} onClose={() => setNotification(null)} />}
            <LeftSidebar 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                handleSignOut={handleSignOut}
                username={username}
            />
            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div className={`flex flex-col flex-1 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                <header className="md:hidden sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b border-border">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-text-primary capitalize">{currentView === 'offers' ? 'Marketplace' : currentView}</h1>
                    <div className="w-8"></div>
                </header>

                <main className="flex-1 p-4 sm:p-8">
                    {renderView()}
                </main>
            </div>
            
            <BudgetSidebar 
                isOpen={isBudgetSidebarOpen}
                setIsOpen={setIsBudgetSidebarOpen}
                mainBudget={mainBudgetForMonth}
                totalExpenses={totalExpensesForMonth}
                onEditClick={() => setCurrentView('budgets')}
            />

            <AddExpenseModal
                isOpen={isAddExpenseModalOpen}
                onClose={handleCloseExpenseModal}
                onSave={handleSaveExpense}
                categories={categories}
                expenseToEdit={expenseToEdit}
            />
            <AddIncomeModal
                isOpen={isAddIncomeModalOpen}
                onClose={handleCloseIncomeModal}
                onSaveIncome={handleSaveIncome}
                incomeToEdit={incomeToEdit}
            />
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Eliminar ${itemToDelete?.type}`}
                message="¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer."
            />
        </div>
    );
};

export default App;