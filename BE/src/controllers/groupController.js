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

    // GET /groups/operations-summary — categorized groups for dashboard
    getOperationsSummary: async (req, res) => {
        try {
            const groups = await GroupModel.findAll();
            const now = new Date();

            const categorize = (g) => {
                if (!g.departure_date) return 'draft';
                const dep = new Date(g.departure_date);
                const diffDays = Math.ceil((dep - now) / (1000 * 60 * 60 * 24));
                if (diffDays < 0 && diffDays > -30) return 'in_saudi';
                if (diffDays <= 0) return 'completed';
                if (diffDays <= 7) return 'upcoming';
                return 'awaiting';
            };

            const summary = {
                upcoming: [],
                in_saudi: [],
                awaiting: [],
                recent: [...groups].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8),
                total: groups.length,
            };

            groups.forEach(g => {
                const cat = categorize(g);
                if (summary[cat]) summary[cat].push(g);
            });

            res.json({ success: true, message: 'Operations summary', data: summary });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default GroupController;
