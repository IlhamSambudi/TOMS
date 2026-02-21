import GroupModel from '../models/groupModel.js';

const GroupController = {
    getAll: async (req, res) => {
        try {
            const groups = await GroupModel.findAll();
            res.json({ success: true, message: 'Groups retrieved', data: groups });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    getById: async (req, res) => {
        try {
            const group = await GroupModel.findById(req.params.id);
            if (!group) {
                return res.status(404).json({ success: false, message: 'Group not found', data: null });
            }
            res.json({ success: true, message: 'Group retrieved', data: group });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // GET /groups/:id/full-itinerary — group with joined flights + transports
    getFullItinerary: async (req, res) => {
        try {
            const itinerary = await GroupModel.findFullItinerary(req.params.id);
            if (!itinerary) {
                return res.status(404).json({ success: false, message: 'Group not found', data: null });
            }
            res.json({ success: true, message: 'Full itinerary retrieved', data: itinerary });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    create: async (req, res) => {
        try {
            const group = await GroupModel.create(req.body);
            res.status(201).json({ success: true, message: 'Group created', data: group });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    update: async (req, res) => {
        try {
            const group = await GroupModel.update(req.params.id, req.body);
            if (!group) {
                return res.status(404).json({ success: false, message: 'Group not found', data: null });
            }
            res.json({ success: true, message: 'Group updated', data: group });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    delete: async (req, res) => {
        try {
            await GroupModel.delete(req.params.id);
            res.json({ success: true, message: 'Group deleted', data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // GET /groups/operations-summary
    getOperationsSummary: async (req, res) => {
        try {
            const groups = await GroupModel.findAll();
            const summary = {
                upcoming: groups.filter(g => g.status === 'PREPARATION'),
                in_saudi: groups.filter(g => g.status === 'DEPARTURE'),
                awaiting: groups.filter(g => g.status === 'ARRIVAL'),
                recent: [...groups].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8),
                total: groups.length,
            };
            res.json({ success: true, message: 'Operations summary', data: summary });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // PATCH /groups/:id/status
    patchStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const group = await GroupModel.updateStatus(req.params.id, status);
            if (!group) return res.status(404).json({ success: false, message: 'Group not found', data: null });
            res.json({ success: true, message: 'Status updated', data: group });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message, data: null });
        }
    }
};

export default GroupController;
