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
// FIX: Import the View type from the central types file.
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
            // Basic validation
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
    
    // For checkout page
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    // Persist categories to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('user-categories', JSON.stringify(categories));
        } catch (e) {
            console.error("Failed to save categories to localStorage", e);
        }
    }, [categories]);
    
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

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setUsername(session?.user?.user_metadata?.username ?? session?.user?.email ?? null);
            setLoading(false);
        });
        
        const handleResize = () => {
          if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
          } else {
            setIsSidebarOpen(true);
          }
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
        setCurrentView('dashboard');
        setAuthView('landing');
    };

    // --- Category Handlers ---
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
            alert("No se pueden eliminar las categorías predefinidas.");
            return;
        }
        setItemToDelete({ type: 'category', id });
        setIsConfirmationModalOpen(true);
    };


    // --- Expense Handlers ---
    const handleSaveExpense = async (expenseData: Partial<Omit<Expense, 'user_id' | 'created_at'>>) => {
        if (expenseData.id) { // UPDATE
            const { id, ...updateData } = expenseData;
            const success = await updateExpense(id, updateData);
            if (success) {
                await fetchData();
            } else {
                console.error("Failed to update expense on the server.");
            }
        } else { // ADD
            const newExpense = await addExpense(expenseData as Omit<Expense, 'id' | 'user_id' | 'created_at'>);
            if (newExpense) {
               await fetchData();
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

    // --- Income Handlers ---
    const handleSaveIncome = async (incomeData: Partial<Omit<Income, 'user_id' | 'created_at'>>) => {
        if (incomeData.id) { // UPDATE
            const originalIncome = income.find(i => i.id === incomeData.id);
            if (!originalIncome) {
                console.error("Original income not found for update.");
                handleCloseIncomeModal();
                return;
            }
            
            const amountDifference = (incomeData.amount || 0) - originalIncome.amount;

            const { id, ...updateData } = incomeData;
            const success = await updateIncome(id, updateData as Omit<Income, 'id' | 'user_id' | 'created_at'>);
            
            if (success) {
                if (amountDifference !== 0) {
                    const incomeMonth = incomeData.date!.slice(0, 7);
                    const mainBudgetForMonth = budgets.find(b => b.month === incomeMonth && b.category === 'General');
                    if (mainBudgetForMonth) {
                        const newAmount = mainBudgetForMonth.amount + amountDifference;
                        await upsertBudget({ month: incomeMonth, category: 'General', amount: newAmount });
                    }
                }
                await fetchData();
            } else {
                console.error("Failed to update income.");
            }
        } else { // ADD
            const newIncome = await addIncome(incomeData as Omit<Income, 'id' | 'user_id' | 'created_at'>);
            if (newIncome) {
                const incomeMonth = newIncome.date.slice(0, 7);
                const mainBudgetForMonth = budgets.find(b => b.month === incomeMonth && b.category === 'General');

                if (mainBudgetForMonth) {
                    const newAmount = mainBudgetForMonth.amount + newIncome.amount;
                    await upsertBudget({ month: incomeMonth, category: 'General', amount: newAmount });
                }
                await fetchData();
            } else {
                console.error("Failed to add income.");
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

    // --- Budget Handlers ---
    const requestDeleteBudget = (id: number) => {
        setItemToDelete({ type: 'budget', id });
        setIsConfirmationModalOpen(true);
    };
    
    // --- Confirmation Modal Handler ---
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'expense') {
            const success = await deleteExpense(itemToDelete.id as number);
            if (success) await fetchData();
        } else if (itemToDelete.type === 'budget') {
            const success = await deleteBudget(itemToDelete.id as number);
            if (success) await fetchData();
        } else if (itemToDelete.type === 'category') {
            setCategories(prev => prev.filter(c => c.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'income') {
            const incomeToDelete = income.find(i => i.id === itemToDelete.id);
            if (!incomeToDelete) {
                console.error("Could not find income to delete in local state.");
                setIsConfirmationModalOpen(false);
                setItemToDelete(null);
                return;
            }
            
            const success = await deleteIncome(itemToDelete.id as number);

            if (success) {
                const incomeMonth = incomeToDelete.date.slice(0, 7);
                const mainBudgetForMonth = budgets.find(b => b.month === incomeMonth && b.category === 'General');

                if (mainBudgetForMonth) {
                    const newAmount = mainBudgetForMonth.amount - incomeToDelete.amount;
                    await upsertBudget({ month: incomeMonth, category: 'General', amount: newAmount });
                }
                await fetchData();
            }
        }

        setIsConfirmationModalOpen(false);
        setItemToDelete(null);
    };

    
    const totalExpensesForMonth = budgets.length > 0 ? expenses
          .filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7)))
          .reduce((acc, e) => acc + e.amount, 0) : 0;
          
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
            <LeftSidebar 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                handleSignOut={handleSignOut}
                username={username}
            />
            
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div className={`flex flex-col flex-1 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                 {/* Mobile Header */}
                <header className="md:hidden sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b border-border">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-text-primary capitalize">{currentView === 'offers' ? 'Marketplace' : currentView}</h1>
                    <div className="w-8"></div> {/* Placeholder for alignment */}
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