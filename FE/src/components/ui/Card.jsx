import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, onClick, padding = true, ...props }) => (
    <div
        className={clsx('bg-white rounded-2xl', padding && 'p-[24px]', onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300', className)}
        style={{ border: '1px solid var(--border)', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}
        onClick={onClick}
        {...props}
    >
        {children}
    </div>
);

Card.Header = ({ children }) => (
    <div className="flex items-center justify-between mb-4">{children}</div>
);

Card.Title = ({ children }) => (
    <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-secondary)' }}>{children}</h3>
);

export default Card;
