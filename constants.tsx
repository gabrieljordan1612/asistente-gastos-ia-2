import React from 'react';

export const PALETTE: { [key: string]: { bg: string, primary: string, secondary: string } } = {
    orange: { bg: 'bg-orange-100', primary: 'text-orange-600', secondary: 'text-orange-400' },
    blue: { bg: 'bg-blue-100', primary: 'text-blue-600', secondary: 'text-blue-400' },
    red: { bg: 'bg-red-100', primary: 'text-red-600', secondary: 'text-red-400' },
    purple: { bg: 'bg-purple-100', primary: 'text-purple-600', secondary: 'text-purple-400' },
    yellow: { bg: 'bg-yellow-100', primary: 'text-yellow-600', secondary: 'text-yellow-400' },
    teal: { bg: 'bg-teal-100', primary: 'text-teal-600', secondary: 'text-teal-400' },
    pink: { bg: 'bg-pink-100', primary: 'text-pink-600', secondary: 'text-pink-400' },
    green: { bg: 'bg-green-100', primary: 'text-green-600', secondary: 'text-green-400' },
    gray: { bg: 'bg-gray-200', primary: 'text-gray-600', secondary: 'text-gray-400' }
};

export const PREDEFINED_CATEGORIES = ["Comida", "Transporte", "Salud", "Ropa", "Entretenimiento", "Servicios"];
export const PALETTE_COLORS = Object.keys(PALETTE);


const IconWrapper: React.FC<{ children: React.ReactNode; size?: 'sm' | 'lg', className?: string }> = ({ children, size = 'sm', className = '' }) => {
    const sizeClasses = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
    return (
        <div className={`${sizeClasses} flex items-center justify-center rounded-lg ${className}`}>{children}</div>
    );
};

const FoodIcon: React.FC<{ size?: 'sm' | 'lg'; color?: string }> = ({ size, color = 'orange' }) => {
    const iconSizeClasses = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const colors = PALETTE[color] || PALETTE.gray;
    return (
        <IconWrapper size={size} className={colors.bg}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 24 24" fill="currentColor">
                <path className={colors.secondary} d="M19.973 10.333H4.027a.667.667 0 000 1.334h15.946a.667.667 0 000-1.334z" />
                <path className={colors.primary} d="M18.667 6.333H5.333a1.333 1.333 0 00-1.333 1.334v.666a1.333 1.333 0 001.333 1.334h13.334a1.333 1.333 0 001.333-1.334V7.667a1.333 1.333 0 00-1.333-1.334zm1.333 6.667H4a.667.667 0 000 1.333h16a.667.667 0 000-1.333zM18.667 15H5.333a1.333 1.333 0 00-1.333 1.333v.667a1.333 1.333 0 001.333 1.333h13.334a1.333 1.333 0 001.333-1.333v-.667a1.333 1.333 0 00-1.333-1.333z" />
            </svg>
        </IconWrapper>
    );
};


const TransportIcon: React.FC<{ size?: 'sm' | 'lg'; color?: string }> = ({ size, color = 'blue' }) => {
    const iconSizeClasses = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const colors = PALETTE[color] || PALETTE.gray;
    return (
        <IconWrapper size={size} className={colors.bg}>
             <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 24 24" fill="currentColor">
                <path className={colors.secondary} d="M18.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM5.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                <path className={colors.primary} d="M21.458 9.591L18.833 5.333a1.333 1.333 0 00-1.163-.666H6.33a1.333 1.333 0 00-1.163.666L2.542 9.591A1.33 1.33 0 002 10.333v5.334a1.333 1.333 0 001.333 1.333h.667a1.333 1.333 0 001.333-1.333v-.667h13.334v.667a1.333 1.333 0 001.333 1.333h.667a1.333 1.333 0 001.333-1.333v-5.334a1.33 1.33 0 00-.542-.742zM5.333 9.667h13.334l-1.334-2.667H6.667L5.333 9.667z" />
            </svg>
        </IconWrapper>
    );
};

const HealthIcon: React.FC<{ size?: 'sm' | 'lg'; color?: string }> = ({ size, color = 'red' }) => {
    const iconSizeClasses = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const colors = PALETTE[color] || PALETTE.gray;
    return (
        <IconWrapper size={size} className={colors.bg}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 24 24" fill="currentColor">
                <path className={colors.secondary} d="M12.667 10H14a.667.667 0 00.667-.667V8a.667.667 0 00-.667-.667h-1.334v-1.33a.667.667 0 00-.666-.666H10.67a.667.667 0 00-.667.666v1.33H8.667a.667.667 0 00-.667.667v1.333c0 .368.298.667.667.667h1.333v1.333a.667.667 0 00.667.667h1.333a.667.667 0 00.667-.667v-1.333z" />
                <path className={colors.primary} d="M19.333 5H4.667A1.333 1.333 0 003.333 6.333v11.334A1.333 1.333 0 004.667 19h14.666A1.333 1.333 0 0020.667 17.667V6.333A1.333 1.333 0 0019.333 5zM12 14.333h-1.33a.667.667 0 01-.667-.666V12H8.667a.667.667 0 01-.667-.667V10c0-.368.298-.667.667-.667H10V8a.667.667 0 01.667-.667h1.333c.368 0 .667.299.667.667v1.333H14a.667.667 0 01.667.667v1.333a.667.667 0 01-.667.667h-1.333v1.333a.667.667 0 01-.667.667z" />
            </svg>
        </IconWrapper>
    );
};

