import api from './api';

const assignmentService = {
    getTourLeaders: async (groupId) => {
        const res = await api.get(`/groups/${groupId}/assignments/tour-leaders`);
        return res.data;
    },
    assignTourLeader: async (groupId, tourLeaderId) => {
        const res = await api.post(`/groups/${groupId}/assignments/tour-leaders`, { tour_leader_id: tourLeaderId });
        return res.data;
    },
    unassignTourLeader: async (groupId, tourLeaderId) => {
        const res = await api.delete(`/groups/${groupId}/assignments/tour-leaders/${tourLeaderId}`);
        return res.data;
    },
    getMuthawifs: async (groupId) => {
        const res = await api.get(`/groups/${groupId}/assignments/muthawifs`);
        return res.data;
    },
    assignMuthawif: async (groupId, muthawifId) => {
        const res = await api.post(`/groups/${groupId}/assignments/muthawifs`, { muthawif_id: muthawifId });
        return res.data;
    },
    unassignMuthawif: async (groupId, muthawifId) => {
        const res = await api.delete(`/groups/${groupId}/assignments/muthawifs/${muthawifId}`);
        return res.data;
    },
    // Staff lists for dropdowns
    getAllTourLeaders: async () => {
        const res = await api.get('/staff/tour-leaders');
        return res.data;
    },
    getAllMuthawifs: async () => {
        const res = await api.get('/staff/muthawifs');
        return res.data;
    },
};

export default assignmentService;
