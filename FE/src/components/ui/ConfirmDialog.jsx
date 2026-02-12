import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertTriangle size={18} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
                                Delete
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
