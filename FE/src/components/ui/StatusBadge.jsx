import React from 'react';
import { clsx } from 'clsx';

const statusStyles = {
    upcoming: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', dot: 'bg-sky-500' },
    active: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    completed: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' },
    'in-saudi': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
    draft: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400' },
};

const statusLabels = {
    upcoming: 'Upcoming',
    active: 'Active',
    completed: 'Completed',
    'in-saudi': 'In Saudi',
    draft: 'Draft',
};

const StatusBadge = ({ status = 'draft', className = '' }) => {
    const style = statusStyles[status] || statusStyles.draft;
    const label = statusLabels[status] || status;

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                style.bg, style.text, style.border,
                className
            )}
        >
            <span className={clsx('w-1.5 h-1.5 rounded-full', style.dot)} />
            {label}
        </span>
    );
};

// Helper to derive status from group data
StatusBadge.fromGroup = (group) => {
    if (!group?.departure_date) return 'draft';
    const dep = new Date(group.departure_date);
    const now = new Date();
    const diffDays = Math.ceil((dep - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && diffDays > -30) return 'in-saudi';
    if (diffDays <= 0) return 'completed';
    if (diffDays <= 7) return 'upcoming';
    return 'active';
};

export default StatusBadge;
