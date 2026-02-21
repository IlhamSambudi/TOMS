import api from './api';

const hotelService = {
    getByGroup: async (groupId) => {
        const res = await api.get(`/groups/${groupId}/hotels`);
        return res.data;
    },
    create: async (groupId, data) => {
        const res = await api.post(`/groups/${groupId}/hotels`, data);
        return res.data;
    },
    update: async (groupId, hotelId, data) => {
        const res = await api.put(`/groups/${groupId}/hotels/${hotelId}`, data);
        return res.data;
    },
    delete: async (groupId, hotelId) => {
        const res = await api.delete(`/groups/${groupId}/hotels/${hotelId}`);
        return res.data;
    },
};

export default hotelService;
