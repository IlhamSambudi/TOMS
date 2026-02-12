import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plane, Bus, UserCheck, FileText, Eye, CalendarDays, Users, Plus, Pencil, Trash2, Clock, X, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/Modal';
import groupService from '../services/groupService';
import groupFlightSegmentService from '../services/groupFlightSegmentService';
import flightService from '../services/flightService';
import transportService from '../services/transportService';
import assignmentService from '../services/assignmentService';

const tabs = [
    { key: 'overview', label: 'Overview', icon: Eye },
    { key: 'flights', label: 'Flights', icon: Plane },
    { key: 'transport', label: 'Transport', icon: Bus },
    { key: 'team', label: 'Team Assignment', icon: UserCheck },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'notes', label: 'Notes', icon: FileText },
];

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Flights
    const [segments, setSegments] = useState([]);
    const [flights, setFlights] = useState([]);
    const [flightModal, setFlightModal] = useState(false);
    const [editSegment, setEditSegment] = useState(null);
    const flightForm = useForm();

    // Transport
    const [transports, setTransports] = useState([]);
    const [transportModal, setTransportModal] = useState(false);
    const [editTransport, setEditTransport] = useState(null);
    const transportForm = useForm();

    // Team
    const [tourLeaders, setTourLeaders] = useState([]);
    const [muthawifs, setMuthawifs] = useState([]);
    const [allTourLeaders, setAllTourLeaders] = useState([]);
    const [allMuthawifs, setAllMuthawifs] = useState([]);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState('');

    // Notes
    const [notesEditing, setNotesEditing] = useState(false);
    const [notesValue, setNotesValue] = useState('');

    const fetchGroup = useCallback(async () => {
        try {
            const data = await groupService.getById(id);
            setGroup(data);
            setNotesValue(data?.notes || '');
        } catch (e) {
            toast.error('Failed to load group');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    const fetchFlights = useCallback(async () => {
        try {
            const [segs, fts] = await Promise.all([
                groupFlightSegmentService.getByGroup(id),
                flightService.getAll()
            ]);
            setSegments(Array.isArray(segs) ? segs : []);
            setFlights(Array.isArray(fts) ? fts : []);
        } catch (e) { console.error(e); }
    }, [id]);

    const fetchTransports = useCallback(async () => {
        try {
            const data = await transportService.getByGroup(id);
            setTransports(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
    }, [id]);

    const fetchTeam = useCallback(async () => {
        try {
            const [tl, mt, allTl, allMt] = await Promise.all([
                assignmentService.getTourLeaders(id),
                assignmentService.getMuthawifs(id),
                assignmentService.getAllTourLeaders(),
                assignmentService.getAllMuthawifs(),
            ]);
            setTourLeaders(Array.isArray(tl) ? tl : []);
            setMuthawifs(Array.isArray(mt) ? mt : []);
            setAllTourLeaders(Array.isArray(allTl) ? allTl : []);
            setAllMuthawifs(Array.isArray(allMt) ? allMt : []);
        } catch (e) { console.error(e); }
    }, [id]);

    useEffect(() => { fetchGroup(); }, [fetchGroup]);
    useEffect(() => { if (activeTab === 'flights') fetchFlights(); }, [activeTab, fetchFlights]);
    useEffect(() => { if (activeTab === 'transport') fetchTransports(); }, [activeTab, fetchTransports]);
    useEffect(() => { if (activeTab === 'team') fetchTeam(); }, [activeTab, fetchTeam]);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const formatTime = (t) => t ? t.substring(0, 5) : '—';

    /* ── Flight CRUD ── */
    const openFlightModal = (seg = null) => {
        setEditSegment(seg);
        if (seg) {
            flightForm.reset({
                flight_master_id: seg.flight_master_id,
                flight_date: seg.flight_date?.split('T')[0],
                segment_order: seg.segment_order,
                override_etd: seg.override_etd || '',
                override_eta: seg.override_eta || '',
                remarks: seg.remarks || '',
            });
        } else {
            flightForm.reset({ flight_master_id: '', flight_date: '', segment_order: segments.length + 1, override_etd: '', override_eta: '', remarks: '' });
        }
        setFlightModal(true);
    };

    const submitFlight = async (data) => {
        try {
            if (editSegment) {
                await groupFlightSegmentService.update(id, editSegment.id, data);
                toast.success('Segment updated');
            } else {
                await groupFlightSegmentService.create(id, data);
                toast.success('Segment added');
            }
            setFlightModal(false);
            fetchFlights();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    /* ── Transport CRUD ── */
    const openTransportModal = (t = null) => {
        setEditTransport(t);
        if (t) {
            transportForm.reset({
                provider_name: t.provider_name, vehicle_type: t.vehicle_type, route: t.route,
                journey_date: t.journey_date?.split('T')[0],
                pickup_location: t.pickup_location || '', drop_location: t.drop_location || '',
                pax_count: t.pax_count || '', notes: t.notes || '',
            });
        } else {
            transportForm.reset({ provider_name: '', vehicle_type: '', route: '', journey_date: '', pickup_location: '', drop_location: '', pax_count: '', notes: '' });
        }
        setTransportModal(true);
    };

    const submitTransport = async (data) => {
        try {
            if (editTransport) {
                await transportService.update(id, editTransport.id, data);
                toast.success('Transport updated');
            } else {
                await transportService.create(id, data);
                toast.success('Transport created');
            }
            setTransportModal(false);
            fetchTransports();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    /* ── Team Actions ── */
    const assignStaff = async (type, staffId) => {
        try {
            if (type === 'tl') { await assignmentService.assignTourLeader(id, staffId); toast.success('Tour leader assigned'); }
            else { await assignmentService.assignMuthawif(id, staffId); toast.success('Muthawif assigned'); }
            fetchTeam();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    const unassignStaff = async (type, staffId) => {
        try {
            if (type === 'tl') { await assignmentService.unassignTourLeader(id, staffId); toast.success('Unassigned'); }
            else { await assignmentService.unassignMuthawif(id, staffId); toast.success('Unassigned'); }
            fetchTeam();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    /* ── Delete handler ── */
    const handleDelete = async () => {
        try {
            if (deleteType === 'segment') { await groupFlightSegmentService.delete(id, deleteTarget.id); fetchFlights(); }
            if (deleteType === 'transport') { await transportService.delete(id, deleteTarget.id); fetchTransports(); }
            toast.success('Deleted');
            setDeleteTarget(null);
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    /* ── Save notes ── */
    const saveNotes = async () => {
        try {
            await groupService.update(id, { ...group, notes: notesValue });
            toast.success('Notes saved');
            setNotesEditing(false);
            fetchGroup();
        } catch (e) { toast.error('Failed'); }
    };

    if (loading) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3"><div className="skeleton h-4 w-32 rounded" /></div>
            <Skeleton.Card />
        </div>
    );

    if (!group) return <EmptyState title="Group not found" />;

    const status = StatusBadge.fromGroup(group);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <button onClick={() => navigate('/groups')} className="mt-1 p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{group.group_code}</h1>
                        <Badge variant="primary">{group.program_type}</Badge>
                        <StatusBadge status={status} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatDate(group.departure_date)}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {group.total_pax} pax</span>
                        {group.handling_company_name && <span>{group.handling_company_name}</span>}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border-light)' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-colors relative"
                        style={{ color: activeTab === t.key ? 'var(--accent)' : 'var(--text-muted)' }}>
                        <t.icon size={14} />
                        {t.label}
                        {activeTab === t.key && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--accent)' }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="mt-8">
                    {activeTab === 'overview' && <OverviewTab group={group} formatDate={formatDate} />}
                    {activeTab === 'flights' && <FlightsTab segments={segments} flights={flights} openModal={openFlightModal}
                        onDelete={s => { setDeleteTarget(s); setDeleteType('segment'); }} formatDate={formatDate} formatTime={formatTime} />}
                    {activeTab === 'transport' && <TransportTab transports={transports} openModal={openTransportModal}
                        onDelete={t => { setDeleteTarget(t); setDeleteType('transport'); }} formatDate={formatDate} />}
                    {activeTab === 'team' && <TeamTab tourLeaders={tourLeaders} muthawifs={muthawifs} allTourLeaders={allTourLeaders}
                        allMuthawifs={allMuthawifs} onAssign={assignStaff} onUnassign={unassignStaff} />}
                    {activeTab === 'documents' && <DocumentsTab />}
                    {activeTab === 'notes' && <NotesTab notes={notesValue} editing={notesEditing} setEditing={setNotesEditing}
                        value={notesValue} onChange={setNotesValue} onSave={saveNotes} />}
                </motion.div>
            </AnimatePresence>

            {/* Flight Modal */}
            <Modal isOpen={flightModal} onClose={() => setFlightModal(false)} title={editSegment ? 'Edit Segment' : 'Add Flight Segment'}>
                <form onSubmit={flightForm.handleSubmit(submitFlight)} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Flight Template</label>
                        <select {...flightForm.register('flight_master_id', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                            style={{ border: '1px solid var(--border)', outline: 'none' }}>
                            <option value="">Select flight</option>
                            {flights.map(f => <option key={f.id} value={f.id}>{f.airline} {f.flight_number} — {f.origin}→{f.destination}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Flight Date" type="date" {...flightForm.register('flight_date', { required: true })} />
                        <Input label="Segment Order" type="number" {...flightForm.register('segment_order', { required: true })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Override ETD" type="time" {...flightForm.register('override_etd')} />
                        <Input label="Override ETA" type="time" {...flightForm.register('override_eta')} />
                    </div>
                    <Input label="Remarks" {...flightForm.register('remarks')} placeholder="Optional" />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setFlightModal(false)}>Cancel</Button>
                        <Button type="submit" loading={flightForm.formState.isSubmitting}>{editSegment ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Transport Modal */}
            <Modal isOpen={transportModal} onClose={() => setTransportModal(false)} title={editTransport ? 'Edit Transport' : 'Add Transport'}>
                <form onSubmit={transportForm.handleSubmit(submitTransport)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Provider" {...transportForm.register('provider_name', { required: true })} placeholder="Vendor name" />
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Vehicle Type</label>
                            <select {...transportForm.register('vehicle_type', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select</option>
                                <option value="Bus">Bus</option>
                                <option value="Coaster">Coaster</option>
                                <option value="Van">Van</option>
                                <option value="Sedan">Sedan</option>
                            </select>
                        </div>
                    </div>
                    <Input label="Route" {...transportForm.register('route', { required: true })} placeholder="e.g. Jeddah Airport → Hotel" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Pickup Location" {...transportForm.register('pickup_location')} placeholder="Optional" />
                        <Input label="Drop Location" {...transportForm.register('drop_location')} placeholder="Optional" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Journey Date" type="date" {...transportForm.register('journey_date', { required: true })} />
                        <Input label="Pax Count" type="number" {...transportForm.register('pax_count')} />
                    </div>
                    <Input label="Notes" {...transportForm.register('notes')} placeholder="Optional" />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setTransportModal(false)}>Cancel</Button>
                        <Button type="submit" loading={transportForm.formState.isSubmitting}>{editTransport ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete"
                message="This action cannot be undone." onConfirm={handleDelete} />
        </div>
    );
};

/* ── Overview Tab ── */
const OverviewTab = ({ group, formatDate }) => {
    const infoItems = [
        { label: 'Group Code', value: group.group_code },
        { label: 'Program', value: group.program_type },
        { label: 'Departure', value: formatDate(group.departure_date) },
        { label: 'Total Pax', value: group.total_pax },
        { label: 'Handling Company', value: group.handling_company_name || '—' },
        { label: 'Created', value: formatDate(group.created_at) },
    ];

    return (
        <Card>
            <Card.Header><Card.Title>Group Information</Card.Title></Card.Header>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
                {infoItems.map(i => (
                    <div key={i.label}>
                        <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-placeholder)' }}>{i.label}</p>
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{i.value}</p>
                    </div>
                ))}
            </div>
            {group.notes && (
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-placeholder)' }}>Notes</p>
                    <p className="text-[13px]" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{group.notes}</p>
                </div>
            )}
        </Card>
    );
};

/* ── Flights Tab ── */
const FlightsTab = ({ segments, flights, openModal, onDelete, formatDate, formatTime }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Flight Itinerary ({segments.length} segments)</h3>
            <Button size="sm" icon={Plus} onClick={() => openModal()}>Add Segment</Button>
        </div>
        {segments.length === 0 ? (
            <EmptyState title="No flight segments" description="Build the itinerary by adding flight segments." icon={Plane} />
        ) : (
            <div className="space-y-2.5">
                {segments.map((seg, i) => (
                    <motion.div key={seg.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Card className="group">
                            <div className="flex items-center gap-4">
                                {/* Segment number */}
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                                    {seg.segment_order}
                                </div>
                                {/* Flight info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{seg.airline} {seg.flight_number}</span>
                                        <Badge variant="secondary">{seg.origin} → {seg.destination}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                        <span>{formatDate(seg.flight_date)}</span>
                                        <span>ETD {formatTime(seg.override_etd || seg.scheduled_etd)}</span>
                                        <span>ETA {formatTime(seg.override_eta || seg.scheduled_eta)}</span>
                                        {seg.remarks && <span>· {seg.remarks}</span>}
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); openModal(seg); }} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <Pencil size={13} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(seg); }} className="p-1.5 rounded-lg" style={{ color: 'var(--danger)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        )}
    </div>
);

/* ── Transport Tab ── */
const TransportTab = ({ transports, openModal, onDelete, formatDate }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Transport ({transports.length})</h3>
            <Button size="sm" icon={Plus} onClick={() => openModal()}>Add Transport</Button>
        </div>
        {transports.length === 0 ? (
            <EmptyState title="No transport scheduled" description="Add vehicle arrangements for this group." icon={Bus} />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {transports.map((t, i) => (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Card className="group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary">{t.vehicle_type || 'Vehicle'}</Badge>
                                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t.provider_name}</span>
                                    </div>
                                    <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t.route}</p>
                                    <div className="flex items-center gap-2 mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                        <span>{formatDate(t.journey_date)}</span>
                                        {t.pax_count && <span>· {t.pax_count} pax</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(t)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <Pencil size={13} />
                                    </button>
                                    <button onClick={() => onDelete(t)} className="p-1.5 rounded-lg" style={{ color: 'var(--danger)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        )}
    </div>
);

/* ── Team Tab ── */
const TeamTab = ({ tourLeaders, muthawifs, allTourLeaders, allMuthawifs, onAssign, onUnassign }) => {
    const assignedTlIds = new Set(tourLeaders.map(t => t.id));
    const assignedMtIds = new Set(muthawifs.map(m => m.id));
    const availableTl = allTourLeaders.filter(t => !assignedTlIds.has(t.id));
    const availableMt = allMuthawifs.filter(m => !assignedMtIds.has(m.id));

    const StaffCard = ({ person, role, onRemove }) => (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white" style={{ border: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    {person.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{person.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{person.phone || '—'}</p>
                </div>
            </div>
            <button onClick={onRemove} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--danger)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={14} />
            </button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tour Leaders */}
            <Card>
                <Card.Header><Card.Title>Tour Leaders</Card.Title></Card.Header>
                <div className="space-y-2">
                    {tourLeaders.map(t => <StaffCard key={t.id} person={t} role="tl" onRemove={() => onUnassign('tl', t.id)} />)}
                    {tourLeaders.length === 0 && <p className="text-xs py-2" style={{ color: 'var(--text-placeholder)' }}>No tour leaders assigned.</p>}
                </div>
                {availableTl.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                        <select onChange={e => { if (e.target.value) { onAssign('tl', e.target.value); e.target.value = ''; } }}
                            className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] bg-white"
                            style={{ border: '1px solid var(--border)', outline: 'none', color: 'var(--text-secondary)' }}>
                            <option value="">+ Assign tour leader</option>
                            {availableTl.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                )}
            </Card>

            {/* Muthawifs */}
            <Card>
                <Card.Header><Card.Title>Muthawifs</Card.Title></Card.Header>
                <div className="space-y-2">
                    {muthawifs.map(m => <StaffCard key={m.id} person={m} role="mt" onRemove={() => onUnassign('mt', m.id)} />)}
                    {muthawifs.length === 0 && <p className="text-xs py-2" style={{ color: 'var(--text-placeholder)' }}>No muthawifs assigned.</p>}
                </div>
                {availableMt.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                        <select onChange={e => { if (e.target.value) { onAssign('mt', e.target.value); e.target.value = ''; } }}
                            className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] bg-white"
                            style={{ border: '1px solid var(--border)', outline: 'none', color: 'var(--text-secondary)' }}>
                            <option value="">+ Assign muthawif</option>
                            {availableMt.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                )}
            </Card>
        </div>
    );
};

/* ── Documents Tab (Placeholder) ── */
const DocumentsTab = () => (
    <EmptyState title="Documents" description="Document management will be available in a future release." icon={FileText} />
);

/* ── Notes Tab ── */
const NotesTab = ({ notes, editing, setEditing, value, onChange, onSave }) => (
    <Card>
        <Card.Header>
            <Card.Title>Group Notes</Card.Title>
            {!editing ? (
                <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(true)}>Edit</Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button size="sm" onClick={onSave}>Save</Button>
                </div>
            )}
        </Card.Header>
        {editing ? (
            <textarea value={value} onChange={e => onChange(e.target.value)} rows={8}
                className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-[13px] bg-white resize-none"
                style={{ border: '1px solid var(--border)', outline: 'none', lineHeight: '1.8' }} autoFocus />
        ) : (
            <p className="text-[13px] whitespace-pre-wrap" style={{ color: notes ? 'var(--text-secondary)' : 'var(--text-placeholder)', lineHeight: '1.8' }}>
                {notes || 'No notes yet.'}
            </p>
        )}
    </Card>
);

export default GroupDetail;
