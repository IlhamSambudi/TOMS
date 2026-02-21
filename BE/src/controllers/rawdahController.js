import RawdahModel from '../models/rawdahModel.js';

const RawdahController = {
    getAll: async (req, res) => {
        try {
            const data = await RawdahModel.getAll();
            res.json({ success: true, message: 'All rawdah records retrieved', data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    getByGroup: async (req, res) => {
        try {
            const data = await RawdahModel.getByGroup(req.params.groupId);
            res.json({ success: true, message: 'Rawdah retrieved', data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    upsert: async (req, res) => {
        try {
            const data = await RawdahModel.upsert(req.params.groupId, req.body);
            res.json({ success: true, message: 'Rawdah updated successfully', data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default RawdahController;
