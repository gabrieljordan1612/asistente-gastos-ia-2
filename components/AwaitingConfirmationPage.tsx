import React from 'react';

interface AwaitingConfirmationPageProps {
    onNavigateToSignIn: () => void;
}

const AwaitingConfirmationPage: React.FC<AwaitingConfirmationPageProps> = ({ onNavigateToSignIn }) => {
    return (
        <div className="min-h-screen bg-bkg flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-lg border border-border text-center">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-text-primary">¡Ya casi está listo!</h1>
                <p className="text-text-secondary">
                    Hemos enviado un correo de confirmación a tu email. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
                <div>
                    <button 
                        onClick={onNavigateToSignIn} 
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Ir a Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AwaitingConfirmationPage;
