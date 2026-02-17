import React, { useState, useEffect } from 'react';
import { Plus, Search, Phone, User, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import staffService from '../../services/staffService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StaffModal from '../../components/resources/StaffModal';

const Muthawifs = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await staffService.getAllMuthawifs();
            setData(result);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load Muthawifs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Data
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Columns Definition
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (row) => (
                <div className="font-medium text-slate-900 flex items-center gap-2">
                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={14} />
                    </div>
                    {row.name}
                </div>
            )
        },
        {
            key: 'phone',
            label: 'Phone Number',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    {row.phone ? (
                        <>
                            <Phone size={12} className="text-slate-400" /> {row.phone}
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
                            label: 'Delete staff',
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
        setEditingStaff(row);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await staffService.deleteMuthawif(selectedId);
            toast.success('Muthawif deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete Muthawif');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Muthawifs"
                subtitle="Manage Muthawif staff and assignments."
            >
                <Button icon={Plus} onClick={handleAdd}>
                    Add Muthawif
                </Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredData}
                filters={
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Search staff..."
                            icon={Search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[300px]"
                        />
                    </div>
                }
                emptyState="No Muthawifs found. Add one to get started."
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Muthawif"
                description="Are you sure you want to delete this staff member? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />

            <StaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                initialData={editingStaff}
                type="muthawif"
            />
        </div>
    );
};

export default Muthawifs;
