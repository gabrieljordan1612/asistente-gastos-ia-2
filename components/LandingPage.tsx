import React, { useState, useEffect } from 'react';
import TestimonialsSection from './TestimonialsSection';
import type { Plan } from '../types';

interface LandingPageProps {
    onNavigateToSignIn: () => void;
    onNavigateToSignUp: () => void;
    onNavigateToCheckout: (plan: Plan) => void;
}

const AnimatedComponent = ({ children, delay = 0, className = '' }: React.PropsWithChildren<{ delay?: number; className?: string }>) => (
    <div className={`opacity-0 animate-fade-in-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
        {children}
    </div>
);

const LandingHeader: React.FC<Pick<LandingPageProps, 'onNavigateToSignIn' | 'onNavigateToSignUp'>> = ({ onNavigateToSignIn, onNavigateToSignUp }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href')?.substring(1);
        if (targetId) {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-surface/80 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-2xl font-bold text-text-primary">Fin<span className="text-primary">Track</span></a>
                    </div>
                    <nav className="hidden md:flex md:space-x-8">
                        <a href="#features" onClick={handleNavClick} className="font-medium text-text-secondary hover:text-text-primary transition-colors">Características</a>
                        <a href="#precios" onClick={handleNavClick} className="font-medium text-text-secondary hover:text-text-primary transition-colors">Precios</a>
                        <a href="#testimonials" onClick={handleNavClick} className="font-medium text-text-secondary hover:text-text-primary transition-colors">Testimonios</a>
                    </nav>
                    <div className="flex items-center space-x-2">
                        <button onClick={onNavigateToSignIn} className="font-bold text-text-secondary hover:text-text-primary transition-colors px-4 py-2">
                            Iniciar Sesión
                        </button>
                        <button onClick={onNavigateToSignUp} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20">
                            Registrarse
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const HeroSection: React.FC<{ onNavigateToSignUp: () => void; }> = ({ onNavigateToSignUp }) => (
    <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-background -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedComponent delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-text-primary tracking-tighter leading-tight">
                    Tus finanzas, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-400">claras y automáticas.</span>
                </h1>
            </AnimatedComponent>
            <AnimatedComponent delay={300}>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">
                    Sube tus comprobantes, nosotros hacemos el resto. FinTrack es la forma más inteligente de entender y controlar tus gastos sin esfuerzo.
                </p>
            </AnimatedComponent>
            <AnimatedComponent delay={500}>
                <div className="mt-8">
                    <button onClick={onNavigateToSignUp} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-transform duration-300 hover:scale-105 text-lg shadow-xl shadow-primary/20">
                        Empieza Gratis
                    </button>
                </div>
            </AnimatedComponent>
        </div>
        <AnimatedComponent delay={700} className="mt-16">
            <div className="relative w-full max-w-4xl mx-auto p-4">
                 <div className="relative bg-surface rounded-xl shadow-medium border border-border p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                       <div className="flex items-center space-x-1.5">
                           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                           <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                       </div>
                       <div className="bg-background rounded-md text-xs px-4 py-1 text-text-secondary">fintrack/dashboard</div>
                    </div>
                    <div className="mt-4">
                         <div className="flex space-x-4">
                             <div className="w-2/3">
                                 <div className="font-bold text-text-primary">Análisis Gráfico</div>
                                 <div className="mt-2 h-40 bg-background rounded-lg flex items-end p-2 space-x-2">
                                     <div className="w-full h-1/3 bg-primary/20 rounded-t-sm animate-pulse" style={{animationDelay: '0.1s'}}></div>
                                     <div className="w-full h-1/2 bg-primary/40 rounded-t-sm animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                     <div className="w-full h-3/4 bg-primary rounded-t-sm animate-pulse shadow-lg shadow-primary/40" style={{animationDelay: '0.3s'}}></div>
                                     <div className="w-full h-1/2 bg-primary/40 rounded-t-sm animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                     <div className="w-full h-2/3 bg-primary/20 rounded-t-sm animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                 </div>
                             </div>
                             <div className="w-1/3">
                                <div className="font-bold text-text-primary">Gastos Recientes</div>
                                <div className="mt-2 space-y-2">
                                    <div className="h-10 bg-background rounded-lg animate-pulse" style={{animationDelay: '0.6s'}}></div>
                                    <div className="h-10 bg-background rounded-lg animate-pulse" style={{animationDelay: '0.7s'}}></div>
                                    <div className="h-10 bg-background rounded-lg animate-pulse" style={{animationDelay: '0.8s'}}></div>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </AnimatedComponent>
    </section>
);


const features = [
    {
        tag: 'Magia Pura',
        title: 'Análisis con IA',
        description: 'Olvídate de la entrada manual. Sube una foto de tu boleta o una captura de un pago, y nuestra IA extraerá el monto, la fecha y la descripción por ti en segundos. Es como tener un asistente financiero personal.',
        visual: (
            <div className="bg-background rounded-xl p-4 border border-border w-full h-full flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="w-40 h-60 bg-surface rounded-lg overflow-hidden shadow-md flex-shrink-0 border border-border">
                         <div className="p-2 bg-surface h-full">
                            <div className="h-4 bg-background rounded w-3/4"></div>
                            <div className="mt-4 space-y-1">
                                <div className="h-2 bg-background rounded w-full"></div>
                                <div className="h-2 bg-background rounded w-5/6"></div>
                                <div className="h-2 bg-background rounded w-full"></div>
                            </div>
                            <div className="mt-4 h-3 bg-background rounded w-1/2"></div>
                             <div className="mt-6 border-t border-dashed border-border pt-4 space-y-2">
                                <div className="h-2 bg-background rounded w-full"></div>
                                <div className="h-2 bg-background rounded w-2/3"></div>
                             </div>
                              <div className="mt-4 font-black text-text-primary text-lg text-right">S/. 25.50</div>
                         </div>
                    </div>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <div className="w-48 bg-surface p-3 rounded-lg shadow-md flex-shrink-0 space-y-3 border border-border">
                        <div>
                            <label className="text-xs text-text-secondary">Monto</label>
                            <div className="w-full bg-background rounded p-2 text-sm text-text-primary font-semibold animate-pulse">S/. 25.50</div>
                        </div>
                         <div>
                            <label className="text-xs text-text-secondary">Fecha</label>
                            <div className="w-full bg-background rounded p-2 text-sm text-text-primary animate-pulse">2024-08-15</div>
                        </div>
                         <div>
                            <label className="text-xs text-text-secondary">Descripción</label>
                            <div className="w-full bg-background rounded p-2 text-sm text-text-primary animate-pulse">Café del día</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        tag: 'Organización',
        title: 'Categorización Inteligente',
        description: 'Clasificamos tus gastos en categorías claras y personalizables para que sepas exactamente a dónde va tu dinero. Identifica patrones, descubre oportunidades de ahorro y toma decisiones financieras más inteligentes.',
        visual: (
             <div className="bg-surface rounded-xl p-6 border border-border w-full h-full flex items-center justify-center">
                <div className="w-full max-w-sm space-y-3">
                    <div className="flex items-center bg-background p-3 rounded-lg animate-pulse border border-border" style={{animationDelay: '100ms'}}>
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 mr-3"></div>
                        <div className="flex-grow h-4 bg-border rounded"></div>
                        <div className="w-16 h-4 bg-border rounded ml-4"></div>
                    </div>
                    <div className="flex items-center bg-background p-3 rounded-lg animate-pulse border border-border" style={{animationDelay: '200ms'}}>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 mr-3"></div>
                        <div className="flex-grow h-4 bg-border rounded"></div>
                        <div className="w-12 h-4 bg-border rounded ml-4"></div>
                    </div>
                    <div className="flex items-center bg-background p-3 rounded-lg animate-pulse border border-border" style={{animationDelay: '300ms'}}>
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 mr-3"></div>
                        <div className="flex-grow h-4 bg-border rounded"></div>
                        <div className="w-20 h-4 bg-border rounded ml-4"></div>
                    </div>
                     <div className="flex items-center bg-background p-3 rounded-lg animate-pulse border border-border" style={{animationDelay: '400ms'}}>
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 mr-3"></div>
                        <div className="flex-grow h-4 bg-border rounded"></div>
                        <div className="w-14 h-4 bg-border rounded ml-4"></div>
                    </div>
                </div>
            </div>
        )
    },
    {
        tag: 'Claridad',
        title: 'Visualización de Datos',
        description: 'Los números cobran vida. Con gráficos interactivos y reportes sencillos, puedes entender tus finanzas de un solo vistazo. Filtra por fecha, categoría o comercio para obtener la información que necesitas, cuando la necesitas.',
        visual: (
             <div className="bg-surface rounded-xl p-6 border border-border w-full h-full">
                <div className="font-bold text-lg text-text-primary">Gastos Mensuales</div>
                <div className="mt-4 h-56 w-full flex items-end justify-around space-x-2">
                    <div className="h-full w-full bg-background rounded-t-lg animate-pulse relative" style={{animationDelay: '100ms'}}><div className="absolute bottom-0 h-full w-full bg-primary rounded-t-lg" style={{height: '50%'}}></div></div>
                    <div className="h-full w-full bg-background rounded-t-lg animate-pulse relative" style={{animationDelay: '200ms'}}><div className="absolute bottom-0 h-full w-full bg-primary rounded-t-lg" style={{height: '75%'}}></div></div>
                    <div className="h-full w-full bg-background rounded-t-lg animate-pulse relative" style={{animationDelay: '300ms'}}><div className="absolute bottom-0 h-full w-full bg-primary rounded-t-lg shadow-lg shadow-primary/50" style={{height: '90%'}}></div></div>
                    <div className="h-full w-full bg-background rounded-t-lg animate-pulse relative" style={{animationDelay: '400ms'}}><div className="absolute bottom-0 h-full w-full bg-primary rounded-t-lg" style={{height: '60%'}}></div></div>
                    <div className="h-full w-full bg-background rounded-t-lg animate-pulse relative" style={{animationDelay: '500ms'}}><div className="absolute bottom-0 h-full w-full bg-primary rounded-t-lg" style={{height: '80%'}}></div></div>
                    <div className="h-full w-full bg-background rounded-t-lg animate-pulse relative" style={{animationDelay: '600ms'}}><div className="absolute bottom-0 h-full w-full bg-primary rounded-t-lg" style={{height: '40%'}}></div></div>
                </div>
             </div>
        )
    }
]

const FeatureSection: React.FC = () => (
    <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedComponent className="max-w-3xl mx-auto text-center">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">CARACTERÍSTICAS PRINCIPALES</h2>
                <p className="mt-4 text-3xl sm:text-4xl font-bold text-text-primary">Todo lo que necesitas, y más.</p>
                <p className="mt-4 text-lg text-text-secondary">
                   FinTrack está diseñado para ser potente pero fácil de usar. Estas son algunas de las características que te encantarán.
                </p>
            </AnimatedComponent>
            
            <div className="mt-20 space-y-24">
                {features.map((feature, index) => (
                    <AnimatedComponent key={feature.title} delay={200 * (index + 1)}>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                           <div className={index % 2 !== 0 ? 'md:order-last' : ''}>
                                <div className="p-3 bg-primary/10 text-primary inline-block rounded-full text-sm font-bold mb-3">{feature.tag}</div>
                                <h3 className="text-3xl font-bold text-text-primary">{feature.title}</h3>
                                <p className="mt-4 text-lg text-text-secondary leading-relaxed">{feature.description}</p>
                           </div>
                           <div className="h-80 transform transition-transform duration-500 hover:scale-105">
                             {feature.visual}
                           </div>
                        </div>
                    </AnimatedComponent>
                ))}
            </div>
        </div>
    </section>
);


const pricingPlans = [
    {
        name: 'Básico',
        price: '4.99',
        renewalText: 'Se renueva a S/. 4.99/mes. Cancela cuando quieras.',
        features: [
            '20 análisis con IA al mes',
            'Categorización automática',
            'Historial de gastos completo',
            'Soporte estándar por correo',
        ],
        recommended: false,
    },
    {
        name: 'Standard',
        price: '9.99',
        renewalText: 'Se renueva a S/. 9.99/mes. Cancela cuando quieras.',
        features: [
            'Análisis con IA ilimitados',
            'Creación de presupuestos',
            'Reportes mensuales detallados',
            'Soporte prioritario por chat',
        ],
        recommended: true,
    },
    {
        name: 'Pro',
        price: '14.99',
        renewalText: 'Se renueva a S/. 14.99/mes. Cancela cuando quieras.',
        features: [
            'Todo lo del plan Standard',
            'Metas de ahorro personalizadas',
            'Exportación de datos a CSV/Excel',
            'Asesoría financiera básica',
        ],
        recommended: false,
    },
];

const allPlansFeatures = [
    'Registro manual de gastos ilimitado',
    'Seguridad de nivel bancario',
    'Acceso desde web y móvil',
    'Sincronización en la nube',
    'Interfaz intuitiva y sin anuncios',
    'Actualizaciones constantes de la app',
];


const PricingSection: React.FC<{ onNavigateToCheckout: (plan: Plan) => void; }> = ({ onNavigateToCheckout }) => (
    <section id="precios" className="bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedComponent className="text-center mb-12">
                <div className="inline-flex items-center justify-center space-x-2 mb-4">
                    <span className="font-semibold text-text-primary">Excelente</span>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                        ))}
                    </div>
                     <span className="text-text-secondary">Basado en 4.2k+ opiniones</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">Elige el plan perfecto para tus finanzas</h2>
                <p className="mt-2 text-lg text-text-secondary">Comienza gratis y mejora tu plan a medida que creces.</p>
            </AnimatedComponent>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pricingPlans.map((plan, index) => (
                   <AnimatedComponent key={plan.name} delay={200 * (index + 1)}>
                     <div className={`relative bg-surface rounded-2xl p-8 flex flex-col h-full border-2 transition-transform duration-300 hover:-translate-y-2 ${plan.recommended ? 'border-primary shadow-medium' : 'border-border'}`}>
                        {plan.recommended && (
                            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full px-4 py-1">
                                    Más Vendido
                                </span>
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                        <p className="mt-2 text-4xl font-extrabold text-text-primary">
                            S/. {plan.price}
                            <span className="text-base font-normal text-text-secondary">/mes</span>
                        </p>

                        <button 
                            onClick={() => onNavigateToCheckout({ name: plan.name, price: plan.price })}
                            className={`mt-8 py-3 rounded-lg font-bold text-lg transition-colors ${plan.recommended ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-slate-100 text-text-primary hover:bg-slate-200'}`}>
                            Elegir plan
                        </button>
                        <p className="text-xs text-text-secondary mt-2 text-center">{plan.renewalText}</p>

                        <hr className="border-border my-8" />
                        
                        <ul className="space-y-4 text-text-secondary flex-grow">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <svg className="h-5 w-5 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span className="text-text-primary">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                   </AnimatedComponent>
                ))}
            </div>
            
            <AnimatedComponent className="mt-20 max-w-4xl mx-auto">
                <h3 className="text-center text-2xl font-bold mb-8 text-text-primary">Cada plan tiene todo lo que necesitas y más</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-text-secondary">
                    {allPlansFeatures.map((feature, i) => (
                        <div key={i} className="flex items-center">
                           <svg className="h-5 w-5 text-primary mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <span className="text-text-primary">{feature}</span>
                        </div>
                    ))}
                </div>
            </AnimatedComponent>
        </div>
    </section>
);


