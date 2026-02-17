import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import handlingService from '../../services/handlingService';
import toast from 'react-hot-toast';

const HandlingCompanyModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                contact_person: initialData.contact_person || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                address: initialData.address || ''
            });
        } else {
            setFormData({
                name: '',
                contact_person: '',
                phone: '',
                email: '',
                address: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Company Name is required');
            return;
        }

        setLoading(true);
        try {
            if (initialData) {
                await handlingService.update(initialData.id, formData);
                toast.success('Company updated successfully');
            } else {
                await handlingService.create(formData);
                toast.success('Company created successfully');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to save company');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Handling Company' : 'Add Handling Company'}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} loading={loading}>
                        {initialData ? 'Save Changes' : 'Create Company'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Eimas Al Arabia"
                    required
                />
                <Input
                    label="Contact Person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="e.g. Ahmed"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+966..."
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contact@company.com"
                        type="email"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <textarea
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-24"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Office address..."
                    />
                </div>
            </form>
        </Modal>
    );
};

export default HandlingCompanyModal;
