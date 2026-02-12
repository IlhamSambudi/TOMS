import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Plane } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import DataTable from '../components/ui/DataTable';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/Modal';
import flightService from '../services/flightService';

const schema = z.object({
    airline: z.string().min(1, 'Required'),
    flight_number: z.string().min(1, 'Required'),
    origin: z.string().min(1, 'Required'),
    destination: z.string().min(1, 'Required'),
    scheduled_etd: z.string().optional(),
    scheduled_eta: z.string().optional(),
});

const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editFlight, setEditFlight] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

    const fetchData = async () => {
        try {
            const data = await flightService.getAll();
            setFlights(Array.isArray(data) ? data : []);
        } catch (e) { toast.error('Failed to load flights'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const onSubmit = async (data) => {
        try {
            if (editFlight) {
                await flightService.update(editFlight.id, data);
                toast.success('Flight updated');
            } else {
                await flightService.create(data);
                toast.success('Flight created');
            }
            setModalOpen(false); setEditFlight(null); reset(); fetchData();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    const openEdit = (f) => {
        setEditFlight(f);
        reset({
            airline: f.airline, flight_number: f.flight_number, origin: f.origin, destination: f.destination,
            scheduled_etd: f.scheduled_etd || '', scheduled_eta: f.scheduled_eta || ''
        });
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditFlight(null);
        reset({ airline: '', flight_number: '', origin: '', destination: '', scheduled_etd: '', scheduled_eta: '' });
        setModalOpen(true);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try { await flightService.delete(deleteTarget.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); }
        catch (e) { toast.error(e.message || 'Failed'); }
        finally { setDeleting(false); }
    };

    const filtered = flights.filter(f => {
        const q = search.toLowerCase();
        return f.airline?.toLowerCase().includes(q) || f.flight_number?.toLowerCase().includes(q) ||
            f.origin?.toLowerCase().includes(q) || f.destination?.toLowerCase().includes(q);
    });

    const columns = [
        { key: 'airline', label: 'Airline', render: r => <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.airline}</span> },
        { key: 'flight_number', label: 'Flight #', render: r => <span style={{ color: 'var(--text-secondary)' }}>{r.flight_number}</span> },
        { key: 'origin', label: 'Origin', render: r => <span style={{ color: 'var(--text-secondary)' }}>{r.origin}</span> },
        { key: 'destination', label: 'Destination', render: r => <span style={{ color: 'var(--text-secondary)' }}>{r.destination}</span> },
        { key: 'etd', label: 'ETD', render: r => <span style={{ color: 'var(--text-muted)' }}>{r.scheduled_etd?.substring(0, 5) || '—'}</span> },
        { key: 'eta', label: 'ETA', render: r => <span style={{ color: 'var(--text-muted)' }}>{r.scheduled_eta?.substring(0, 5) || '—'}</span> },
        {
            key: 'actions', label: '', render: (r, ctx) => (
                <DataTable.ActionMenu rowId={r.id} openMenu={ctx.openMenu} setOpenMenu={ctx.setOpenMenu} actions={[
                    { label: 'Edit', icon: Pencil, onClick: () => openEdit(r) },
                    { label: 'Delete', icon: Trash2, danger: true, onClick: () => setDeleteTarget(r) },
                ]} />
            )
        },
    ];

    if (loading) return <div><PageHeader title="Flights" /><Skeleton.Table rows={5} cols={6} /></div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Flights" subtitle={`${flights.length} flight templates`}>
                <Button icon={Plus} onClick={openCreate}>Add Flight</Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filtered}
                emptyState={<EmptyState title="No flight templates" description="Add reusable flight definitions." icon={Plane} />}
                filters={
                    <div className="flex items-center gap-3 max-w-md">
                        <div className="flex-1">
                            <Input
                                startIcon={Search}
                                placeholder="Search flights..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-slate-50 border-transparent focus:bg-white"
                            />
                        </div>
                    </div>
                }
            />

            <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditFlight(null); }} title={editFlight ? 'Edit Flight' : 'Add Flight'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Airline" {...register('airline')} error={errors.airline?.message} placeholder="e.g. Saudia" />
                        <Input label="Flight Number" {...register('flight_number')} error={errors.flight_number?.message} placeholder="SV-123" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Origin" {...register('origin')} error={errors.origin?.message} placeholder="CGK" />
                        <Input label="Destination" {...register('destination')} error={errors.destination?.message} placeholder="JED" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Scheduled ETD" type="time" {...register('scheduled_etd')} />
                        <Input label="Scheduled ETA" type="time" {...register('scheduled_eta')} />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => { setModalOpen(false); setEditFlight(null); }}>Cancel</Button>
                        <Button type="submit" loading={isSubmitting}>{editFlight ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Delete Flight" message={`Delete "${deleteTarget?.airline} ${deleteTarget?.flight_number}"?`} loading={deleting} />
        </div>
    );
};

export default Flights;
