import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { MoreHorizontal } from 'lucide-react';
import Card from './Card';

const DataTable = ({
    columns,
    data,
    onRowClick,
    emptyState,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    filters, // New prop for unified layout
}) => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleAll = () => {
        if (selectedIds.length === data.length) {
            onSelectionChange?.([]);
        } else {
            onSelectionChange?.(data.map(d => d.id));
        }
    };

    const toggleOne = (id) => {
        if (selectedIds.includes(id)) {
            onSelectionChange?.(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange?.([...selectedIds, id]);
        }
    };

    if (data.length === 0 && emptyState && !filters) { // Only show full empty state if no filters are active/present
        return <Card padding={false}><div className="py-16">{emptyState}</div></Card>;
    }

    return (
        <Card className="overflow-hidden" padding={true}>
            {filters && (
                <div className="mb-6">
                    {filters}
                </div>
            )}
            <div className="overflow-x-auto -mx-5 bg-white rounded-lg border-t border-slate-100/50"> {/* Added slight separation if needed, or kept clean */}
                <table className="data-table w-full">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                            {selectable && (
                                <th className="w-12 text-center py-4 bg-gray-50/50">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === data.length && data.length > 0}
                                        onChange={toggleAll}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-200"
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th key={col.key} className={clsx('py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider', col.headerClassName || '')}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <AnimatePresence>
                            {data.map((row, idx) => (
                                <motion.tr
                                    key={row.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className={clsx(
                                        'hover:bg-gray-50/50 transition-colors',
                                        onRowClick ? 'cursor-pointer' : ''
                                    )}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {selectable && (
                                        <td className="text-center py-4 px-6" onClick={e => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(row.id)}
                                                onChange={() => toggleOne(row.id)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-200"
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={clsx('py-4 px-6 text-sm text-gray-600', col.cellClassName || '')}
                                        >
                                            {col.render ? col.render(row, {
                                                openMenu,
                                                setOpenMenu
                                            }) : row[col.key]}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

// Action menu sub-component
DataTable.ActionMenu = ({ rowId, openMenu, setOpenMenu, actions }) => {
    const isOpen = openMenu === rowId;

    return (
        <div className="relative flex justify-end">
            <button
                onClick={(e) => { e.stopPropagation(); setOpenMenu(isOpen ? null : rowId); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <MoreHorizontal size={15} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); }} />
                    <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]">
                        {actions.map((action, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); action.onClick(); setOpenMenu(null); }}
                                className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${action.danger
                                    ? 'text-red-500 hover:bg-red-50'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {action.icon && <action.icon size={13} />}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DataTable;
