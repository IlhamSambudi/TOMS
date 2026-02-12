import React, { useEffect, useState } from 'react';
import handlingService from '../services/handlingService';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { UserCheck, Plus } from 'lucide-react';

const Handling = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const data = await handlingService.getAll();
            setCompanies(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load handling companies');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handlingService.create(formData);
            toast.success('Company added');
            setIsModalOpen(false);
            setFormData({ name: '', phone: '', email: '' });
            fetchCompanies();
        } catch (error) {
            toast.error('Failed to add company');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <UserCheck className="text-blue-600" /> Handling Companies
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={18} /> Add Company
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Phone</th>
                            <th className="p-4 font-semibold">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>
                        ) : companies.length === 0 ? (
                            <tr><td colSpan="3" className="p-4 text-center text-gray-500">No companies found.</td></tr>
                        ) : (
                            companies.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{c.name}</td>
                                    <td className="p-4 text-gray-600">{c.phone}</td>
                                    <td className="p-4 text-gray-600">{c.email}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Handling Company">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                </form>
            </Modal>
        </div>
    );
};

export default Handling;
