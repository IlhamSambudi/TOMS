import api from './api';

const rawdahService = {
    getAll: async () => {
        try {
            const response = await api.get('/rawdah');
            return response.data;
        } catch (error) {
            console.error('Error in rawdahService.getAll:', error);
            throw error;
        }
    },

    getByGroup: async (groupId) => {
        try {
            const response = await api.get(`/rawdah/group/${groupId}`);
            return response.data;
        } catch (error) {
            console.error('Error in rawdahService.getByGroup:', error);
            throw error;
        }
    },

    upsert: async (groupId, rawdahData) => {
        try {
            const response = await api.put(`/rawdah/group/${groupId}`, rawdahData);
            return response.data;
        } catch (error) {
            console.error('Error in rawdahService.upsert:', error);
            throw error;
        }
    }
};

export default rawdahService;
