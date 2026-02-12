import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Eye, Pencil, Trash2, Search, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import DataTable from '../components/ui/DataTable';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import groupService from '../services/groupService';
import handlingService from '../services/handlingService';

const groupSchema = z.object({
    group_code: z.string().min(1, 'Required'),
    program_type: z.string().min(1, 'Required'),
    departure_date: z.string().min(1, 'Required'),
    total_pax: z.coerce.number().min(1, 'Min 1'),
    handling_company_id: z.string().optional(),
    notes: z.string().optional(),
});

const Groups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [handling, setHandling] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [handlingFilter, setHandlingFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(groupSchema),
    });

    const fetchData = async () => {
        try {
            const [g, h] = await Promise.all([groupService.getAll(), handlingService.getAll()]);
            setGroups(Array.isArray(g) ? g : []);
            setHandling(Array.isArray(h) ? h : []);
        } catch (e) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const onSubmit = async (data) => {
        try {
            if (editGroup) {
                await groupService.update(editGroup.id, data);
                toast.success('Group updated');
            } else {
                await groupService.create(data);
                toast.success('Group created');
            }
            setModalOpen(false);
            setEditGroup(null);
            reset();
            fetchData();
        } catch (e) {
            toast.error(e.message || 'Failed');
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await groupService.delete(deleteTarget.id);
            toast.success('Group deleted');
            setDeleteTarget(null);
            fetchData();
        } catch (e) {
            toast.error(e.message || 'Failed');
        } finally {
            setDeleting(false);
        }
    };

    const openEdit = (group) => {
        setEditGroup(group);
        reset({
            group_code: group.group_code,
            program_type: group.program_type,
            departure_date: group.departure_date?.split('T')[0],
            total_pax: group.total_pax,
            handling_company_id: group.handling_company_id?.toString() || '',
            notes: group.notes || '',
        });
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditGroup(null);
        reset({ group_code: '', program_type: '', departure_date: '', total_pax: '', handling_company_id: '', notes: '' });
        setModalOpen(true);
    };

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const filtered = groups.filter(g => {
        const q = search.toLowerCase();
        const matchSearch = g.group_code?.toLowerCase().includes(q) ||
            g.program_type?.toLowerCase().includes(q) ||
            g.handling_company_name?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || StatusBadge.fromGroup(g) === statusFilter;
        const matchHandling = handlingFilter === 'all' || g.handling_company_id?.toString() === handlingFilter;
        return matchSearch && matchStatus && matchHandling;
    });

    const columns = [
        {
            key: 'group_code', label: 'Group Code',
            render: (row) => <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.group_code}</span>,
        },
        {
            key: 'program_type', label: 'Program',
            render: (row) => <Badge variant="primary">{row.program_type}</Badge>,
        },
        {
            key: 'departure_date', label: 'Departure',
            render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{formatDate(row.departure_date)}</span>,
        },
        {
            key: 'total_pax', label: 'Pax',
            render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.total_pax}</span>,
        },
        {
            key: 'handling', label: 'Handling',
            render: (row) => <span style={{ color: 'var(--text-muted)' }}>{row.handling_company_name || '—'}</span>,
        },
        {
            key: 'status', label: 'Status',
            render: (row) => <StatusBadge status={StatusBadge.fromGroup(row)} />,
        },
        {
            key: 'actions', label: '', headerClassName: 'w-10',
            render: (row, { openMenu, setOpenMenu }) => (
                <DataTable.ActionMenu rowId={row.id} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
                    { label: 'View', icon: Eye, onClick: () => navigate(`/groups/${row.id}`) },
                    { label: 'Edit', icon: Pencil, onClick: () => openEdit(row) },
                    { label: 'Delete', icon: Trash2, danger: true, onClick: () => setDeleteTarget(row) },
                ]} />
            ),
        },
    ];

    if (loading) return (
        <div>
            <PageHeader title="Groups" subtitle="Manage travel groups" />
            <Skeleton.Table rows={6} cols={6} />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader title="Groups" subtitle={`${groups.length} total groups`}>
                <Button icon={Plus} onClick={openCreate}>New Group</Button>
            </PageHeader>

            {/* Unified Card Container */}
            <DataTable
                columns={columns}
                data={filtered}
                onRowClick={(row) => navigate(`/groups/${row.id}`)}
                selectable
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                emptyState={<EmptyState title="No groups found" description="Create your first group to get started." />}
                filters={
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex-1 min-w-[240px]">
                            <Input
                                startIcon={Search}
                                placeholder="Search groups..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-slate-50 border-transparent focus:bg-white"
                            />
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="h-[var(--height-control)] px-4 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors focus:ring-2 focus:ring-blue-100 outline-none"
                            style={{ border: 'none' }}
                        >
                            <option value="all">All Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="in-saudi">In Saudi</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>

                        {handling.length > 0 && (
                            <select
                                value={handlingFilter}
                                onChange={e => setHandlingFilter(e.target.value)}
                                className="h-[var(--height-control)] px-4 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors focus:ring-2 focus:ring-blue-100 outline-none"
                                style={{ border: 'none', maxWidth: '180px' }}
                            >
                                <option value="all">All Handling</option>
                                {handling.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        )}

                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl ml-1">
                            <Filter size={18} />
                        </Button>
                    </div>
                }
            />

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditGroup(null); }} title={editGroup ? 'Edit Group' : 'New Group'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Group Code" {...register('group_code')} error={errors.group_code?.message} placeholder="GRP-2026-001" />
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Program Type</label>
                            <select {...register('program_type')} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select type</option>
                                <option value="Umroh 9 Days">Umroh 9 Days</option>
                                <option value="Umroh 12 Days">Umroh 12 Days</option>
                                <option value="Umroh Plus Turkey">Umroh Plus Turkey</option>
                                <option value="Haji Plus">Haji Plus</option>
                                <option value="Haji Reguler">Haji Reguler</option>
                            </select>
                            {errors.program_type && <p className="text-[11px]" style={{ color: 'var(--danger)' }}>{errors.program_type.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Departure Date" type="date" {...register('departure_date')} error={errors.departure_date?.message} />
                        <Input label="Total Pax" type="number" {...register('total_pax')} error={errors.total_pax?.message} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Handling Company</label>
                        <select {...register('handling_company_id')} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                            style={{ border: '1px solid var(--border)', outline: 'none' }}>
                            <option value="">Select company</option>
                            {handling.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Notes</label>
                        <textarea {...register('notes')} rows={3}
                            className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white resize-none"
                            style={{ border: '1px solid var(--border)', outline: 'none' }} placeholder="Additional notes..." />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <Button variant="secondary" type="button" onClick={() => { setModalOpen(false); setEditGroup(null); }}>Cancel</Button>
                        <Button type="submit" loading={isSubmitting}>{editGroup ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Delete Group" message={`Delete "${deleteTarget?.group_code}"? All associated data will be lost.`} loading={deleting} />
        </div>
    );
};

export default Groups;
