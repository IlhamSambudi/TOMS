

import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Users, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import AssignmentModal from '../components/resources/AssignmentModal';
import groupService from '../services/groupService'; // Assuming I can get groups with assignments
import toast from 'react-hot-toast';

const Assignments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch groups to show their assignments
            const result = await groupService.getAll();
            setData(result);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(item =>
        item.group_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.program_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Team Assignment"
                subtitle="Overview of staff assignments per group."
            >
                <Button icon={Plus} onClick={handleAdd}>
                    Add Assignment
                </Button>
            </PageHeader>

            <DataTable
                columns={[
                    { key: 'group_code', label: 'Group Code', className: 'font-medium' },
                    { key: 'program_type', label: 'Program' },
                    { key: 'departure_date', label: 'Departure', render: (row) => row.departure_date ? new Date(row.departure_date).toLocaleDateString() : '-' },
                    {
                        key: 'status',
                        label: 'Assignment Status',
                        render: () => <span className="text-xs text-slate-400 italic">Check Detail</span>
                    }
                ]}
                data={filteredData}
                onRowClick={(row) => window.location.href = `/groups/${row.id}`}
                filters={
                    <Input
                        placeholder="Search groups..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[300px]"
                    />
                }
            />

            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default Assignments;
