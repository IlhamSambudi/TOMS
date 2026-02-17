import api from './api';

const handlingService = {
    getAll: async () => {
        const res = await api.get('/handling');
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/handling', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/handling/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/handling/${id}`);
        return res.data;
    },
};

export default handlingService;
