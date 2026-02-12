import React from 'react';
import { clsx } from 'clsx';

const Skeleton = ({ className = '', width, height }) => {
    return (
        <div
            className={clsx('skeleton rounded-lg', className)}
            style={{ width, height }}
        />
    );
};

Skeleton.Card = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-6 w-16 rounded" />
    </div>
);

Skeleton.Table = ({ rows = 5, cols = 4 }) => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 flex gap-4 border-b border-gray-50">
            {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="skeleton h-3 flex-1 rounded" />
            ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="p-4 flex gap-4 border-b border-gray-50 last:border-0">
                {Array.from({ length: cols }).map((_, c) => (
                    <div key={c} className="skeleton h-3 flex-1 rounded" />
                ))}
            </div>
        ))}
    </div>
);

Skeleton.List = ({ items = 3 }) => (
    <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-2.5 w-48 rounded" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
