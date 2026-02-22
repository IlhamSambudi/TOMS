import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import groupService from '../../services/groupService';
import transportService from '../../services/transportService';
import toast from 'react-hot-toast';

const PROVIDERS = ['Muasasah', 'Handling'];
const VEHICLE_TYPES = ['Bus', 'Coaster', 'GMC'];
const PICKUP_LOCATIONS = [
    'King Abdul Aziz Airport',
    'Muhammad Prince Abdul Aziz Airport',
    'Hotel Makkah',
    'Hotel Madinah',
    'Train Station',
];
const DROP_LOCATIONS = [
    'King Abdul Aziz Airport',
    'Muhammad Prince Abdul Aziz Airport',
    'Hotel Makkah',
    'Hotel Madinah',
    'Train Station',
    'City Tour Makkah',
    'City Tour Madinah',
    'City Tour Thaif',
    'Rawdah',
];

const SelectField = ({ label, name, value, onChange, options, placeholder, error, required }) => (
    <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
            style={{ border: error ? '1px solid var(--danger)' : '1px solid var(--border)', outline: 'none' }}
        >
            <option value="">{placeholder}</option>
            {options.map(opt => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                    {opt.label ?? opt}
                </option>
            ))}
        </select>
        {error && <p className="text-[11px]" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
);

const EMPTY_FORM = {
    group_id: '',
    provider_name: '',
    vehicle_type: '',
    route: '',
    pickup_location: '',
    drop_location: '',
    journey_date: '',
    pax_count: '',
    departure_time: '',
};

const TransportModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [groups, setGroups] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch groups when modal opens
    useEffect(() => {
        if (isOpen) {
            groupService.getAll()
                .then(data => setGroups(Array.isArray(data) ? data : []))
                .catch(() => toast.error('Failed to load groups'));
        }
    }, [isOpen]);

    // Populate form when editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                group_id: initialData.group_id ? String(initialData.group_id) : '',
                provider_name: initialData.provider_name || '',
                vehicle_type: initialData.vehicle_type || '',
                route: initialData.route || '',
                pickup_location: initialData.pickup_location || '',
                drop_location: initialData.drop_location || '',
                journey_date: initialData.journey_date ? initialData.journey_date.slice(0, 16) : '',
                pax_count: initialData.pax_count ? String(initialData.pax_count) : '',
                departure_time: initialData.departure_time || '',
            });
        } else {
            setFormData(EMPTY_FORM);
        }
        setErrors({});
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.group_id) errs.group_id = 'Group is required';
        if (!formData.provider_name) errs.provider_name = 'Provider is required';
        if (!formData.vehicle_type) errs.vehicle_type = 'Vehicle type is required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                pax_count: formData.pax_count ? parseInt(formData.pax_count) : null,
            };

            if (initialData) {
                await transportService.update(formData.group_id, initialData.id, payload);
                toast.success('Transport updated successfully');
            } else {
                await transportService.create(formData.group_id, payload);
                toast.success('Transport added successfully');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error.message || 'Failed to save transport');
        } finally {
            setLoading(false);
        }
    };

    const groupOptions = groups.map(g => ({
        value: String(g.id),
        label: `${g.group_code} - ${g.program_type}`,
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Transport' : 'Add Transport'}>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Group Selector */}
                <SelectField
                    label="Group"
                    name="group_id"
                    value={formData.group_id}
                    onChange={handleChange}
                    options={groupOptions}
                    placeholder="Select Group"
                    error={errors.group_id}
                    required
                />

                {/* Provider & Vehicle */}
                <div className="grid grid-cols-2 gap-4">
                    <SelectField
                        label="Provider Name"
                        name="provider_name"
                        value={formData.provider_name}
                        onChange={handleChange}
                        options={PROVIDERS}
                        placeholder="Select provider"
                        error={errors.provider_name}
                        required
                    />
                    <SelectField
                        label="Vehicle Type"
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        options={VEHICLE_TYPES}
                        placeholder="Select vehicle"
                        error={errors.vehicle_type}
                        required
                    />
                </div>

                {/* Route */}
                <Input
                    label="Route"
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    placeholder="e.g. City Tour Makkah, Pickup Airport"
                />

                {/* Pickup & Drop */}
                <div className="grid grid-cols-2 gap-4">
                    <SelectField
                        label="Pickup Location"
                        name="pickup_location"
                        value={formData.pickup_location}
                        onChange={handleChange}
                        options={PICKUP_LOCATIONS}
                        placeholder="Select location"
                    />
                    <SelectField
                        label="Drop Location"
                        name="drop_location"
                        value={formData.drop_location}
                        onChange={handleChange}
                        options={DROP_LOCATIONS}
                        placeholder="Select location"
                    />
                </div>

                {/* Date & Pax */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Journey Date"
                        name="journey_date"
                        type="datetime-local"
                        value={formData.journey_date}
                        onChange={handleChange}
                    />
                    <Input
                        label="Pax Count"
                        name="pax_count"
                        type="number"
                        value={formData.pax_count}
                        onChange={handleChange}
                        placeholder="e.g. 45"
                    />
                </div>

                {/* Notes */}
                <Input
                    label="Departure Time"
                    name="departure_time"
                    type="time"
                    value={formData.departure_time}
                    onChange={handleChange}
                />

                <div className="flex gap-2 justify-end pt-2">
                    <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        {initialData ? 'Save Changes' : 'Add Transport'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TransportModal;
