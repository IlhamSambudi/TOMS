import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import rawdahService from '../../services/rawdahService';
import groupService from '../../services/groupService';

// Returns 'YYYY-MM-DD' for today in local time
const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isPast = (dateStr) => {
    if (!dateStr) return false;
    return dateStr.split('T')[0] < todayStr();
};

// For Rawdah: a row is "past" if BOTH men_date and women_date are past (or null).
// If either is upcoming, the row is still active.
const isRowPast = (row) => {
    const menDone = !row.men_date || isPast(row.men_date);
    const womenDone = !row.women_date || isPast(row.women_date);
    return menDone && womenDone;
};

// Get the latest date for sorting (max of men_date / women_date)
const getLatestDate = (row) => {
    const dates = [row.men_date, row.women_date].filter(Boolean).map(d => d.split('T')[0]);
    return dates.length ? dates.sort().reverse()[0] : '';
};

const Rawdahs = () => {
    const [rawdahs, setRawdahs] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

    const fetchRawdahs = async () => {
        try {
            setLoading(true);
            const [rawdahData, groupData] = await Promise.all([
                rawdahService.getAll(),
                groupService.getAll().catch(() => [])
            ]);
            setRawdahs(Array.isArray(rawdahData) ? rawdahData : []);
            setGroups(Array.isArray(groupData) ? groupData : []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load rawdah data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRawdahs();
    }, []);

    const onSubmit = async (data) => {
        try {
            const { group_id, ...rawdahData } = data;
            await rawdahService.upsert(group_id, rawdahData);
            toast.success('Rawdah permits saved successfully');
            setIsModalOpen(false);
            reset();
            fetchRawdahs();
        } catch (error) {
            toast.error(error.message || 'Failed to save rawdah permits');
        }
    };

    // Sort by the latest date ascending (soonest upcoming first)
    const sortedRawdahs = [...rawdahs].sort((a, b) =>
        getLatestDate(a).localeCompare(getLatestDate(b))
    );

    const activeRawdahs = showAll ? sortedRawdahs : sortedRawdahs.filter(r => !isRowPast(r));
    const pastCount = sortedRawdahs.filter(r => isRowPast(r)).length;

    const filteredRawdahs = activeRawdahs.filter(r => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (r.group_code || '').toLowerCase().includes(term) ||
            (r.group_name || '').toLowerCase().includes(term)
        );
    });

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const columns = [
        {
            key: 'group',
            label: 'Group',
            render: (row) => (
                <div>
                    <div className="font-semibold text-slate-900">{row.group_code}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{row.group_name}</div>
                </div>
            )
        },
        {
            key: 'men',
            label: 'Men Permits',
            render: (row) => (
                <div className="text-sm">
                    {row.men_date ? (
                        <>
                            <div className="font-medium text-slate-700">{formatDate(row.men_date)}</div>
                            <div className="text-xs text-slate-500">{row.men_time || 'No time set'} • {row.men_pax || 0} Pax</div>
                        </>
                    ) : (
                        <span className="text-slate-400 italic">Not set</span>
                    )}
                </div>
            )
        },
        {
            key: 'women',
            label: 'Women Permits',
            render: (row) => (
                <div className="text-sm">
                    {row.women_date ? (
                        <>
                            <div className="font-medium text-slate-700">{formatDate(row.women_date)}</div>
                            <div className="text-xs text-slate-500">{row.women_time || 'No time set'} • {row.women_pax || 0} Pax</div>
                        </>
                    ) : (
                        <span className="text-slate-400 italic">Not set</span>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Rawdah Permits"
                subtitle="Manage and view Rawdah schedules across all groups"
            >
                <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
                    Add Rawdah Permits
                </Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredRawdahs}
                loading={loading}
                getRowClassName={(row) => isRowPast(row) ? 'opacity-50 bg-slate-50' : ''}
                filters={
                    <div className="flex items-center gap-3 flex-wrap">
                        <Input
                            placeholder="Search groups..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-[300px]"
                        />
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
                emptyState="There are currently no rawdah allocations matching your search."
            />

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Rawdah Permits">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Select Group <span className="text-rose-500">*</span>
                        </label>
                        <select
                            {...register('group_id', { required: 'Group is required' })}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                        >
                            <option value="">Select a group...</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>
                                    {g.group_code} — {g.group_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Men */}
                    <div className="space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                            Men / Laki-Laki
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Date" type="date" {...register('men_date')} />
                            <Input label="Time" type="time" {...register('men_time')} />
                            <Input label="Total Pax" type="number" min="0" placeholder="0" {...register('men_pax')} />
                        </div>
                    </div>

                    {/* Women */}
                    <div className="space-y-4 pt-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                            Women / Perempuan
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Date" type="date" {...register('women_date')} />
                            <Input label="Time" type="time" {...register('women_time')} />
                            <Input label="Total Pax" type="number" min="0" placeholder="0" {...register('women_pax')} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 rounded-xl font-medium text-[13px] text-slate-600 hover:bg-slate-50 transition-colors border border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl font-medium text-[13px] text-white bg-[#0F766E] hover:bg-[#0d635c] transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Permits'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Rawdahs;
