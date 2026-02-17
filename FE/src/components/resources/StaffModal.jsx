import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import staffService from '../../services/staffService';
import toast from 'react-hot-toast';

const StaffModal = ({ isOpen, onClose, onSuccess, initialData = null, type = 'muthawif' }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                phone: initialData.phone || ''
            });
        } else {
            setFormData({
                name: '',
                phone: ''
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
            toast.error('Name is required');
            return;
        }

        setLoading(true);
        try {
            if (type === 'muthawif') {
                if (initialData) {
                    await staffService.updateMuthawif(initialData.id, formData);
                    toast.success('Muthawif updated successfully');
                } else {
                    await staffService.createMuthawif(formData);
                    toast.success('Muthawif created successfully');
                }
            } else {
                if (initialData) {
                    await staffService.updateTourLeader(initialData.id, formData);
                    toast.success('Tour Leader updated successfully');
                } else {
                    await staffService.createTourLeader(formData);
                    toast.success('Tour Leader created successfully');
                }
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to save staff');
        } finally {
            setLoading(false);
        }
    };

    const titleType = type === 'muthawif' ? 'Muthawif' : 'Tour Leader';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? `Edit ${titleType}` : `Add ${titleType}`}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} loading={loading}>
                        {initialData ? 'Save Changes' : `Create ${titleType}`}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={`e.g. ${type === 'muthawif' ? 'Ustadz Abdullah' : 'John Doe'}`}
                    required
                />
                <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62 812..."
                />
            </form>
        </Modal>
    );
};

export default StaffModal;
