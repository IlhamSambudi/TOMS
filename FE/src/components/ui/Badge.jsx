import React from 'react';
import { clsx } from 'clsx';

const badgeStyles = {
    default: 'bg-gray-50 text-gray-600 border-gray-200',
    primary: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
    info: 'bg-sky-50 text-sky-600 border-sky-200',
};

const Badge = ({ children, variant = 'default', className = '' }) => {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                badgeStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
