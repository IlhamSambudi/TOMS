import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const STATUSES = [
    {
        key: 'PREPARATION',
        label: 'Preparation',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        hoverBg: '#FFF7ED',
    },
    {
        key: 'DEPARTURE',
        label: 'Departure',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        hoverBg: '#EFF6FF',
    },
    {
        key: 'ARRIVAL',
        label: 'Arrival',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        hoverBg: '#ECFDF5',
    },
];

const getStyle = (status) =>
    STATUSES.find(s => s.key === status) || STATUSES[0];

const StatusBadge = ({ status = 'PREPARATION', onChange, className = '' }) => {
    const style = getStyle(status);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleSelect = (e, key) => {
        e.stopPropagation();
        setOpen(false);
        if (onChange && key !== status) onChange(key);
    };

    if (!onChange) {
        // Read-only badge
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} ${className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {style.label}
            </span>
        );
    }

    return (
        <div ref={ref} className="relative inline-block" onClick={e => e.stopPropagation()}>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer transition-all hover:shadow-sm ${style.bg} ${style.text} ${style.border} ${className}`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {style.label}
                <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    className="absolute z-50 top-full mt-1.5 left-0 min-w-[140px] bg-white rounded-xl shadow-xl border border-slate-100 py-1 overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {STATUSES.map(s => (
                        <button
                            key={s.key}
                            onClick={(e) => handleSelect(e, s.key)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-slate-50"
                        >
                            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                            <span className="flex-1">{s.label}</span>
                            {s.key === status && <Check size={11} className="text-teal-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Static helper used in Groups.jsx filter
StatusBadge.fromGroup = (group) => group?.status || 'PREPARATION';

export { STATUSES };
export default StatusBadge;
