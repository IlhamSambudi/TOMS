
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import groupService from '../../services/groupService';
import assignmentService from '../../services/assignmentService';

const schema = z.object({
    group_id: z.string().min(1, 'Group is required'),
    role: z.enum(['tour_leader', 'muthawif']),
    staff_id: z.string().min(1, 'Staff member is required'),
});

const AssignmentModal = ({ isOpen, onClose, onSuccess }) => {
    const [groups, setGroups] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            role: 'tour_leader'
        }
    });

    const selectedRole = watch('role');

    useEffect(() => {
        if (isOpen) {
            fetchGroups();
            fetchStaff(selectedRole);
        } else {
            reset();
            setStaffList([]);
        }
    }, [isOpen, selectedRole]);

    const fetchGroups = async () => {
        try {
            const data = await groupService.getAll();
            setGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load groups', error);
            toast.error('Failed to load groups');
        }
    };

    const fetchStaff = async (role) => {
        setLoadingData(true);
        try {
            let data = [];
            if (role === 'tour_leader') {
                data = await assignmentService.getAllTourLeaders();
            } else {
                data = await assignmentService.getAllMuthawifs();
            }
            setStaffList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load staff', error);
            toast.error('Failed to load staff list');
        } finally {
            setLoadingData(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (data.role === 'tour_leader') {
                await assignmentService.assignTourLeader(data.group_id, data.staff_id);
            } else {
                await assignmentService.assignMuthawif(data.group_id, data.staff_id);
            }
            toast.success('Assignment created successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create assignment');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Assignment">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Group</label>
                    <select
                        {...register('group_id')}
                        className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                        style={{ border: errors.group_id ? '1px solid var(--danger)' : '1px solid var(--border)', outline: 'none' }}
                    >
                        <option value="">Select Group</option>
                        {groups.map(g => (
                            <option key={g.id} value={g.id}>
                                {g.group_code} - {g.program_type}
                            </option>
                        ))}
                    </select>
                    {errors.group_id && <p className="text-[11px]" style={{ color: 'var(--danger)' }}>{errors.group_id.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Role</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="radio"
                                value="tour_leader"
                                {...register('role')}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            Tour Leader
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="radio"
                                value="muthawif"
                                {...register('role')}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            Muthawif
                        </label>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Select Staff</label>
                    <select
                        {...register('staff_id')}
                        className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                        style={{ border: errors.staff_id ? '1px solid var(--danger)' : '1px solid var(--border)', outline: 'none' }}
                        disabled={loadingData}
                    >
                        <option value="">Select {selectedRole === 'tour_leader' ? 'Tour Leader' : 'Muthawif'}</option>
                        {staffList.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {errors.staff_id && <p className="text-[11px]" style={{ color: 'var(--danger)' }}>{errors.staff_id.message}</p>}
                </div>

                <div className="flex gap-2 justify-end pt-4">
                    <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" loading={isSubmitting}>Assign</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AssignmentModal;
