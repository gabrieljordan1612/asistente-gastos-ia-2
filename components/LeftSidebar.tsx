import React from 'react';
// FIX: Import the View type to be used in component props.
import type { View } from '../types';

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CategoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const BudgetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const IncomeIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ReportsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const MarketplaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LogoutIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isSidebarOpen: boolean;
}> = ({ icon, label, isActive, onClick, isSidebarOpen }) => {
    // On mobile, the sidebar is always "open" (i.e., wide) when it's visible.
    const showText = isSidebarOpen;

    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className={`flex items-center w-full py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                } ${showText ? 'px-4' : 'px-2 justify-center'}`}
            >
                <span className={`${showText ? 'mr-4' : 'mr-0'}`}>{icon}</span>
                <span className={`transition-opacity duration-200 ${showText ? 'opacity-100' : 'opacity-0 absolute'}`}>{label}</span>
            </button>
            {!showText && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-surface text-text-primary text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-border">
                    {label}
                </div>
            )}
        </div>
    );
};


interface LeftSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    // FIX: Use the specific View type and React.Dispatch for props for better type safety.
    currentView: View;
    setCurrentView: React.Dispatch<React.SetStateAction<View>>;
    handleSignOut: () => void;
    username: string | null;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, setIsOpen, currentView, setCurrentView, handleSignOut, username }) => {

    // FIX: Changed type from `JSX.Element` to `React.ReactElement` to resolve "Cannot find namespace 'JSX'" error.
    const navItems: { id: View; label: string; icon: React.ReactElement }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'history', label: 'Historial', icon: <HistoryIcon /> },
        { id: 'categories', label: 'Categorías', icon: <CategoryIcon /> },
        { id: 'budgets', label: 'Presupuestos', icon: <BudgetIcon /> },
        { id: 'income', label: 'Ingresos', icon: <IncomeIcon /> },
        { id: 'reports', label: 'Reportes', icon: <ReportsIcon /> },
        { id: 'offers', label: 'Marketplace', icon: <MarketplaceIcon /> },
    ];
    
    const handleNavigation = (view: View) => {
        setCurrentView(view);
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };


    return (
        <aside className={`bg-surface h-screen flex flex-col p-4 fixed z-40 transition-all duration-300 ease-in-out w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isOpen ? 'md:w-64' : 'md:w-20'}`}>
            <div className={`flex items-center mb-8 transition-all duration-300 ${isOpen ? 'px-2' : 'px-0 justify-center'}`}>
                 <span className={`font-bold text-text-primary text-2xl transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Fin<span className="text-primary">Track</span></span>
                 <span className={`font-bold text-primary text-3xl transition-opacity duration-200 ${!isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>F</span>
            </div>

            <nav className="flex-grow space-y-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.id}
                        onClick={() => handleNavigation(item.id)}
                        isSidebarOpen={isOpen}
                    />
                ))}
            </nav>

            <div className="mt-auto">
                 <div className="border-t border-border pt-4 space-y-2">
                    <NavItem
                        icon={<SettingsIcon />}
                        label="Ajustes"
                        isActive={currentView === 'settings'}
                        onClick={() => handleNavigation('settings')}
                        isSidebarOpen={isOpen}
                    />
                    <NavItem
                        icon={<LogoutIcon />}
                        label="Cerrar Sesión"
                        isActive={false}
                        onClick={handleSignOut}
                        isSidebarOpen={isOpen}
                    />
                </div>
                <div className={`flex items-center mt-6 p-2 transition-all duration-300 ${!isOpen ? 'justify-center': ''}`}>
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary flex-shrink-0">
                        {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        <p className="font-semibold text-text-primary text-sm truncate">{username || 'Usuario'}</p>
                    </div>
                </div>
                 <button onClick={() => setIsOpen(!isOpen)} className="w-full mt-4 text-text-secondary hover:text-text-primary hidden md:flex items-center justify-center py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 </button>
            </div>
        </aside>
    );
};

export default LeftSidebar;