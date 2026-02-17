import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Mail, User, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import statusBadge from '../../components/ui/StatusBadge'; // Verify import
import handlingService from '../../services/handlingService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import HandlingCompanyModal from '../../components/resources/HandlingCompanyModal';

const HandlingCompanies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await handlingService.getAll();
            setData(result);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load handling companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Data
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.contact_person && item.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Columns Definition
    const columns = [
        {
            key: 'name',
            label: 'Company Name',
            render: (row) => (
                <div>
                    <div className="font-medium text-slate-900">{row.name}</div>
                    {row.contact_person && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <User size={12} /> {row.contact_person}
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'contact',
            label: 'Contact Info',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    {row.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone size={12} className="text-slate-400" /> {row.phone}
                        </div>
                    )}
                    {row.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Mail size={12} className="text-slate-400" /> {row.email}
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'address',
            label: 'Address',
            render: (row) => (
                <div className="flex items-start gap-1.5 text-xs text-slate-500 max-w-[200px] truncate">
                    {row.address ? (
                        <>
                            <MapPin size={13} className="shrink-0 text-slate-400 mt-0.5" />
                            <span className="truncate">{row.address}</span>
                        </>
                    ) : '-'}
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
                            label: 'Delete company',
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

    // Handlers
    const handleEdit = (row) => {
        setEditingCompany(row);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await handlingService.delete(selectedId);
            toast.success('Company deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete company');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Handling Companies"
                subtitle="Manage your ground handling partners and contacts."
            >
                <Button icon={Plus} onClick={handleAdd}>
                    Add Company
                </Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredData}
                filters={
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Search companies..."
                            icon={Search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[300px]"
                        />
                    </div>
                }
                emptyState="No handling companies found. Add one to get started."
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Company"
                description="Are you sure you want to delete this company? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />

            <HandlingCompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                initialData={editingCompany}
            />
        </div>
    );
};

export default HandlingCompanies;
