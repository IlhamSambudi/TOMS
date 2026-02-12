import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

const Assignments = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <PageHeader title="Team Assignment" subtitle="Staff deployment" />
            <EmptyState
                title="Team assignment is managed per group"
                description="Go to a specific group detail page to assign tour leaders and muthawifs."
                icon={UserCheck}
            >
                <Button onClick={() => navigate('/groups')}>Go to Groups</Button>
            </EmptyState>
        </div>
    );
};

export default Assignments;