const ClothesIcon: React.FC<{ size?: 'sm' | 'lg'; color?: string }> = ({ size, color = 'purple' }) => {
    const iconSizeClasses = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const colors = PALETTE[color] || PALETTE.gray;
    return (
        <IconWrapper size={size} className={colors.bg}>
             <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 24 24" fill="currentColor">
                <path className={colors.primary} d="M19.333 4H4.667A1.333 1.333 0 003.333 5.333v13.334A1.333 1.333 0 004.667 20h14.666A1.333 1.333 0 0020.667 18.667V5.333A1.333 1.333 0 0019.333 4zM12 8.333a2 2 0 01-2-2h-1.33a.667.667 0 110-1.33h6.66a.667.667 0 110 1.33H14a2 2 0 01-2 2z" />
            </svg>
        </IconWrapper>
    );
};

const EntertainmentIcon: React.FC<{ size?: 'sm' | 'lg'; color?: string }> = ({ size, color = 'yellow' }) => {
    const iconSizeClasses = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const colors = PALETTE[color] || PALETTE.gray;
    return (
        <IconWrapper size={size} className={colors.bg}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 24 24" fill="currentColor">
                <path className={colors.secondary} d="M9.333 4h5.334a1.333 1.333 0 011.333 1.333v2A1.333 1.333 0 0114.667 8.667H9.333a1.333 1.333 0 01-1.333-1.334v-2A1.333 1.333 0 019.333 4zM14.667 15.333H9.333a1.333 1.333 0 00-1.333 1.334v2A1.333 1.333 0 009.333 20h5.334a1.333 1.333 0 001.333-1.333v-2a1.333 1.333 0 00-1.333-1.334z" />
                <path className={colors.primary} d="M17.333 8.667H6.667a1.333 1.333 0 00-1.334 1.333v4a1.333 1.333 0 001.334 1.333h10.666a1.333 1.333 0 001.334-1.333v-4a1.333 1.333 0 00-1.334-1.333z" />
            </svg>
        </IconWrapper>
    );
};

const ServicesIcon: React.FC<{ size?: 'sm' | 'lg'; color?: string }> = ({ size, color = 'teal' }) => {
    const iconSizeClasses = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const colors = PALETTE[color] || PALETTE.gray;
    return (
        <IconWrapper size={size} className={colors.bg}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 24 24" fill="currentColor">
                <path className={colors.primary} d="M17.333 4H6.667A1.333 1.333 0 005.333 5.333v13.334A1.333 1.333 0 006.667 20h10.666a1.333 1.333 0 001.334-1.333V5.333A1.333 1.333 0 0017.333 4zM8 16.333a.667.667 0 010-1.333h8a.667.667 0 010 1.333H8zm0-3.333a.667.667 0 010-1.334h8a.667.667 0 010 1.334H8z" />
                <path className={colors.secondary} d="M8 9a.667.667 0 110-1.333h3.333a.667.667 0 110 1.333H8z" />
            </svg>
        </IconWrapper>
    );
};

const DefaultIcon: React.FC<{ size?: 'sm' | 'lg'; color?: string }> = ({ size, color = 'gray' }) => {
    const iconSizeClasses = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const colors = PALETTE[color] || PALETTE.gray;
    return (
        <IconWrapper size={size} className={colors.bg}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 24 24" fill="currentColor">
                 <path className={colors.primary} d="M14 4.001H8.667a1.333 1.333 0 00-1.334 1.333v13.333A1.333 1.333 0 008.667 20h6.666a1.333 1.333 0 001.334-1.333V8.667a.667.667 0 00-.2-.467l-4-4a.666.666 0 00-.466-.2zM14 8.667h1.667L12 5v3.667z" />
            </svg>
        </IconWrapper>
    );
};

export const getCategoryIcon = (categoryName: string, color: string, size: 'sm' | 'lg' = 'sm') => {
    switch (categoryName) {
        case 'Comida':
            return <FoodIcon size={size} color={color} />;
        case 'Transporte':
            return <TransportIcon size={size} color={color} />;
        case 'Salud':
            return <HealthIcon size={size} color={color} />;
        case 'Ropa':
            return <ClothesIcon size={size} color={color} />;
        case 'Entretenimiento':
            return <EntertainmentIcon size={size} color={color} />;
        case 'Servicios':
            return <ServicesIcon size={size} color={color} />;
        default:
            return <DefaultIcon size={size} color={color} />;
    }
};