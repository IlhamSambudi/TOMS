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
};

export default handlingService;
