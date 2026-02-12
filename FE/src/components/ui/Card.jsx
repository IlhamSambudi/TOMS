import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, onClick, padding = true, ...props }) => (
    <div
        className={clsx('bg-white rounded-[14px]', padding && 'p-[24px]', onClick && 'cursor-pointer hover:shadow-md transition-shadow', className)}
        style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-light)' }}
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
