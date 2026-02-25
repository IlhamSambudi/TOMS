import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Users, Eye, EyeOff } from 'lucide-react';
import { Plus, Edit, Trash2, Train } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import trainService from '../../services/trainService';
import groupService from '../../services/groupService';

const selectStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '10px', fontSize: '14px',
    border: '1px solid var(--border)', outline: 'none', background: '#fff',
};

const STATIONS = ['Makkah Station', 'Madinah Station', 'Jeddah Station'];

// Returns 'YYYY-MM-DD' for today in local time
const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isPast = (dateStr) => {
    if (!dateStr) return false;
    return dateStr.split('T')[0] < todayStr();
};

const Trains = () => {
    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [editingTrain, setEditingTrain] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const form = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const grpsRes = await groupService.getAll();
            const grps = Array.isArray(grpsRes) ? grpsRes : (grpsRes?.data || []);
            setGroups(grps);

            const allTrains = await Promise.all(
                grps.map(async g => {
                    try {
                        const res = await trainService.getByGroup(g.id);
                        const rows = Array.isArray(res) ? res : (res?.data || []);
                        return rows.map(t => ({ ...t, group_code: g.group_code }));
                    } catch { return []; }
                })
            );
            setData(allTrains.flat());
        } catch (error) {
            console.error(error);
            toast.error('Failed to load train reservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Sort by train_date ascending
    const sortedData = [...data].sort((a, b) => {
        const da = a.train_date ? a.train_date.split('T')[0] : '';
        const db = b.train_date ? b.train_date.split('T')[0] : '';
        return da.localeCompare(db);
    });

    const activeData = showAll ? sortedData : sortedData.filter(item => !isPast(item.train_date));
    const pastCount = sortedData.filter(item => isPast(item.train_date)).length;

    const filteredData = activeData.filter(item =>
        item.from_station?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.to_station?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remarks?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setEditingTrain(null);
        setSelectedGroupId(null);
        form.reset({ train_date: '', from_station: '', to_station: '', departure_time: '', total_hajj: '', remarks: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (row) => {
        setEditingTrain(row);
        setSelectedGroupId(null);
        form.reset({
            train_date: row.train_date?.split('T')[0] || '',
            from_station: row.from_station || '',
            to_station: row.to_station || '',
            departure_time: row.departure_time || '',
            total_hajj: row.total_hajj || '',
            remarks: row.remarks || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (data) => {
        try {
            if (editingTrain) {
                await trainService.update(editingTrain.group_id, editingTrain.id, data);
                toast.success('Train reservation updated');
            } else {
                if (!selectedGroupId) { toast.error('Please select a group'); return; }
                await trainService.create(selectedGroupId, data);
                toast.success('Train reservation added');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    const handleDelete = async () => {
        try {
            const train = data.find(t => t.id === selectedId);
            if (train) await trainService.delete(train.group_id, train.id);
            toast.success('Train reservation deleted');
            fetchData();
        } catch { toast.error('Failed to delete'); } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const fmtTime = (t) => t ? t.substring(0, 5) : '—';

    const columns = [
        {
            key: 'group', label: 'Group',
            render: (row) => <span className="font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{row.group_code || '—'}</span>
        },
        {
            key: 'route', label: 'Route',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <Train size={13} style={{ color: 'var(--primary)' }} />
                    <span className="font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>
                        {row.from_station} → {row.to_station}
                    </span>
                </div>
            )
        },
        {
            key: 'date', label: 'Date & Time',
            render: (row) => (
                <div className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1"><Calendar size={11} /> {fmt(row.train_date)}</div>
                    <div className="flex items-center gap-1 mt-0.5"><Clock size={11} /> {fmtTime(row.departure_time)}</div>
                </div>
            )
        },
        {
            key: 'pax', label: 'Total Pax',
            render: (row) => row.total_hajj ? (
                <div className="flex items-center gap-1 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                    <Users size={11} /> {row.total_hajj}
                </div>
            ) : '—'
        },
        {
            key: 'remarks', label: 'Remarks',
            render: (row) => <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.remarks || '—'}</span>
        },
        {
            key: 'actions', label: '',
            render: (row, { openMenu, setOpenMenu }) => (
                <DataTable.ActionMenu rowId={row.id} openMenu={openMenu} setOpenMenu={setOpenMenu}
                    actions={[
                        { label: 'Edit details', icon: Edit, onClick: () => handleEdit(row) },
                        { label: 'Delete reservation', icon: Trash2, danger: true, onClick: () => { setSelectedId(row.id); setIsDeleteDialogOpen(true); } }
                    ]} />
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Train Reservations" subtitle="Recap all train reservations across groups.">
                <Button icon={Plus} onClick={handleAdd}>Add Train</Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredData}
                loading={loading}
                getRowClassName={(row) => isPast(row.train_date) ? 'opacity-50 bg-slate-50' : ''}
                filters={
                    <div className="flex items-center gap-3 flex-wrap">
                        <Input placeholder="Search route, group..." icon={Search}
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[300px]" />
                        {pastCount > 0 && (
                            <button
                                onClick={() => setShowAll(v => !v)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium border transition-colors"
                                style={{
                                    borderColor: showAll ? 'var(--primary)' : 'var(--border)',
                                    color: showAll ? 'var(--primary)' : 'var(--text-muted)',
                                    background: showAll ? 'var(--primary-light, #f0fdfa)' : 'transparent',
                                }}
                            >
                                {showAll ? <EyeOff size={14} /> : <Eye size={14} />}
                                {showAll ? 'Hide Past' : `Show Past (${pastCount})`}
                            </button>
                        )}
                    </div>
                }
                emptyState="No train reservation records found."
            />

            <ConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete} title="Delete Train Reservation"
                description="Are you sure? This action cannot be undone."
                confirmText="Delete" cancelText="Cancel" variant="danger" />

            {/* Train Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTrain ? 'Edit Train Reservation' : 'Add Train Reservation'}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {/* Group select — only for new */}
                    {!editingTrain && (
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Group</label>
                            <select style={selectStyle} value={selectedGroupId || ''} onChange={e => setSelectedGroupId(e.target.value)} required>
                                <option value="">Select group</option>
                                {groups.map(g => <option key={g.id} value={g.id}>{g.group_code}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>From Station</label>
                            <select {...form.register('from_station', { required: true })} style={selectStyle}>
                                <option value="">Select station</option>
                                {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>To Station</label>
                            <select {...form.register('to_station', { required: true })} style={selectStyle}>
                                <option value="">Select station</option>
                                {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Train Date" type="date" {...form.register('train_date')} />
                        <Input label="Departure Time" type="time" {...form.register('departure_time')} />
                        <Input label="Total Hajj (pax)" type="number" min="0" {...form.register('total_hajj')} />
                    </div>
                    <Input label="Remarks" {...form.register('remarks')} placeholder="Optional" />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={form.formState.isSubmitting}>{editingTrain ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Trains;
