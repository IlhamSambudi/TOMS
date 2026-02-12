import api from './api';

const groupService = {
    getAll: async () => {
        const res = await api.get('/groups');
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/groups/${id}`);
        return res.data;
    },
    getFullItinerary: async (id) => {
        const res = await api.get(`/groups/${id}/full-itinerary`);
        return res.data;
    },
    getOperationsSummary: async () => {
        const res = await api.get('/groups/operations-summary');
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/groups', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/groups/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/groups/${id}`);
        return res.data;
    },
};

export default groupService;
