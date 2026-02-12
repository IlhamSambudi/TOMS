import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: {
        background: 'var(--primary)',
        color: '#ffffff',
        border: '1px solid transparent',
    },
    secondary: {
        background: '#ffffff',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: 'none',
    },
    danger: {
        background: '#FEF2F2',
        color: '#EF4444',
        border: '1px solid #FECACA',
    },
};

const sizes = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5',
    md: 'px-4 py-2 text-[12px] gap-2',
    lg: 'px-5 py-2.5 text-[13px] gap-2',
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, loading, className, ...props }) => {
    const v = variants[variant] || variants.primary;

    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
                // Strict Design System Sizes
                size === 'sm' && 'h-[36px] px-4 text-[13px] gap-1.5 rounded-[10px]',
                size === 'md' && 'h-[44px] px-5 text-[14px] gap-2 rounded-[12px] font-semibold',
                size === 'lg' && 'h-[52px] px-6 text-[16px] gap-2.5 rounded-[14px]',
                size === 'icon' && 'h-[44px] w-[44px] p-0 rounded-[12px]',
                className,
            )}
            style={{
                background: v.background,
                color: v.color,
                border: v.border,
            }}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : Icon && <Icon size={14} />}
            {children}
        </button>
    );
};

export default Button;
