import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, Bus, Plus, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import TransportModal from '../../components/resources/TransportModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import transportService from '../../services/transportService';
import toast from 'react-hot-toast';

const Transport = () => {
    const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [editingTransport, setEditingTransport] = useState(null);

    const fetchData = async () => {
        // setLoading(true);
        try {
            const result = await transportService.getAll();
            // Handle both array and {success, message, data} response formats
            setData(Array.isArray(result) ? result : (result?.data || []));
        } catch {
            toast.error('Failed to load transports');
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(item =>
        item.provider_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vehicle_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.route?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (row) => {
        setEditingTransport(row);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTransport(null);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await transportService.delete(selectedId);
            toast.success('Transport deleted successfully');
            fetchData();
        } catch {
            toast.error('Failed to delete transport');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const columns = [
        {
            key: 'group',
            label: 'Group',
            render: (row) => (
                <div className="font-medium text-slate-900">
                    {row.group_code || '-'}
                </div>
            )
        },
        {
            key: 'provider',
            label: 'Provider & Vehicle',
            render: (row) => (
                <div>
                    <div className="font-medium text-slate-900">{row.provider_name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Bus size={12} /> {row.vehicle_type}
                    </div>
                </div>
            )
        },
        {
            key: 'route',
            label: 'Route',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin size={12} className="text-slate-400" /> {row.route || '-'}
                </div>
            )
        },
        {
            key: 'date',
            label: 'Journey Date & Time',
            render: (row) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar size={12} className="text-slate-400" />
                        {row.journey_date ? new Date(row.journey_date).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }) : '-'}
                    </div>
                    {row.departure_time && (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <Clock size={11} className="text-slate-400" />
                            {row.departure_time}
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            label: '',
            render: (row, { openMenu, setOpenMenu }) => (
                <DataTable.ActionMenu
                    rowId={row.id}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    actions={[
                        {
                            label: 'Edit details',
                            icon: Edit,
                            onClick: () => handleEdit(row)
                        },
                        {
                            label: 'Delete transport',
                            icon: Trash2,
                            danger: true,
                            onClick: () => {
                                setSelectedId(row.id);
                                setIsDeleteDialogOpen(true);
                            }
                        }
                    ]}
                />
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Transport"
                subtitle="Overview of all vehicle arrangements."
            >
                <Button icon={Plus} onClick={handleAdd}>
                    Add Transport
                </Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredData}
                filters={
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Search transport..."
                            icon={Search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[300px]"
                        />
                    </div>
                }
                emptyState="No transport records found."
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Transport"
                description="Are you sure you want to delete this transport? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />

            <TransportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                initialData={editingTransport}
            />
        </div>
    );
};

export default Transport;
