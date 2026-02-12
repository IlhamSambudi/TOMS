import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
                    onClick={onClose}
                />

                {/* Panel */}
                <motion.div
                    className="relative bg-white w-full max-w-[640px] mx-4" // STRICT 640px
                    style={{
                        borderRadius: 'var(--radius-lg)', // 16px
                        boxShadow: 'var(--shadow-lg)',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Header (Margin Bottom 24px) */}
                    <div className="flex items-center justify-between px-7 pt-7 pb-2 flex-shrink-0">
                        <h2 className="text-[18px] font-semibold text-slate-900">{title}</h2>
                        <button onClick={onClose} className="p-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content (Padding 28px) */}
                    <div className="px-7 py-6 overflow-y-auto flex-1 custom-scrollbar">
                        {children}
                    </div>

                    {/* Footer (Margin Top 24px) */}
                    {footer && (
                        <div className="px-7 py-6 flex-shrink-0 bg-slate-50 border-t border-slate-100 rounded-b-[var(--radius-lg)]">
                            {footer}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default Modal;
