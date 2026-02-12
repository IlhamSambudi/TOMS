import React, { useState, useEffect } from 'react';
import assignmentService from '../services/assignmentService';
import { toast } from 'react-toastify';

const AssignmentForm = ({ groupId, type, onSuccess, onCancel }) => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                let data = [];
                if (type === 'tour-leader') {
                    data = await assignmentService.getAllTourLeaders();
                } else {
                    data = await assignmentService.getAllMuthawifs();
                }
                setStaffList(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load staff list');
            }
        };
        fetchStaff();
    }, [type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStaffId) return;
        setLoading(true);
        try {
            if (type === 'tour-leader') {
                await assignmentService.assignTourLeader(groupId, selectedStaffId);
            } else {
                await assignmentService.assignMuthawif(groupId, selectedStaffId);
            }
            toast.success('Assigned successfully');
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Failed to assign staff');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Select {type === 'tour-leader' ? 'Tour Leader' : 'Muthawif'}</label>
                <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    required
                    className="w-full p-2 border rounded-lg bg-white"
                >
                    <option value="">Select...</option>
                    {staffList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.phone})</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onCancel} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Assign' : 'Assign Staff'}
                </button>
            </div>
        </form>
    );
};

export default AssignmentForm;
