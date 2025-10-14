import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Spinner from './Spinner';

type Notification = { type: 'success' | 'error'; message: string } | null;

interface SignInPageProps {
    onNavigateToSignUp: () => void;
    onSignInSuccess: () => void;
    onNavigateToLanding: () => void;
    notification: Notification;
}

const SignInPage: React.FC<SignInPageProps> = ({ onNavigateToSignUp, onNavigateToLanding, notification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        }
        setLoading(false);
    };
    
    const handlePasswordReset = async () => {
        if (!email) {
            setError('Por favor, ingresa tu correo electrónico para restablecer la contraseña.');
            return;
        }
        setError(null);
        setMessage(null);
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
             redirectTo: window.location.origin,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-sky-50 to-blue-100 items-center justify-center p-12 text-text-primary flex-col relative overflow-hidden border-r border-border">
                <div className="absolute -top-16 -left-16 w-72 h-72 bg-sky-100/50 rounded-full"></div>
                <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-sky-100/50 rounded-full"></div>
                
                <div className="z-10 text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-slate-900">Fin<span className="text-primary">Track</span></h1>
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
                         <h2 className="text-3xl font-bold text-text-primary">Iniciar sesión</h2>
                         <p className="text-text-secondary mt-2">Bienvenido de vuelta. ¡Vamos a organizar tus finanzas!</p>
                    </div>

                    {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
                    {message && <p className="bg-green-100 text-green-700 text-sm text-center p-3 rounded-lg mb-4">{message}</p>}
                    {notification && <p className={`text-sm text-center p-3 rounded-lg mb-4 ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{notification.message}</p>}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-text-secondary mb-1">Email</label>
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
                            <label htmlFor="password"className="block text-sm font-bold text-text-secondary mb-1">Contraseña</label>
                            <div className="relative">
                                <input 
                                    id="password" 
                                    name="password" 
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="Escribe tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    className="mt-1 block w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary hover:text-primary"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" /><path d="M10 17a9.953 9.953 0 01-4.522-.992l.938-1.014A8.02 8.02 0 0110 15a8.02 8.02 0 015.422-2.112l.938 1.014A9.953 9.953 0 0110 17z" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <label htmlFor="remember-me" className="font-medium text-text-secondary">Recordarme</label>
                            </div>
                            <button type="button" onClick={handlePasswordReset} className="font-bold text-primary hover:text-primary-dark">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        
                        <div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-70 transition-all duration-300"
                            >
                                {loading ? <Spinner /> : 'Acceder'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-8 text-center text-sm text-text-secondary">
                        ¿No tienes una cuenta?{' '}
                        <button onClick={onNavigateToSignUp} className="font-bold text-primary hover:text-primary-dark">
                            Regístrate
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;