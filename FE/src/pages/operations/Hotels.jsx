import React, { useState, useEffect } from 'react';
import { Search, Hotel, Calendar, Building2 } from 'lucide-react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import hotelService from '../../services/hotelService';
import groupService from '../../services/groupService';

const selectStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '10px', fontSize: '14px',
    border: '1px solid var(--border)', outline: 'none', background: '#fff',
};

const Hotels = () => {
    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [editingHotel, setEditingHotel] = useState(null);

    const form = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const grpsRes = await groupService.getAll();
            const grps = Array.isArray(grpsRes) ? grpsRes : (grpsRes?.data || []);
            setGroups(grps);

            // Fetch hotels from all groups
            const allHotels = await Promise.all(
                grps.map(async g => {
                    try {
                        const res = await hotelService.getByGroup(g.id);
                        const rows = Array.isArray(res) ? res : (res?.data || []);
                        return rows.map(h => ({ ...h, group_code: g.group_code }));
                    } catch { return []; }
                })
            );
            setData(allHotels.flat());
        } catch (error) {
            console.error(error);
            toast.error('Failed to load hotels');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredData = data.filter(item =>
        item.hotel_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reservation_no?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setEditingHotel(null);
        setSelectedGroupId(null);
        form.reset({ city: '', hotel_name: '', check_in: '', check_out: '', room_dbl: 0, room_trpl: 0, room_quad: 0, room_quint: 0, reservation_no: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (row) => {
        setEditingHotel(row);
        setSelectedGroupId(null);
        form.reset({
            city: row.city,
            hotel_name: row.hotel_name,
            check_in: row.check_in?.split('T')[0] || '',
            check_out: row.check_out?.split('T')[0] || '',
            room_dbl: row.room_dbl || 0,
            room_trpl: row.room_trpl || 0,
            room_quad: row.room_quad || 0,
            room_quint: row.room_quint || 0,
            reservation_no: row.reservation_no || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (data) => {
        try {
            if (editingHotel) {
                await hotelService.update(editingHotel.group_id, editingHotel.id, data);
                toast.success('Hotel updated');
            } else {
                if (!selectedGroupId) { toast.error('Please select a group'); return; }
                await hotelService.create(selectedGroupId, data);
                toast.success('Hotel added');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    const handleDelete = async () => {
        try {
            const hotel = data.find(h => h.id === selectedId);
            if (hotel) await hotelService.delete(hotel.group_id, hotel.id);
            toast.success('Hotel deleted');
            fetchData();
        } catch { toast.error('Failed to delete'); } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    const columns = [
        {
            key: 'group', label: 'Group',
            render: (row) => <span className="font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{row.group_code || '—'}</span>
        },
        {
            key: 'city', label: 'City',
            render: (row) => <Badge variant="primary">{row.city}</Badge>
        },
        {
            key: 'hotel', label: 'Hotel Name',
            render: (row) => (
                <div>
                    <div className="font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>{row.hotel_name}</div>
                    {row.reservation_no && <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Resv# {row.reservation_no}</div>}
                </div>
            )
        },
        {
            key: 'dates', label: 'Check In / Out',
            render: (row) => (
                <div className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1"><Calendar size={11} /> {fmt(row.check_in)}</div>
                    <div className="flex items-center gap-1 mt-0.5"><Calendar size={11} /> {fmt(row.check_out)}</div>
                </div>
            )
        },
        {
            key: 'rooms', label: 'Rooms',
            render: (row) => (
                <div className="flex gap-1 flex-wrap">
                    {row.room_dbl > 0 && <Badge variant="secondary">DBL:{row.room_dbl}</Badge>}
                    {row.room_trpl > 0 && <Badge variant="secondary">TRPL:{row.room_trpl}</Badge>}
                    {row.room_quad > 0 && <Badge variant="secondary">QUAD:{row.room_quad}</Badge>}
                    {row.room_quint > 0 && <Badge variant="secondary">QUINT:{row.room_quint}</Badge>}
                </div>
            )
        },
        {
            key: 'actions', label: '',
            render: (row, { openMenu, setOpenMenu }) => (
                <DataTable.ActionMenu rowId={row.id} openMenu={openMenu} setOpenMenu={setOpenMenu}
                    actions={[
                        { label: 'Edit details', icon: Edit, onClick: () => handleEdit(row) },
                        { label: 'Delete hotel', icon: Trash2, danger: true, onClick: () => { setSelectedId(row.id); setIsDeleteDialogOpen(true); } }
                    ]} />
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Hotels" subtitle="Recap all hotel accommodations across groups.">
                <Button icon={Plus} onClick={handleAdd}>Add Hotel</Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredData}
                loading={loading}
                filters={
                    <Input placeholder="Search hotel, city, group..." icon={Search}
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[300px]" />
                }
                emptyState="No hotel records found."
            />

            <ConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete} title="Delete Hotel"
                description="Are you sure? This action cannot be undone."
                confirmText="Delete" cancelText="Cancel" variant="danger" />

            {/* Hotel Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingHotel ? 'Edit Hotel' : 'Add Hotel'}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {/* Group select — only for new entries */}
                    {!editingHotel && (
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
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>City</label>
                            <select {...form.register('city', { required: true })} style={selectStyle}>
                                <option value="">Select city</option>
                                <option value="Makkah">Makkah</option>
                                <option value="Madinah">Madinah</option>
                            </select>
                        </div>
                        <Input label="Hotel Name" {...form.register('hotel_name', { required: true })} placeholder="e.g. Hilton Makkah" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Check In" type="date" {...form.register('check_in')} />
                        <Input label="Check Out" type="date" {...form.register('check_out')} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Room Count</p>
                        <div className="grid grid-cols-4 gap-3">
                            <Input label="DBL" type="number" min="0" {...form.register('room_dbl')} />
                            <Input label="TRPL" type="number" min="0" {...form.register('room_trpl')} />
                            <Input label="QUAD" type="number" min="0" {...form.register('room_quad')} />
                            <Input label="QUINT" type="number" min="0" {...form.register('room_quint')} />
                        </div>
                    </div>
                    <Input label="Reservation No." {...form.register('reservation_no')} placeholder="Optional" />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={form.formState.isSubmitting}>{editingHotel ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Hotels;
