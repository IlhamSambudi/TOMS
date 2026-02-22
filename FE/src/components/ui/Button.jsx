import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-teal-700 text-white border border-transparent hover:bg-teal-800 shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm hover:shadow active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-600 border-none hover:bg-slate-50 active:scale-[0.98]',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm hover:shadow active:scale-[0.98]',
};

const sizes = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5',
    md: 'px-4 py-2 text-[12px] gap-2',
    lg: 'px-5 py-2.5 text-[13px] gap-2',
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, loading, className, ...props }) => {
    const vClass = variants[variant] || variants.primary;

    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed',
                // Exact styling mimicking the user's reference image
                size === 'sm' && 'h-[32px] px-3 text-[13px] gap-1.5 rounded-[10px] font-medium',
                size === 'md' && 'h-[40px] px-4 text-[14px] gap-2 rounded-[12px] font-semibold',
                size === 'lg' && 'h-[48px] px-6 text-[15px] gap-2 rounded-[14px] font-semibold',
                size === 'icon' && 'h-[40px] w-[40px] p-0 rounded-[12px]',
                vClass,
                className,
            )}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} className={variant === 'secondary' ? 'text-slate-400' : ''} />}
            {children}
        </button>
    );
};

export default Button;
