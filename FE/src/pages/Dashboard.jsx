// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, Users, Activity, ArrowRight, MoreHorizontal, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import PageContainer from '../components/layout/PageContainer';
import groupService from '../services/groupService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await groupService.getOperationsSummary();
                setSummary(data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const daysUntil = (date) => {
        if (!date) return '';
        const d = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
        if (d === 0) return 'Today';
        if (d === 1) return 'Tomorrow';
        if (d > 0) return d + 'd';
        return Math.abs(d) + 'd ago';
    };

    if (loading) return <div className="p-8"><Skeleton.Table rows={5} cols={4} /></div>;

    // KPI Metrics Data
    const metrics = [
        { label: 'Total Active Groups', value: summary?.total || 0, icon: Users, color: 'text-teal-700', bg: 'bg-teal-50' },
        { label: 'Departing Soon', value: summary?.upcoming?.length || 0, icon: CalendarDays, color: 'text-blue-700', bg: 'bg-blue-50' },
        { label: 'Currently in Saudi', value: summary?.in_saudi?.length || 0, icon: MapPin, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        { label: 'Awaiting Prep', value: summary?.awaiting?.length || 0, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
    ];

    return (
        <PageContainer>
            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-[14px] text-slate-500 mt-1">Welcome back, here's what happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" size="md" icon={CalendarDays}>Schedule</Button>
                    <Button variant="primary" size="md" icon={Plus}>New Group</Button>
                </div>
            </div>

            {/* ── Page Grid (12 Columns) ── */}
            <div className="grid grid-cols-12 gap-[24px]">

                {/* 1. Metrics (Span 3 each) */}
                {metrics.map((m, i) => (
                    <div key={i} className="col-span-12 md:col-span-6 xl:col-span-3">
                        <Card className="flex flex-col justify-between hover:shadow-md transition-all h-[140px]" padding>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-[40px] h-[40px] flex items-center justify-center rounded-[12px] ${m.bg} ${m.color}`}>
                                    <m.icon size={20} strokeWidth={2} />
                                </div>
                                {i === 0 && <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full">+12%</span>}
                            </div>
                            <div>
                                <h3 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-2">{m.value}</h3>
                                <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.06em]">{m.label}</p>
                            </div>
                        </Card>
                    </div>
                ))}

                {/* 2. Main Content Area (Span 8) */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-[24px]">

                    {/* Upcoming Departures Panel */}
                    <Card>
                        <div className="flex items-center justify-between mb-[24px]">
                            <h3 className="text-[16px] font-semibold text-slate-900">Upcoming Departures</h3>
                            <button onClick={() => navigate('/groups')} className="text-[13px] font-semibold text-[#0F766E] hover:text-[#115E59] flex items-center gap-1 transition-colors px-3 py-1.5 hover:bg-teal-50 rounded-[8px]">
                                View All <ArrowRight size={14} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            {summary?.upcoming?.slice(0, 5).map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/groups/${item.id}`)}
                                    // List Item - 16px Padding
                                    className="group flex items-center justify-between p-[16px] rounded-[12px] hover:bg-[#F8FAF9] border border-transparent hover:border-[#E2E8F0] cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-[44px] h-[44px] rounded-[12px] bg-blue-50 text-blue-700 flex items-center justify-center text-[12px] font-bold">
                                            {item.group_code.split('-').pop()}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-slate-900 group-hover:text-[#0F766E] transition-colors">{item.group_code}</p>
                                            <p className="text-[12px] text-slate-500 font-medium mt-0.5">{item.program_type} • {item.total_pax} Pax</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[13px] font-semibold text-slate-700">{formatDate(item.departure_date)}</p>
                                        <p className="text-[11px] font-bold text-blue-600 mt-0.5">{daysUntil(item.departure_date)}</p>
                                    </div>
                                </div>
                            ))}
                            {summary?.upcoming?.length === 0 && (
                                <p className="text-center text-slate-400 py-8 text-sm italic">No upcoming departures.</p>
                            )}
                        </div>
                    </Card>

                    {/* Active In Saudi */}
                    <Card>
                        <div className="flex items-center justify-between mb-[24px]">
                            <h3 className="text-[16px] font-semibold text-slate-900">Active in Saudi</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                            {summary?.in_saudi?.slice(0, 4).map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/groups/${item.id}`)}
                                    className="p-[20px] rounded-[14px] border border-[#E2E8F0] hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all bg-[#F8FAF9] hover:bg-white"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-[24px]">🇸🇦</div>
                                        <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-100 px-2.5 py-1 rounded-full shadow-sm">ACTIVE</span>
                                    </div>
                                    <p className="text-[14px] font-bold text-slate-900 truncate">{item.group_code}</p>
                                    <p className="text-[12px] text-slate-500 mt-1 font-medium">{item.program_type}</p>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[12px] font-semibold text-slate-600">
                                        <Users size={14} className="text-emerald-600" /> {item.total_pax} Pax
                                    </div>
                                </div>
                            ))}
                            {summary?.in_saudi?.length === 0 && (
                                <p className="col-span-2 text-center text-slate-400 py-8 text-sm italic">No active groups in Saudi.</p>
                            )}
                        </div>
                    </Card>

                </div>

                {/* 3. Sidebar Panel (Span 4) */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-[24px]">
                    {/* Activity Log */}
                    <Card className="h-full max-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-[24px] flex-shrink-0">
                            <h3 className="text-[16px] font-semibold text-slate-900">Activity Log</h3>
                            <button className="text-slate-400 hover:text-[#0F766E] transition-colors"><MoreHorizontal size={20} /></button>
                        </div>

                        <div className="relative pl-[24px] border-l border-[#E2E8F0] space-y-[24px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                            {summary?.recent?.slice(0, 10).map((log, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-300 group-hover:bg-[#0F766E] group-hover:scale-125 transition-all shadow-sm"></div>
                                    <p className="text-[13px] text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                                        <span className="font-semibold text-slate-900 block mb-1">Group {log.group_code.split('-').slice(1).join('-')}</span>
                                        Status updated to <span className="text-[#0F766E] font-medium">{log.status || 'Active'}</span>.
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1">
                                        <Clock size={10} /> {formatDate(log.updated_at)}
                                    </p>
                                </div>
                            ))}
                            {summary?.recent?.length === 0 && (
                                <p className="text-center text-slate-400 py-8 text-sm italic">No recent activity.</p>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </PageContainer>
    );
};

export default Dashboard;