const CTASection: React.FC<{ onNavigateToSignUp: () => void; }> = ({ onNavigateToSignUp }) => (
    <section id="cta" className="py-20 bg-background border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedComponent>
                <h2 className="text-3xl font-bold text-text-primary">¿Listo para tomar el control?</h2>
                <p className="mt-2 text-lg text-text-secondary">Únete a miles de usuarios que ya están organizando sus finanzas con FinTrack.</p>
                <div className="mt-8">
                     <button onClick={onNavigateToSignUp} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-transform duration-300 hover:scale-105 text-lg shadow-xl shadow-primary/20">
                        Empieza Gratis Ahora
                    </button>
                </div>
            </AnimatedComponent>
        </div>
    </section>
);


const Footer: React.FC = () => (
    <footer className="bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
                <p className="text-text-secondary">&copy; {new Date().getFullYear()} FinTrack. Todos los derechos reservados.</p>
                 <div className="text-2xl font-bold text-text-primary">Fin<span className="text-primary">Track</span></div>
            </div>
        </div>
    </footer>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSignIn, onNavigateToSignUp, onNavigateToCheckout }) => {
    return (
        <div className="bg-background font-sans">
            <LandingHeader onNavigateToSignIn={onNavigateToSignIn} onNavigateToSignUp={onNavigateToSignUp} />
            <main>
                <HeroSection onNavigateToSignUp={onNavigateToSignUp} />
                <FeatureSection />
                <PricingSection onNavigateToCheckout={onNavigateToCheckout} />
                <TestimonialsSection />
                <CTASection onNavigateToSignUp={onNavigateToSignUp} />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;