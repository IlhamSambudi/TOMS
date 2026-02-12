import api from './api';

const groupFlightSegmentService = {
    getByGroup: async (groupId) => {
        const res = await api.get(`/groups/${groupId}/flights`);
        return res.data;
    },
    create: async (groupId, data) => {
        const res = await api.post(`/groups/${groupId}/flights`, data);
        return res.data;
    },
    update: async (groupId, segmentId, data) => {
        const res = await api.put(`/groups/${groupId}/flights/${segmentId}`, data);
        return res.data;
    },
    delete: async (groupId, segmentId) => {
        const res = await api.delete(`/groups/${groupId}/flights/${segmentId}`);
        return res.data;
    },
};

export default groupFlightSegmentService;
