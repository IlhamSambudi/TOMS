import React from 'react';
import { useLocation } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';
import { Database } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const MasterDataPlaceholder = () => {
    const location = useLocation();
    const title = location.pathname.split('/')[1].replace('-', ' ').toUpperCase();

    return (
        <div className="space-y-6">
            <PageHeader title={title} subtitle="Master Data Management" />
            <EmptyState
                icon={Database}
                title={`Manage ${title}`}
                description="This master data module is currently under development."
            />
        </div>
    );
};

export default MasterDataPlaceholder;
