import React, { useState } from 'react';
import type { Plan } from '../types';
import Spinner from './Spinner';

interface CheckoutPageProps {
    plan: Plan;
    onNavigateToLanding: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ plan, onNavigateToLanding }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulación de procesamiento de pago
        setTimeout(() => {
            setLoading(false);
            alert(`¡Pago exitoso para el plan ${plan.name}! Gracias por tu compra. (Simulación)`);
            onNavigateToLanding();
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-bkg flex flex-col items-center justify-center font-sans p-4">
            <div className="w-full max-w-4xl mx-auto">
                <button onClick={onNavigateToLanding} className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                </button>
                
                <h1 className="text-3xl font-bold text-text-primary text-center mb-8">Completa tu compra</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Columna de Formulario de Pago */}
                    <div className="bg-surface p-8 rounded-xl shadow-lg border border-border">
                        <h2 className="text-xl font-semibold mb-6 text-text-primary">Método de Pago</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="card-number" className="block text-sm font-medium text-text-secondary">Número de Tarjeta</label>
                                <input type="text" id="card-number" placeholder="0000 0000 0000 0000" required className="mt-1 block w-full px-3 py-2 bg-bkg border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label htmlFor="card-holder" className="block text-sm font-medium text-text-secondary">Nombre en la Tarjeta</label>
                                <input type="text" id="card-holder" placeholder="Juan Pérez" required className="mt-1 block w-full px-3 py-2 bg-bkg border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label htmlFor="expiry-date" className="block text-sm font-medium text-text-secondary">Fecha de Vencimiento</label>
                                    <input type="text" id="expiry-date" placeholder="MM/AA" required className="mt-1 block w-full px-3 py-2 bg-bkg border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="cvc" className="block text-sm font-medium text-text-secondary">CVC</label>
                                    <input type="text" id="cvc" placeholder="123" required className="mt-1 block w-full px-3 py-2 bg-bkg border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                             <div className="pt-4">
                                 <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {loading ? <Spinner /> : `Pagar S/. ${plan.price}`}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Columna de Resumen del Pedido */}
                    <div className="bg-surface p-8 rounded-xl shadow-lg border border-border h-fit">
                        <h2 className="text-xl font-semibold mb-6 text-text-primary">Resumen del Pedido</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Plan {plan.name}</span>
                                <span className="font-semibold text-text-primary">S/. {plan.price}</span>
                            </div>
                             <div className="flex justify-between items-center text-text-secondary">
                                <span>Impuestos (IGV)</span>
                                <span>Calculado al pagar</span>
                            </div>
                            <hr className="border-border" />
                            <div className="flex justify-between items-center font-bold text-lg text-text-primary">
                                <span>Total</span>
                                <span>S/. {plan.price}</span>
                            </div>
                        </div>
                         <div className="mt-6 text-xs text-text-secondary">
                            <p>Al hacer clic en "Pagar", aceptas nuestros <a href="#" className="text-primary hover:underline">Términos de Servicio</a>. Esta es una suscripción recurrente que puedes cancelar en cualquier momento.</p>
                        </div>
                    </div>
                </div>
                 <div className="text-center mt-8 text-xs text-text-secondary flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>Transacción segura y encriptada.</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
