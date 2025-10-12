import React from 'react';

export const PREDEFINED_CATEGORIES = ["Comida", "Transporte", "Salud", "Ropa", "Entretenimiento", "Servicios"];

const IconWrapper: React.FC<{ children: React.ReactNode; size?: 'sm' | 'lg' }> = ({ children, size = 'sm' }) => {
    const sizeClasses = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
    return (
        <div className={`${sizeClasses} flex items-center justify-center rounded-lg bg-border`}>{children}</div>
    );
};

export const FoodIcon: React.FC<{ size?: 'sm' | 'lg' }> = ({ size }) => {
    const iconSizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <IconWrapper size={size}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses} text-text-secondary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
        </IconWrapper>
    );
};

export const TransportIcon: React.FC<{ size?: 'sm' | 'lg' }> = ({ size }) => {
    const iconSizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <IconWrapper size={size}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses} text-text-secondary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        </IconWrapper>
    );
};

export const HealthIcon: React.FC<{ size?: 'sm' | 'lg' }> = ({ size }) => {
    const iconSizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <IconWrapper size={size}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses} text-text-secondary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </IconWrapper>
    );
};

export const ClothesIcon: React.FC<{ size?: 'sm' | 'lg' }> = ({ size }) => {
    const iconSizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <IconWrapper size={size}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses} text-text-secondary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-2 2-2-2z" />
            </svg>
        </IconWrapper>
    );
};

export const EntertainmentIcon: React.FC<{ size?: 'sm' | 'lg' }> = ({ size }) => {
    const iconSizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <IconWrapper size={size}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses} text-text-secondary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </IconWrapper>
    );
};

export const ServicesIcon: React.FC<{ size?: 'sm' | 'lg' }> = ({ size }) => {
    const iconSizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <IconWrapper size={size}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses} text-text-secondary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        </IconWrapper>
    );
};

export const DefaultIcon: React.FC<{ size?: 'sm' | 'lg' }> = ({ size }) => {
    const iconSizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <IconWrapper size={size}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconSizeClasses} text-text-secondary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        </IconWrapper>
    );
};


export const getCategoryIcon = (category: string, size: 'sm' | 'lg' = 'sm') => {
    switch (category.toLowerCase()) {
        case 'comida':
            return <FoodIcon size={size} />;
        case 'transporte':
            return <TransportIcon size={size} />;
        case 'salud':
            return <HealthIcon size={size} />;
        case 'ropa':
            return <ClothesIcon size={size} />;
        case 'entretenimiento':
            return <EntertainmentIcon size={size} />;
        case 'servicios':
            return <ServicesIcon size={size} />;
        default:
            return <DefaultIcon size={size} />;
    }
};