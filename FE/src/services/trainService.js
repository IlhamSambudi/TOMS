import api from './api';

const trainService = {
    getByGroup: async (groupId) => {
        const res = await api.get(`/groups/${groupId}/trains`);
        return res.data;
    },
    create: async (groupId, data) => {
        const res = await api.post(`/groups/${groupId}/trains`, data);
        return res.data;
    },
    update: async (groupId, trainId, data) => {
        const res = await api.put(`/groups/${groupId}/trains/${trainId}`, data);
        return res.data;
    },
    delete: async (groupId, trainId) => {
        const res = await api.delete(`/groups/${groupId}/trains/${trainId}`);
        return res.data;
    },
};

export default trainService;
