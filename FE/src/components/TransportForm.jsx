import React, { useState } from 'react';
import transportService from '../services/transportService';
import { toast } from 'react-toastify';

const TransportForm = ({ groupId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        provider_name: '',
        vehicle_type: '',
        route: '',
        journey_date: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transportService.create(groupId, formData);
            toast.success('Transport added successfully');
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add transport');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Provider Name</label>
                <input name="provider_name" value={formData.provider_name} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g. Saptco" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                <input name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g. Bus 50 Seater" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Route</label>
                <input name="route" value={formData.route} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g. JED Airport - Makkah Hotel" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Journey Date</label>
                <input type="datetime-local" name="journey_date" value={formData.journey_date} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onCancel} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Adding...' : 'Add Transport'}
                </button>
            </div>
        </form>
    );
};

export default TransportForm;
