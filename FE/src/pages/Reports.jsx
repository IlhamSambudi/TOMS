import React from 'react';
import { FileBarChart, Users, Plane, Bus, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';

const reports = [
    {
        title: 'Group Operational Summary',
        description: 'Overview of all groups by status, departure dates, and pax counts.',
        icon: Users,
        iconBg: '#eef2ff',
        iconColor: '#6366f1',
    },
    {
        title: 'Flight Manifest Summary',
        description: 'Complete flight itineraries for all active groups.',
        icon: Plane,
        iconBg: '#f0f9ff',
        iconColor: '#3b82f6',
    },
    {
        title: 'Team Deployment Summary',
        description: 'Tour leader and muthawif assignments across groups.',
        icon: Users,
        iconBg: '#f0fdf4',
        iconColor: '#16a34a',
    },
    {
        title: 'Transport Schedule Report',
        description: 'Vehicle arrangements and schedules for all groups.',
        icon: Bus,
        iconBg: '#fef3c7',
        iconColor: '#d97706',
    },
];

const Reports = () => (
    <div className="space-y-6">
        <PageHeader title="Reports" subtitle="Operational reports and exports" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((r, idx) => (
                <motion.div key={r.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                    <Card>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: r.iconBg }}>
                                <r.icon size={18} style={{ color: r.iconColor }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                                <p className="text-[12px] mb-3" style={{ color: 'var(--text-muted)' }}>{r.description}</p>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" icon={Download}
                                        onClick={() => { }}>
                                        PDF
                                    </Button>
                                    <Button variant="ghost" size="sm" icon={Download}
                                        onClick={() => { }}>
                                        Excel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    </div>
);

export default Reports;
