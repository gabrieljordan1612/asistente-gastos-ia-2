import React from 'react';
import type { User } from '@supabase/supabase-js';

interface SettingsViewProps {
    user: User | null;
    username: string | null;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, username }) => {
    
    const accountCreationDate = user?.created_at ? 
        new Date(user.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'No disponible';

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-8">Ajustes</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna de Información del Perfil */}
                <div className="lg:col-span-1">
                    <div className="bg-surface border border-border rounded-xl p-6 text-center shadow-sm">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-4xl mx-auto">
                            {username ? username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-text-primary">{username || 'Usuario'}</h2>
                        <p className="text-sm text-text-secondary">{user?.email}</p>
                        <p className="text-xs text-text-secondary mt-2">Miembro desde: {accountCreationDate}</p>
                    </div>
                </div>

                {/* Columna de Ajustes */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tarjeta de Información de la Cuenta */}
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Información de la Cuenta</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Nombre de Usuario</label>
                                <input type="text" value={username || ''} disabled className="mt-1 w-full bg-bkg border border-border rounded-md py-2 px-3 text-text-secondary cursor-not-allowed"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text-secondary">Correo Electrónico</label>
                                <input type="email" value={user?.email || ''} disabled className="mt-1 w-full bg-bkg border border-border rounded-md py-2 px-3 text-text-secondary cursor-not-allowed"/>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Seguridad */}
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Seguridad</h3>
                        <div className="flex justify-between items-center">
                            <p className="text-text-primary">Cambiar tu contraseña</p>
                            <button className="bg-primary/10 text-primary font-semibold text-sm py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors">
                                Cambiar Contraseña
                            </button>
                        </div>
                    </div>
                    
                    {/* Tarjeta de Suscripción */}
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Suscripción</h3>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-text-primary">Tu plan actual es <span className="font-bold text-secondary">Standard</span>.</p>
                                <p className="text-sm text-text-secondary">Gestiona tu facturación y detalles del plan.</p>
                            </div>
                            <button className="bg-secondary/10 text-secondary font-semibold text-sm py-2 px-4 rounded-lg hover:bg-secondary/20 transition-colors">
                                Administrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;