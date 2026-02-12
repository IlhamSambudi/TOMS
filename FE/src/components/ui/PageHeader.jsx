import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h1>
                {subtitle && <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    );
};

export default PageHeader;
