import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, MapPin, Search, Edit2, CheckCircle2, XCircle, Clock, Plane, Bus, Hotel, Train, FileText, ChevronRight, Phone, Mail, FileCheck, AlertCircle, Plus, Trash2, Edit, Eye, BookOpen, ArrowLeft, Pencil, CalendarDays, X, Printer, Trash, UserCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/Modal';
import groupService from '../services/groupService';
import groupFlightSegmentService from '../services/groupFlightSegmentService';
import flightService from '../services/flightService';
import transportService from '../services/transportService';
import assignmentService from '../services/assignmentService';
import hotelService from '../services/hotelService';
import trainService from '../services/trainService';
import rawdahService from '../services/rawdahService';

const tabs = [
    { key: 'overview', label: 'Overview', icon: Eye },
    { key: 'team', label: 'Team Assignment', icon: UserCheck },
    { key: 'flights', label: 'Flights', icon: Plane },
    { key: 'transport', label: 'Transport', icon: Bus },
    { key: 'hotels', label: 'Hotels', icon: Hotel },
    { key: 'trains', label: 'Trains', icon: Train },
    { key: 'rawdah', label: 'Rawdah', icon: BookOpen },
    { key: 'documents', label: 'Documents', icon: FileText },
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
    const [selectedAirline, setSelectedAirline] = useState(null);

    // Filter flights based on selected airline
    const airlineOptions = Array.from(new Set(flights.map(f => f.airline))).filter(Boolean);
    const filteredFlights = flights.filter(f => f.airline === selectedAirline);
    const [editSegment, setEditSegment] = useState(null);
    const flightForm = useForm();

    // Transport
    const [transports, setTransports] = useState([]);
    const [transportModal, setTransportModal] = useState(false);
    const [editTransport, setEditTransport] = useState(null);
    const transportForm = useForm();

    // Hotels
    const [hotels, setHotels] = useState([]);
    const [hotelModal, setHotelModal] = useState(false);
    const [editHotel, setEditHotel] = useState(null);
    const hotelForm = useForm();

    // Trains
    const [trains, setTrains] = useState([]);
    const [trainModal, setTrainModal] = useState(false);
    const [editTrain, setEditTrain] = useState(null);
    const trainForm = useForm();

    // Rawdah
    const [rawdahData, setRawdahData] = useState(null);
    const [rawdahModal, setRawdahModal] = useState(false);
    const rawdahForm = useForm();

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
        } catch {
            toast.error('Failed to load group');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        try {
            await groupService.updateStatus(id, newStatus);
            toast.success(`Status updated to ${newStatus}`);
            fetchGroup();
        } catch (e) {
            toast.error(e.message || 'Failed to update status');
        }
    };

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
    useEffect(() => {
        if (activeTab === 'hotels') {
            hotelService.getByGroup(id).then(d => setHotels(Array.isArray(d) ? d : [])).catch(console.error);
        }
    }, [activeTab, id]);
    useEffect(() => {
        if (activeTab === 'trains') {
            trainService.getByGroup(id).then(d => setTrains(Array.isArray(d) ? d : [])).catch(console.error);
        }
    }, [activeTab, id]);
    useEffect(() => {
        if (activeTab === 'rawdah') {
            rawdahService.getByGroup(id).then(d => setRawdahData(d)).catch(console.error);
        }
    }, [activeTab, id]);

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
            // Auto-select the airline for this segment if editing
            const matchedFlight = flights.find(f => f.id === seg.flight_master_id);
            if (matchedFlight) {
                setSelectedAirline(matchedFlight.airline);
            }
        } else {
            flightForm.reset({ flight_master_id: '', flight_date: '', segment_order: segments.length + 1, override_etd: '', override_eta: '', remarks: '' });
            setSelectedAirline(null);
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
                pax_count: t.pax_count || '', departure_time: t.departure_time || '',
            });
        } else {
            transportForm.reset({ provider_name: '', vehicle_type: '', route: '', journey_date: '', pickup_location: '', drop_location: '', pax_count: '', departure_time: '' });
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

    /* ── Hotel CRUD ── */
    const openHotelModal = (h = null) => {
        setEditHotel(h);
        hotelForm.reset(h ? {
            city: h.city, hotel_name: h.hotel_name,
            check_in: h.check_in?.split('T')[0] || '',
            check_out: h.check_out?.split('T')[0] || '',
            room_dbl: h.room_dbl || 0, room_trpl: h.room_trpl || 0,
            room_quad: h.room_quad || 0, room_quint: h.room_quint || 0,
            reservation_no: h.reservation_no || '',
        } : { city: '', hotel_name: '', check_in: '', check_out: '', room_dbl: 0, room_trpl: 0, room_quad: 0, room_quint: 0, reservation_no: '' });
        setHotelModal(true);
    };

    const submitHotel = async (data) => {
        try {
            if (editHotel) {
                await hotelService.update(id, editHotel.id, data);
                toast.success('Hotel updated');
            } else {
                await hotelService.create(id, data);
                toast.success('Hotel added');
            }
            setHotelModal(false);
            hotelService.getByGroup(id).then(d => setHotels(Array.isArray(d) ? d : []));
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    /* ── Train CRUD ── */
    const openTrainModal = (t = null) => {
        setEditTrain(t);
        trainForm.reset(t ? {
            train_date: t.train_date?.split('T')[0] || '',
            from_station: t.from_station || '',
            to_station: t.to_station || '',
            departure_time: t.departure_time || '',
            total_hajj: t.total_hajj || '',
            remarks: t.remarks || '',
        } : { train_date: '', from_station: '', to_station: '', departure_time: '', total_hajj: '', remarks: '' });
        setTrainModal(true);
    };

    const submitTrain = async (data) => {
        try {
            if (editTrain) {
                await trainService.update(id, editTrain.id, data);
                toast.success('Train reservation updated');
            } else {
                await trainService.create(id, data);
                toast.success('Train reservation added');
            }
            setTrainModal(false);
            trainService.getByGroup(id).then(d => setTrains(Array.isArray(d) ? d : []));
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    /* ── Rawdah CRUD ── */
    const openRawdahModal = () => {
        rawdahForm.reset(rawdahData ? {
            men_date: rawdahData.men_date?.split('T')[0] || '',
            men_time: rawdahData.men_time || '',
            men_pax: rawdahData.men_pax || '',
            women_date: rawdahData.women_date?.split('T')[0] || '',
            women_time: rawdahData.women_time || '',
            women_pax: rawdahData.women_pax || ''
        } : { men_date: '', men_time: '', men_pax: '', women_date: '', women_time: '', women_pax: '' });
        setRawdahModal(true);
    };

    const submitRawdah = async (data) => {
        try {
            await rawdahService.upsert(id, data);
            toast.success('Rawdah permits updated');
            setRawdahModal(false);
            const updated = await rawdahService.getByGroup(id);
            setRawdahData(updated);
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
            if (deleteType === 'hotel') { await hotelService.delete(id, deleteTarget.id); hotelService.getByGroup(id).then(d => setHotels(Array.isArray(d) ? d : [])); }
            if (deleteType === 'train') { await trainService.delete(id, deleteTarget.id); trainService.getByGroup(id).then(d => setTrains(Array.isArray(d) ? d : [])); }
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
        } catch { toast.error('Failed'); }
    };

    if (loading) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3"><div className="skeleton h-4 w-32 rounded" /></div>
            <Skeleton.Card />
        </div>
    );

    if (!group) return <EmptyState title="Group not found" />;

    const currentStatus = group.status || 'PREPARATION';
    const STATUS_STEPS = [
        { key: 'PREPARATION', label: 'Preparation', color: '#B45309', bg: '#FFFBEB', dot: '#F59E0B' },
        { key: 'DEPARTURE', label: 'Departure', color: '#1D4ED8', bg: '#EFF6FF', dot: '#3B82F6' },
        { key: 'ARRIVAL', label: 'Arrival', color: '#047857', bg: '#ECFDF5', dot: '#10B981' },
    ];
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === currentStatus);

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
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatDate(group.departure_date)}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {group.total_pax} pax</span>
                        {group.handling_company_name && <span>{group.handling_company_name}</span>}
                    </div>

                    {/* ── Status Stepper ── */}
                    <div className="mt-4 flex items-center gap-0">
                        {STATUS_STEPS.map((step, idx) => {
                            const isDone = idx < currentIdx;
                            const isCurrent = idx === currentIdx;
                            const isFuture = idx > currentIdx;
                            return (
                                <div key={step.key} className="flex items-center">
                                    <button
                                        onClick={() => handleStatusChange(step.key)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-[12px] font-semibold hover:bg-slate-50"
                                        style={{
                                            background: isCurrent ? step.bg : isDone ? '#F8FAFC' : 'transparent',
                                            color: isCurrent ? step.color : isDone ? '#64748B' : '#94A3B8',
                                            border: isCurrent ? `1.5px solid ${step.dot}` : '1.5px solid transparent',
                                            cursor: 'pointer',
                                            opacity: 1,
                                        }}
                                    >
                                        <span
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors"
                                            style={{
                                                background: isCurrent ? step.dot : isDone ? '#10B981' : '#CBD5E1',
                                                color: 'white'
                                            }}
                                        >
                                            {isDone ? '✓' : idx + 1}
                                        </span>
                                        {step.label}
                                    </button>
                                    {idx < STATUS_STEPS.length - 1 && (
                                        <div className="w-6 h-[2px] mx-0.5 rounded-full"
                                            style={{ background: idx < currentIdx ? '#10B981' : '#E2E8F0' }} />
                                    )}
                                </div>
                            );
                        })}
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
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <OverviewTab group={group} formatDate={formatDate} />
                            <NotesTab notes={notesValue} editing={notesEditing} setEditing={setNotesEditing}
                                value={notesValue} onChange={setNotesValue} onSave={saveNotes} />
                        </div>
                    )}
                    {activeTab === 'team' && <TeamTab tourLeaders={tourLeaders} muthawifs={muthawifs} allTourLeaders={allTourLeaders}
                        allMuthawifs={allMuthawifs} onAssign={assignStaff} onUnassign={unassignStaff} />}
                    {activeTab === 'flights' && <FlightsTab segments={segments} flights={flights} openModal={openFlightModal}
                        onDelete={s => { setDeleteTarget(s); setDeleteType('segment'); }} formatDate={formatDate} formatTime={formatTime} />}
                    {activeTab === 'transport' && <TransportTab transports={transports} openModal={openTransportModal}
                        onDelete={t => { setDeleteTarget(t); setDeleteType('transport'); }} formatDate={formatDate} />}
                    {activeTab === 'hotels' && <HotelTab hotels={hotels} openModal={openHotelModal}
                        onDelete={h => { setDeleteTarget(h); setDeleteType('hotel'); }} formatDate={formatDate} />}
                    {activeTab === 'trains' && <TrainTab trains={trains} openModal={openTrainModal}
                        onDelete={t => { setDeleteTarget(t); setDeleteType('train'); }} formatDate={formatDate} formatTime={formatTime} />}
                    {activeTab === 'rawdah' && <RawdahTab data={rawdahData} openModal={openRawdahModal} formatDate={formatDate} />}
                    {activeTab === 'documents' && <DocumentsTab groupId={id} />}
                </motion.div>
            </AnimatePresence>

            {/* Flight Modal */}
            <Modal isOpen={flightModal} onClose={() => setFlightModal(false)} title={editSegment ? 'Edit Segment' : 'Add Flight Segment'}>
                {!selectedAirline ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Select Airline</label>
                        <div className="grid grid-cols-2 gap-3">
                            {airlineOptions.map(airline => {
                                const count = flights.filter(f => f.airline === airline).length;
                                return (
                                    <button
                                        key={airline}
                                        type="button"
                                        onClick={() => setSelectedAirline(airline)}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all hover:-translate-y-0.5"
                                        style={{
                                            borderColor: 'var(--border)',
                                            background: 'var(--bg-card)',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <Plane size={24} className="mb-2" style={{ color: 'var(--accent)' }} />
                                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{airline}</span>
                                        <span className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{count} templates</span>
                                    </button>
                                );
                            })}
                            {airlineOptions.length === 0 && (
                                <div className="col-span-2 text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                                    No flights available. Please add flights in Master Data first.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={flightForm.handleSubmit(submitFlight)} className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Airline: {selectedAirline}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedAirline(null);
                                    flightForm.setValue('flight_master_id', '');
                                }}
                                className="text-[12px] font-medium hover:underline flex items-center gap-1"
                                style={{ color: 'var(--accent)' }}
                            >
                                <ArrowLeft size={12} /> Change Airline
                            </button>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Flight Template</label>
                            <select {...flightForm.register('flight_master_id', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select flight</option>
                                {filteredFlights.map(f => <option key={f.id} value={f.id}>{f.flight_number} — {f.origin}→{f.destination}</option>)}
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
                )}
            </Modal>

            {/* Transport Modal */}
            <Modal isOpen={transportModal} onClose={() => setTransportModal(false)} title={editTransport ? 'Edit Transport' : 'Add Transport'}>
                <form onSubmit={transportForm.handleSubmit(submitTransport)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Provider Name</label>
                            <select {...transportForm.register('provider_name', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select provider</option>
                                <option value="Muasasah">Muasasah</option>
                                <option value="Handling">Handling</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Vehicle Type</label>
                            <select {...transportForm.register('vehicle_type', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select vehicle</option>
                                <option value="Bus">Bus</option>
                                <option value="Coaster">Coaster</option>
                                <option value="GMC">GMC</option>
                            </select>
                        </div>
                    </div>
                    <Input label="Route" {...transportForm.register('route', { required: true })} placeholder="e.g. City Tour Makkah, Pickup Airport" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Pickup Location</label>
                            <select {...transportForm.register('pickup_location')} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select location</option>
                                <option value="King Abdul Aziz Airport">King Abdul Aziz Airport</option>
                                <option value="Muhammad Prince Abdul Aziz Airport">Muhammad Prince Abdul Aziz Airport</option>
                                <option value="Hotel Makkah">Hotel Makkah</option>
                                <option value="Hotel Madinah">Hotel Madinah</option>
                                <option value="Train Station">Train Station</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Drop Location</label>
                            <select {...transportForm.register('drop_location')} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select location</option>
                                <option value="King Abdul Aziz Airport">King Abdul Aziz Airport</option>
                                <option value="Muhammad Prince Abdul Aziz Airport">Muhammad Prince Abdul Aziz Airport</option>
                                <option value="Hotel Makkah">Hotel Makkah</option>
                                <option value="Hotel Madinah">Hotel Madinah</option>
                                <option value="Train Station">Train Station</option>
                                <option value="City Tour Makkah">City Tour Makkah</option>
                                <option value="Madinah">City Tour Madinah</option>
                                <option value="Thaif">City Tour Thaif</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Journey Date" type="date" {...transportForm.register('journey_date', { required: true })} />
                        <Input label="Pax Count" type="number" {...transportForm.register('pax_count')} />
                    </div>
                    <Input label="Departure Time" type="time" {...transportForm.register('departure_time')} />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setTransportModal(false)}>Cancel</Button>
                        <Button type="submit" loading={transportForm.formState.isSubmitting}>{editTransport ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Hotel Modal */}
            <Modal isOpen={hotelModal} onClose={() => setHotelModal(false)} title={editHotel ? 'Edit Hotel' : 'Add Hotel'}>
                <form onSubmit={hotelForm.handleSubmit(submitHotel)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>City</label>
                            <select {...hotelForm.register('city', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select city</option>
                                <option value="Makkah">Makkah</option>
                                <option value="Madinah">Madinah</option>
                            </select>
                        </div>
                        <Input label="Hotel Name" {...hotelForm.register('hotel_name', { required: true })} placeholder="e.g. Hilton Makkah" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Check In" type="date" {...hotelForm.register('check_in')} />
                        <Input label="Check Out" type="date" {...hotelForm.register('check_out')} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Room Count</p>
                        <div className="grid grid-cols-4 gap-3">
                            <Input label="DBL" type="number" min="0" {...hotelForm.register('room_dbl')} />
                            <Input label="TRPL" type="number" min="0" {...hotelForm.register('room_trpl')} />
                            <Input label="QUAD" type="number" min="0" {...hotelForm.register('room_quad')} />
                            <Input label="QUINT" type="number" min="0" {...hotelForm.register('room_quint')} />
                        </div>
                    </div>
                    <Input label="Reservation No." {...hotelForm.register('reservation_no')} placeholder="Optional" />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setHotelModal(false)}>Cancel</Button>
                        <Button type="submit" loading={hotelForm.formState.isSubmitting}>{editHotel ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Train Modal */}
            <Modal isOpen={trainModal} onClose={() => setTrainModal(false)} title={editTrain ? 'Edit Train Reservation' : 'Add Train Reservation'}>
                <form onSubmit={trainForm.handleSubmit(submitTrain)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>From Station</label>
                            <select {...trainForm.register('from_station', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select station</option>
                                <option value="Makkah Station">Makkah Station</option>
                                <option value="Madinah Station">Madinah Station</option>
                                <option value="Jeddah Station">Jeddah Station</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>To Station</label>
                            <select {...trainForm.register('to_station', { required: true })} className="w-full px-3 py-2 rounded-[var(--radius-sm)] text-sm bg-white"
                                style={{ border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="">Select station</option>
                                <option value="Makkah Station">Makkah Station</option>
                                <option value="Madinah Station">Madinah Station</option>
                                <option value="Jeddah Station">Jeddah Station</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Train Date" type="date" {...trainForm.register('train_date')} />
                        <Input label="Departure Time" type="time" {...trainForm.register('departure_time')} />
                        <Input label="Total Hajj (pax)" type="number" min="0" {...trainForm.register('total_hajj')} />
                    </div>
                    <Input label="Remarks" {...trainForm.register('remarks')} placeholder="Optional" />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setTrainModal(false)}>Cancel</Button>
                        <Button type="submit" loading={trainForm.formState.isSubmitting}>{editTrain ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete"
                message="This action cannot be undone." onConfirm={handleDelete} />

            {/* Rawdah Modal */}
            <Modal isOpen={rawdahModal} onClose={() => setRawdahModal(false)} title="Edit Rawdah Permits">
                <form onSubmit={rawdahForm.handleSubmit(submitRawdah)} className="space-y-6">
                    {/* Men */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex justify-between border-b pb-2">
                            <span>Men / Laki-laki</span>
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="Date" type="date" {...rawdahForm.register('men_date')} />
                            <Input label="Time" placeholder="e.g. 13:30-17:30" {...rawdahForm.register('men_time')} />
                            <Input label="Total Pax" type="number" {...rawdahForm.register('men_pax')} />
                        </div>
                    </div>
                    {/* Women */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex justify-between border-b pb-2 mt-4">
                            <span>Women / Perempuan</span>
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="Date" type="date" {...rawdahForm.register('women_date')} />
                            <Input label="Time" placeholder="e.g. 06:00-10:00" {...rawdahForm.register('women_time')} />
                            <Input label="Total Pax" type="number" {...rawdahForm.register('women_pax')} />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="secondary" type="button" onClick={() => setRawdahModal(false)}>Cancel</Button>
                        <Button type="submit" loading={rawdahForm.formState.isSubmitting}>Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

/* ── Hotel Tab ── */
const HotelTab = ({ hotels, openModal, onDelete, formatDate }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Hotel Accommodation ({hotels.length})</h3>
            <Button size="sm" icon={Plus} onClick={() => openModal()}>Add Hotel</Button>
        </div>
        {hotels.length === 0 ? (
            <EmptyState title="No hotel added" description="Add hotel accommodation for this group." icon={Hotel} />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotels.map((h, i) => (
                    <motion.div key={h.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Card className="group">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="primary">{h.city}</Badge>
                                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{h.hotel_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                        <span>Check-in: {formatDate(h.check_in)}</span>
                                        <span>Check-out: {formatDate(h.check_out)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        {h.room_dbl > 0 && <Badge variant="secondary">DBL: {h.room_dbl}</Badge>}
                                        {h.room_trpl > 0 && <Badge variant="secondary">TRPL: {h.room_trpl}</Badge>}
                                        {h.room_quad > 0 && <Badge variant="secondary">QUAD: {h.room_quad}</Badge>}
                                        {h.room_quint > 0 && <Badge variant="secondary">QUINT: {h.room_quint}</Badge>}
                                        {h.reservation_no && <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Resv# {h.reservation_no}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(h)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <Pencil size={13} />
                                    </button>
                                    <button onClick={() => onDelete(h)} className="p-1.5 rounded-lg" style={{ color: 'var(--danger)' }}
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

/* ── Train Tab ── */
const TrainTab = ({ trains, openModal, onDelete, formatDate, formatTime }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Train Reservation ({trains.length})</h3>
            <Button size="sm" icon={Plus} onClick={() => openModal()}>Add Train</Button>
        </div>
        {trains.length === 0 ? (
            <EmptyState title="No train reservation" description="Add train reservations for this group." icon={Train} />
        ) : (
            <div className="space-y-2.5">
                {trains.map((t, i) => (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Card className="group">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                                    <Train size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            {t.from_station} → {t.to_station}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                        {t.train_date && <span>{formatDate(t.train_date)}</span>}
                                        {t.departure_time && <span>Depart {formatTime(t.departure_time)}</span>}
                                        {t.total_hajj && <span>· {t.total_hajj} pax</span>}
                                        {t.remarks && <span>· {t.remarks}</span>}
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

/* ── Overview Tab ── */
const OverviewTab = ({ group, formatDate }) => {
    const infoItems = [
        { label: 'Group Code', value: group.group_code },
        { label: 'Program', value: group.program_type },
        { label: 'Departure', value: formatDate(group.departure_date) },
        { label: 'Total Pax', value: group.total_pax },
        { label: 'Handling Company', value: group.handling_company_name || '—' },
        { label: 'Muasasah', value: group.muasasah || '—' },
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
const FlightsTab = ({ segments, openModal, onDelete, formatDate, formatTime }) => (
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
                                        {t.departure_time && (
                                            <>
                                                <span>·</span>
                                                <span className="flex items-center gap-1 font-medium text-slate-500">
                                                    <Clock size={10} />
                                                    {t.departure_time}
                                                </span>
                                            </>
                                        )}
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

    const StaffCard = ({ person, onRemove }) => (
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

/* ── Documents Tab ── */
const DocumentsTab = ({ groupId }) => {
    const printUrl = `/groups/${groupId}/print`;
    const embedUrl = `/groups/${groupId}/print?embed=true`;
    const handlePrint = () => {
        const iframe = document.getElementById('group-print-iframe');
        if (iframe) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } else {
            window.open(printUrl, '_blank');
        }
    };

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Group Itinerary Document</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Preview dan cetak dokumen itinerary grup</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                        style={{ background: '#f5c400', color: '#000', border: 'none', cursor: 'pointer' }}
                    >
                        <Printer size={13} />
                        Print / Save PDF
                    </button>
                    <a
                        href={printUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                        style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)', textDecoration: 'none' }}
                    >
                        <Eye size={13} />
                        Open in New Tab
                    </a>
                </div>
            </div>

            {/* iframe Preview — embed mode hides toolbar */}
            <div style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                background: '#e5e7eb',
                height: '75vh',
            }}>
                <iframe
                    id="group-print-iframe"
                    src={embedUrl}
                    title="Group Itinerary Preview"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </div>
        </div>
    );
};

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

/* ── Rawdah Tab ── */
const RawdahTab = ({ data, openModal, formatDate }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-4 py-2.5 rounded-xl shadow-sm transition-all" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <h3 className="text-sm font-semibold tracking-wider flex items-center gap-2">
                    <BookOpen size={16} style={{ color: 'var(--primary-soft)' }} /> FOR RAWDAH PERMITS
                </h3>
                <Button size="sm" onClick={() => openModal()} className="hover:scale-105 transition-transform" style={{ background: 'white', color: 'var(--primary)', border: 'none' }}>
                    Edit Permits
                </Button>
            </div>

            <Card padding={false} className="overflow-hidden border border-teal-100">
                <table className="w-full text-sm">
                    <thead className="uppercase text-xs font-bold" style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary-hover)' }}>
                        <tr>
                            <th className="px-6 py-3 text-center w-1/4 border-b border-teal-200"></th>
                            <th className="px-6 py-3 text-center w-1/4 border-b border-teal-200" style={{ borderLeft: '1px solid var(--border)' }}>Date</th>
                            <th className="px-6 py-3 text-center w-1/4 border-b border-teal-200" style={{ borderLeft: '1px solid var(--border)' }}>Time</th>
                            <th className="px-6 py-3 text-center w-1/4 border-b border-teal-200" style={{ borderLeft: '1px solid var(--border)' }}>Total Pax</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-teal-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-center text-slate-800 border-r border-slate-100">MEN</td>
                            <td className="px-6 py-4 font-medium text-center border-r border-slate-100">{data?.men_date ? formatDate(data.men_date) : '—'}</td>
                            <td className="px-6 py-4 font-medium text-center border-r border-slate-100">{data?.men_time || '—'}</td>
                            <td className="px-6 py-4 font-medium text-center">{data?.men_pax || '—'}</td>
                        </tr>
                        <tr className="hover:bg-teal-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-center text-slate-800 border-r border-slate-100">WOMEN</td>
                            <td className="px-6 py-4 font-medium text-center border-r border-slate-100">{data?.women_date ? formatDate(data.women_date) : '—'}</td>
                            <td className="px-6 py-4 font-medium text-center border-r border-slate-100">{data?.women_time || '—'}</td>
                            <td className="px-6 py-4 font-medium text-center">{data?.women_pax || '—'}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default GroupDetail;
