import React, { useState, useEffect } from 'react';
import groupService from '../services/groupService';
import handlingService from '../services/handlingService';
import { toast } from 'react-toastify';

const GroupForm = ({ onSuccess, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        group_code: '',
        program_type: '',
        departure_date: '',
        total_pax: '',
        notes: '',
        handling_company_id: '',
        muasasah: ''
    });
    const [loading, setLoading] = useState(false);
    const [handlingCompanies, setHandlingCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await handlingService.getAll();
                setHandlingCompanies(data);
            } catch (e) {
                console.error(e);
                toast.error('Failed to load handling companies');
            }
        };
        fetchCompanies();

        if (initialData) {
            setFormData({
                ...initialData,
                departure_date: initialData.departure_date ? initialData.departure_date.split('T')[0] : ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await groupService.update(initialData.id, formData);
                toast.success('Group updated successfully');
            } else {
                await groupService.create(formData);
                toast.success('Group created successfully');
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving group:', error);
            toast.error(error.message || 'Failed to save group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Code</label>
                <input
                    type="text"
                    name="group_code"
                    required
                    value={formData.group_code}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g. GRP-JAN-001"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
                    <select
                        name="program_type"
                        required
                        value={formData.program_type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">Select Type</option>
                        <option value="Umroh 9 Days">Umroh 9 Days</option>
                        <option value="Umroh 12 Days">Umroh 12 Days</option>
                        <option value="Umroh Plus Turkey">Umroh Plus Turkey</option>
                        <option value="Hajj">Hajj</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                    <input
                        type="date"
                        name="departure_date"
                        required
                        value={formData.departure_date}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Pax</label>
                    <input
                        type="number"
                        name="total_pax"
                        required
                        min="1"
                        value={formData.total_pax}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Handling Company</label>
                    <select
                        name="handling_company_id"
                        value={formData.handling_company_id}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">Select Company</option>
                        {handlingCompanies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Muasasah</label>
                    <select
                        name="muasasah"
                        value={formData.muasasah}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">Select muasasah</option>
                        <option value="MAAD">MAAD</option>
                        <option value="GHANIYA">GHANIYA</option>
                        <option value="ARABCO">ARABCO</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Additional notes..."
                ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (initialData ? 'Update Group' : 'Create Group')}
                </button>
            </div>
        </form>
    );
};

export default GroupForm;
