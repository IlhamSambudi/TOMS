import api from './api';

const transportService = {
    getAll: async () => {
        const res = await api.get('/transports');
        return res.data;
    },
    getByGroup: async (groupId) => {
        const res = await api.get(`/groups/${groupId}/transport`);
        return res.data;
    },
    create: async (groupId, data) => {
        const res = await api.post(`/groups/${groupId}/transport`, data);
        return res.data;
    },
    update: async (groupId, transportId, data) => {
        const res = await api.put(`/groups/${groupId}/transport/${transportId}`, data);
        return res.data;
    },
    delete: async (groupId, transportId) => {
        const res = await api.delete(`/groups/${groupId}/transport/${transportId}`);
        return res.data;
    },
};

export default transportService;
