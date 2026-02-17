import api from './api';

const staffService = {
    // ── Muthawifs ──
    getAllMuthawifs: async () => {
        const res = await api.get('/staff/muthawifs');
        return res.data;
    },
    createMuthawif: async (data) => {
        const res = await api.post('/staff/muthawifs', data);
        return res.data;
    },
    updateMuthawif: async (id, data) => {
        const res = await api.put(`/staff/muthawifs/${id}`, data);
        return res.data;
    },
    deleteMuthawif: async (id) => {
        const res = await api.delete(`/staff/muthawifs/${id}`);
        return res.data;
    },

    // ── Tour Leaders ──
    getAllTourLeaders: async () => {
        const res = await api.get('/staff/tour-leaders');
        return res.data;
    },
    createTourLeader: async (data) => {
        const res = await api.post('/staff/tour-leaders', data);
        return res.data;
    },
    updateTourLeader: async (id, data) => {
        const res = await api.put(`/staff/tour-leaders/${id}`, data);
        return res.data;
    },
    deleteTourLeader: async (id) => {
        const res = await api.delete(`/staff/tour-leaders/${id}`);
        return res.data;
    },
};

export default staffService;
