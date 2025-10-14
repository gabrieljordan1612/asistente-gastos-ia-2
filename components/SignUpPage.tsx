import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Spinner from './Spinner';

interface SignUpPageProps {
    onNavigateToSignIn: () => void;
    onSignUpSuccess: () => void;
    onNavigateToLanding: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToSignIn, onSignUpSuccess, onNavigateToLanding }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (data.user) {
            if (data.user.identities && data.user.identities.length === 0) {
                 setError("Este correo electrónico ya está en uso, pero no ha sido confirmado.");
                 setLoading(false);
            } else {
                 onSignUpSuccess();
            }
        } else {
             setError("Ocurrió un error inesperado durante el registro.");
             setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 text-text-primary flex-col relative overflow-hidden border-r border-border">
                <div className="absolute -top-16 -left-16 w-72 h-72 bg-primary/10 rounded-full"></div>
                <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-primary/10 rounded-full"></div>
                
                <div className="z-10 text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900">FinTrack</h1>
                    <p className="mt-4 text-xl text-text-secondary">Toma el control de tus finanzas con la claridad de la IA.</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8 relative">
                <div className="absolute top-8 left-8">
                    <button onClick={onNavigateToLanding} className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Volver al inicio
                    </button>
                </div>
                
                <div className="w-full max-w-sm">
                    <div className="text-center lg:text-left mb-10">
                         <h2 className="text-3xl font-bold text-text-primary">Crea tu cuenta</h2>
                         <p className="text-text-secondary mt-2">Empieza a tomar el control de tus finanzas hoy mismo.</p>
                    </div>

                    {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-text-secondary mb-1">Correo electrónico</label>
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                autoComplete="email"
                                placeholder="Escribe tu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className="mt-1 block w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                         <div>
                            <label htmlFor="username" className="block text-sm font-bold text-text-secondary mb-1">Nombre de usuario</label>
                            <input 
                                id="username" 
                                name="username" 
                                type="text" 
                                autoComplete="username"
                                placeholder="Cómo te llamaremos"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                                className="mt-1 block w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-bold text-text-secondary mb-1">Contraseña</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                autoComplete="new-password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className="mt-1 block w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                         <div>
                            <label htmlFor="confirm-password"className="block text-sm font-bold text-text-secondary mb-1">Confirmar contraseña</label>
                            <input 
                                id="confirm-password" 
                                name="confirm-password" 
                                type="password"
                                autoComplete="new-password"
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-secondary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all duration-300"
                            >
                                {loading ? <Spinner /> : 'Crear Cuenta'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-8 text-center text-sm text-text-secondary">
                        ¿Ya tienes una cuenta?{' '}
                        <button onClick={onNavigateToSignIn} className="font-bold text-primary hover:text-amber-600">
                            Inicia Sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;