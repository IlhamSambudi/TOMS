import React, { useState } from 'react';
import flightService from '../services/flightService';
import api from '../services/api'; // direct api access for linking if needed, or use service
import { toast } from 'react-toastify';

const FlightForm = ({ groupId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        airline: '',
        flight_number: '',
        origin: '',
        destination: '',
        departure_time: '',
        arrival_time: ''
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
            // 1. Create Flight
            const flightResponse = await flightService.create(formData);
            console.log('Flight created:', flightResponse);
            // Handle unwrapped vs wrapped
            const flightId = flightResponse.id || flightResponse.data?.id;

            if (!flightId) throw new Error('Converted flight ID not found');

            // 2. Link to Group
            if (groupId) {
                await api.post(`/groups/${groupId}/flights`, { flight_id: flightId });
            }

            toast.success('Flight added successfully');
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add flight');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Airline</label>
                    <input name="airline" value={formData.airline} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g. Saudia" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Flight Number</label>
                    <input name="flight_number" value={formData.flight_number} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g. SV819" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Origin</label>
                    <input name="origin" value={formData.origin} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g. CGK" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Destination</label>
                    <input name="destination" value={formData.destination} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g. JED" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Departure</label>
                    <input type="datetime-local" name="departure_time" value={formData.departure_time} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Arrival</label>
                    <input type="datetime-local" name="arrival_time" value={formData.arrival_time} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                </div>
            </div>
            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onCancel} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Adding...' : 'Add Flight'}
                </button>
            </div>
        </form>
    );
};

export default FlightForm;
