

import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, helperText, className, startIcon: StartIcon, endIcon: EndIcon, ...props }, ref) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {label}
            </label>
        )}
        <div className="relative">
            {StartIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <StartIcon size={18} />
                </div>
            )}
            <input
                ref={ref}
                className={`w-full bg-white transition-all placeholder:text-slate-400 focus:ring-1 focus:ring-[var(--primary)] ${className || ''}`}
                style={{
                    height: '44px',
                    borderRadius: '12px',
                    paddingLeft: StartIcon ? '44px' : '16px',
                    paddingRight: EndIcon ? '44px' : '16px',
                    border: error ? '1px solid var(--status-danger)' : '1px solid var(--border)',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                }}

                onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent-muted)'}
                onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
                {...props}
            />
            {EndIcon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <EndIcon size={18} />
                </div>
            )}
        </div>
        {error && <p className="text-[11px]" style={{ color: 'var(--danger)' }}>{error}</p>}
        {helperText && !error && <p className="text-[11px]" style={{ color: 'var(--text-placeholder)' }}>{helperText}</p>}
    </div>
));

Input.displayName = 'Input';
export default Input;
