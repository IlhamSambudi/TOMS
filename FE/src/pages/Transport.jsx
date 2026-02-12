import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

const Transport = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <PageHeader title="Transport" subtitle="Vehicle arrangements" />
            <EmptyState
                title="Transport is managed per group"
                description="Go to a specific group detail page to manage transport arrangements."
                icon={Bus}
            >
                <Button onClick={() => navigate('/groups')}>Go to Groups</Button>
            </EmptyState>
        </div>
    );
};

export default Transport;
