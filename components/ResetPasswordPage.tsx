import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Spinner from './Spinner';

interface ResetPasswordPageProps {
    onPasswordUpdated: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onPasswordUpdated }) => {
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
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError('No se pudo actualizar la contraseña. El enlace puede haber expirado o ser inválido.');
            console.error('Password update error:', error);
        } else {
            onPasswordUpdated();
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bkg flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-lg border border-border">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">FinTrack</h1>
                    <h2 className="mt-2 text-2xl font-bold text-text-primary">Establecer Nueva Contraseña</h2>
                    <p className="mt-2 text-sm text-text-secondary">Ingresa una nueva contraseña para tu cuenta.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="new-password"className="block text-sm font-medium text-text-secondary">Nueva Contraseña</label>
                        <input 
                            id="new-password" 
                            name="new-password" 
                            type="password" 
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-bkg border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="confirm-password"className="block text-sm font-medium text-text-secondary">Confirmar Nueva Contraseña</label>
                        <input 
                            id="confirm-password" 
                            name="confirm-password" 
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-bkg border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? <Spinner /> : 'Actualizar Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;