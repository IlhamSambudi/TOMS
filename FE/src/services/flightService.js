import api from './api';

const flightService = {
    getAll: async () => {
        const res = await api.get('/flights');
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/flights/${id}`);
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/flights', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/flights/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/flights/${id}`);
        return res.data;
    },
};

export default flightService;
