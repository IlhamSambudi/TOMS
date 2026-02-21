import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, CalendarDays, MapPin, Clock, ArrowRight,
    Bus, Hotel, Train, UserCheck, Plane, ArrowUpRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import groupService from '../services/groupService';
import transportService from '../services/transportService';
import hotelService from '../services/hotelService';
import trainService from '../services/trainService';
import assignmentService from '../services/assignmentService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Data states
    const [groups, setGroups] = useState([]);
    const [summary, setSummary] = useState(null);
    const [transportCount, setTransportCount] = useState(0);
    const [hotelCount, setHotelCount] = useState(0);
    const [trainCount, setTrainCount] = useState(0);
    const [tourLeaderCount, setTourLeaderCount] = useState(0);
    const [muthawifCount, setMuthawifCount] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [summaryRes, grpsRes, transRes, tlRes, mtRes] = await Promise.allSettled([
                    groupService.getOperationsSummary(),
                    groupService.getAll(),
                    transportService.getAll(),
                    assignmentService.getAllTourLeaders(),
                    assignmentService.getAllMuthawifs(),
                ]);

                const sum = summaryRes.status === 'fulfilled' ? summaryRes.value : null;
                setSummary(sum);

                const grps = grpsRes.status === 'fulfilled'
                    ? (Array.isArray(grpsRes.value) ? grpsRes.value : (grpsRes.value?.data || []))
                    : [];
                setGroups(grps);

                if (transRes.status === 'fulfilled') {
                    const t = Array.isArray(transRes.value) ? transRes.value : (transRes.value?.data || []);
                    setTransportCount(t.length);
                }

                if (tlRes.status === 'fulfilled') {
                    const tl = Array.isArray(tlRes.value) ? tlRes.value : (tlRes.value?.data || []);
                    setTourLeaderCount(tl.length);
                }

                if (mtRes.status === 'fulfilled') {
                    const mt = Array.isArray(mtRes.value) ? mtRes.value : (mtRes.value?.data || []);
                    setMuthawifCount(mt.length);
                }

                // Fetch hotels and trains per group (first 10 to avoid too many requests)
                if (grps.length > 0) {
                    const slice = grps.slice(0, 10);
                    const [hotelResults, trainResults] = await Promise.all([
                        Promise.allSettled(slice.map(g => hotelService.getByGroup(g.id))),
                        Promise.allSettled(slice.map(g => trainService.getByGroup(g.id))),
                    ]);
                    const totalHotels = hotelResults.reduce((acc, r) => {
                        if (r.status === 'fulfilled') {
                            const d = Array.isArray(r.value) ? r.value : (r.value?.data || []);
                            return acc + d.length;
                        }
                        return acc;
                    }, 0);
                    const totalTrains = trainResults.reduce((acc, r) => {
                        if (r.status === 'fulfilled') {
                            const d = Array.isArray(r.value) ? r.value : (r.value?.data || []);
                            return acc + d.length;
                        }
                        return acc;
                    }, 0);
                    setHotelCount(totalHotels);
                    setTrainCount(totalTrains);
                }
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const daysUntil = (date) => {
        if (!date) return '';
        const d = Math.ceil((new Date(date) - new Date()) / 86400000);
        if (d === 0) return 'Today';
        if (d === 1) return 'Tomorrow';
        if (d > 0) return `${d}d`;
        return `${Math.abs(d)}d ago`;
    };

    const statusColor = (s) => {
        const map = {
            'PREPARATION': { bg: '#FFFBEB', color: '#B45309' },
            'DEPARTURE': { bg: '#EFF6FF', color: '#1D4ED8' },
            'ARRIVAL': { bg: '#ECFDF5', color: '#047857' },
        };
        return map[s] || { bg: '#F0FDFA', color: '#0F766E' };
    };

    const totalGroups = groups.length;
    const activeGroups = summary?.in_saudi?.length || 0;
    const upcomingGroups = summary?.upcoming?.length || 0;
    const prepGroups = summary?.awaiting?.length || 0;

    if (loading) return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl skeleton" />)}
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-8 h-96 rounded-2xl skeleton" />
                <div className="col-span-12 xl:col-span-4 h-96 rounded-2xl skeleton" />
            </div>
        </div>
    );

    return (
        <>
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Dashboard
                    </h1>
                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Travel Operations Management — live overview
                    </p>
                </div>
                <button
                    onClick={() => navigate('/groups')}
                    className="flex items-center gap-1.5 text-[13px] font-semibold px-3 py-2 rounded-xl transition-all"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <Users size={14} /> Manage Groups <ArrowUpRight size={13} />
                </button>
            </div>

            {/* ── KPI Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Groups', value: totalGroups, icon: Users, accent: '#0F766E', light: '#F0FDFA', onClick: () => navigate('/groups') },
                    { label: 'In Saudi', value: activeGroups, icon: MapPin, accent: '#1D4ED8', light: '#EFF6FF', onClick: () => navigate('/groups') },
                    { label: 'Upcoming', value: upcomingGroups, icon: CalendarDays, accent: '#7C3AED', light: '#F5F3FF', onClick: () => navigate('/groups') },
                    { label: 'Preparation', value: prepGroups, icon: Clock, accent: '#B45309', light: '#FFFBEB', onClick: () => navigate('/groups') },
                ].map((m, i) => (
                    <div key={i} onClick={m.onClick}
                        className="rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md"
                        style={{ background: 'white', border: '1px solid var(--border)' }}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: m.light, color: m.accent }}>
                                <m.icon size={17} />
                            </div>
                            <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{m.value}</div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Resources Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                    { label: 'Transport', value: transportCount, icon: Bus, path: '/transport' },
                    { label: 'Hotels', value: hotelCount, icon: Hotel, path: '/hotels' },
                    { label: 'Trains', value: trainCount, icon: Train, path: '/trains' },
                    { label: 'Tour Leaders', value: tourLeaderCount, icon: UserCheck, path: '/tour-leaders' },
                    { label: 'Muthawifs', value: muthawifCount, icon: Users, path: '/muthawif' },
                ].map((r, i) => (
                    <div key={i} onClick={() => navigate(r.path)}
                        className="rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer transition-all hover:shadow-sm"
                        style={{ background: 'white', border: '1px solid var(--border)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                            <r.icon size={15} />
                        </div>
                        <div>
                            <div className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{r.value}</div>
                            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{r.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Two-Column ── */}
            <div className="grid grid-cols-12 gap-6">

                {/* Left — Upcoming Departures */}
                <div className="col-span-12 xl:col-span-7 flex flex-col gap-5">
                    <Card>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                Upcoming Departures
                            </h3>
                            <button onClick={() => navigate('/groups')}
                                className="text-[12px] font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
                                style={{ color: 'var(--accent)', background: 'var(--accent-light)' }}>
                                View All <ArrowRight size={12} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {summary?.upcoming?.slice(0, 6).map(item => (
                                <div key={item.id} onClick={() => navigate(`/groups/${item.id}`)}
                                    className="p-4.5 bg-white rounded-xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                                    style={{ border: '1px solid var(--border-light)' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="warning">UPCOMING</Badge>
                                        <span className="text-[11px] font-bold" style={{ color: 'var(--accent)' }}>
                                            {daysUntil(item.departure_date)}
                                        </span>
                                    </div>
                                    <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }} title={item.group_code}>
                                        {item.group_code}
                                    </p>
                                    <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.program_type}</p>
                                    <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] font-semibold"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                        <div className="flex items-center gap-1.5"><Users size={11} /> {item.total_pax || 0} pax</div>
                                        <div className="flex items-center gap-1.5"><CalendarDays size={11} /> {fmt(item.departure_date)}</div>
                                    </div>
                                </div>
                            ))}
                            {(!summary?.upcoming || summary.upcoming.length === 0) && (
                                <p className="col-span-2 text-center py-8 text-[13px]" style={{ color: 'var(--text-muted)' }}>No upcoming departures</p>
                            )}
                        </div>
                    </Card>

                    {/* Active in Saudi */}
                    <Card>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                🇸🇦 Active in Saudi Arabia
                            </h3>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                style={{ background: '#ECFDF5', color: '#047857' }}>
                                {summary?.in_saudi?.length || 0} group
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {summary?.in_saudi?.slice(0, 4).map(item => (
                                <div key={item.id} onClick={() => navigate(`/groups/${item.id}`)}
                                    className="p-4.5 bg-white rounded-xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                                    style={{ border: '1px solid var(--border-light)' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="success">ACTIVE</Badge>
                                        <Plane size={13} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                    <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }} title={item.group_code}>
                                        {item.group_code}
                                    </p>
                                    <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.program_type}</p>
                                    <div className="mt-3 pt-2.5 border-t flex items-center gap-1.5 text-[11px] font-semibold"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                        <Users size={11} /> {item.total_pax} pax
                                    </div>
                                </div>
                            ))}
                            {(!summary?.in_saudi || summary.in_saudi.length === 0) && (
                                <p className="col-span-2 text-center py-8 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                                    No active groups in Saudi Arabia
                                </p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right — All Groups list */}
                <div className="col-span-12 xl:col-span-5">
                    <Card className="h-full">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>All Groups</h3>
                            <button onClick={() => navigate('/groups')}
                                className="text-[12px] font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
                                style={{ color: 'var(--accent)', background: 'var(--accent-light)' }}>
                                Manage <ArrowRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                            {groups.slice(0, 20).map((g) => {
                                const sc = statusColor(g.status);
                                return (
                                    <div key={g.id} onClick={() => navigate(`/groups/${g.id}`)}
                                        className="p-4.5 bg-white rounded-xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                                        style={{ border: '1px solid var(--border-light)' }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                                                style={{ background: sc?.bg || '#F0FDFA', color: sc?.color || '#0F766E' }}>
                                                {g.status || 'N/A'}
                                            </span>
                                            <div className="w-auto"></div>
                                        </div>
                                        <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }} title={g.group_code}>
                                            {g.group_code}
                                        </p>
                                        <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{g.program_type}</p>
                                        <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] font-semibold"
                                            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                            <div className="flex items-center gap-1.5"><Users size={11} /> {g.total_pax || 0} pax</div>
                                            <div className="flex items-center gap-1.5"><CalendarDays size={11} /> {g.departure_date ? fmt(g.departure_date) : 'TBD'}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {groups.length === 0 && (
                                <p className="text-center py-10 text-[13px]" style={{ color: 'var(--text-muted)' }}>No groups found</p>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </>
    );
};

export default Dashboard;
