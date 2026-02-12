import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'No data', description = '', action, children }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--bg-hover)' }}>
                <Icon size={22} strokeWidth={1.5} style={{ color: 'var(--text-placeholder)' }} />
            </div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{title}</h3>
            {description && <p className="text-xs max-w-xs mb-4" style={{ color: 'var(--text-placeholder)' }}>{description}</p>}
            {action && <div className="mt-1">{action}</div>}
            {children && <div className="mt-1">{children}</div>}
        </div>
    );
};

export default EmptyState;
