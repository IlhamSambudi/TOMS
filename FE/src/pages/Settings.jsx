import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Building2, UserCheck, Search, Phone, Mail, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/Modal';
import handlingService from '../services/handlingService';
import assignmentService from '../services/assignmentService';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('handling');
    const settingsTabs = [
        { key: 'handling', label: 'Handling Companies', icon: Building2 },
        { key: 'staff', label: 'Staff Management', icon: UserCheck },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Settings" subtitle="System configuration" />

            <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border-light)' }}>
                {settingsTabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-colors relative"
                        style={{ color: activeTab === t.key ? 'var(--accent)' : 'var(--text-muted)' }}>
                        <t.icon size={14} />
                        {t.label}
                        {activeTab === t.key && (
                            <motion.div layoutId="settingsTab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--accent)' }} />
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'handling' && <HandlingSection />}
            {activeTab === 'staff' && <StaffSection />}
        </div>
    );
};

/* ── Handling Companies ── */
const HandlingSection = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const fetchData = async () => {
        try {
            const data = await handlingService.getAll();
            setCompanies(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const onSubmit = async (data) => {
        try {
            await handlingService.create(data);
            toast.success('Company created');
            setModalOpen(false); reset(); fetchData();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    const columns = [
        { key: 'name', label: 'Name', render: r => <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</span> },
        { key: 'contact_person', label: 'Contact', render: r => <span style={{ color: 'var(--text-secondary)' }}>{r.contact_person || '—'}</span> },
        { key: 'phone', label: 'Phone', render: r => <span style={{ color: 'var(--text-muted)' }}>{r.phone || '—'}</span> },
        { key: 'email', label: 'Email', render: r => <span style={{ color: 'var(--text-muted)' }}>{r.email || '—'}</span> },
    ];

    if (loading) return <div className="skeleton h-48 rounded-2xl" />;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button size="sm" icon={Plus} onClick={() => { reset({ name: '', contact_person: '', phone: '', email: '', address: '' }); setModalOpen(true); }}>
                    Add Company
                </Button>
            </div>
            <DataTable columns={columns} data={companies}
                emptyState={<EmptyState title="No handling companies" description="Add your first handling company." icon={Building2} />} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Handling Company">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Company Name" {...register('name', { required: 'Required' })} error={errors.name?.message} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Contact Person" {...register('contact_person')} />
                        <Input label="Phone" {...register('phone')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Email" type="email" {...register('email')} />
                        <Input label="Address" {...register('address')} />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={isSubmitting}>Create</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

/* ── Staff Management ── */
const StaffSection = () => {
    const [tourLeaders, setTourLeaders] = useState([]);
    const [muthawifs, setMuthawifs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staffType, setStaffType] = useState('tl');
    const [modalOpen, setModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const fetchData = async () => {
        try {
            const [tl, mt] = await Promise.all([assignmentService.getAllTourLeaders(), assignmentService.getAllMuthawifs()]);
            setTourLeaders(Array.isArray(tl) ? tl : []);
            setMuthawifs(Array.isArray(mt) ? mt : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const onSubmit = async (data) => {
        try {
            const endpoint = staffType === 'tl' ? '/staff/tour-leaders' : '/staff/muthawifs';
            // Use the api directly for creating staff
            const { default: api } = await import('../services/api');
            await api.post(endpoint, data);
            toast.success(`${staffType === 'tl' ? 'Tour Leader' : 'Muthawif'} created`);
            setModalOpen(false); reset(); fetchData();
        } catch (e) { toast.error(e.message || 'Failed'); }
    };

    const data = staffType === 'tl' ? tourLeaders : muthawifs;

    if (loading) return <div className="skeleton h-48 rounded-2xl" />;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex gap-1">
                    <button onClick={() => setStaffType('tl')}
                        className="px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors"
                        style={staffType === 'tl' ? { background: 'var(--accent-light)', color: 'var(--accent)' } : { color: 'var(--text-muted)' }}>
                        Tour Leaders ({tourLeaders.length})
                    </button>
                    <button onClick={() => setStaffType('mt')}
                        className="px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors"
                        style={staffType === 'mt' ? { background: 'var(--accent-light)', color: 'var(--accent)' } : { color: 'var(--text-muted)' }}>
                        Muthawifs ({muthawifs.length})
                    </button>
                </div>
                <Button size="sm" icon={Plus} onClick={() => { reset({ name: '', phone: '' }); setModalOpen(true); }}>
                    Add {staffType === 'tl' ? 'Tour Leader' : 'Muthawif'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.map((person, idx) => (
                    <motion.div key={person.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                        <Card>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                                    {person.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{person.name}</p>
                                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{person.phone || 'No phone'}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
                {data.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState title={`No ${staffType === 'tl' ? 'tour leaders' : 'muthawifs'}`}
                            description={`Add your first ${staffType === 'tl' ? 'tour leader' : 'muthawif'}.`} icon={UserCheck} />
                    </div>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Add ${staffType === 'tl' ? 'Tour Leader' : 'Muthawif'}`}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Name" {...register('name', { required: 'Required' })} error={errors.name?.message} />
                    <Input label="Phone" {...register('phone')} placeholder="Optional" />
                    <div className="flex gap-2 justify-end pt-1">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={isSubmitting}>Create</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Settings;
