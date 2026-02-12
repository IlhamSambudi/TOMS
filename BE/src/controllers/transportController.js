import TransportModel from '../models/transportModel.js';

const TransportController = {
    getByGroup: async (req, res) => {
        try {
            const transports = await TransportModel.findByGroupId(req.params.id);
            res.json({ success: true, message: 'Transports retrieved', data: transports });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    create: async (req, res) => {
        try {
            const transport = await TransportModel.create(req.params.id, req.body);
            res.status(201).json({ success: true, message: 'Transport created', data: transport });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    update: async (req, res) => {
        try {
            const transport = await TransportModel.update(req.params.transportId, req.body);
            if (!transport) {
                return res.status(404).json({ success: false, message: 'Transport not found', data: null });
            }
            res.json({ success: true, message: 'Transport updated', data: transport });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    delete: async (req, res) => {
        try {
            await TransportModel.delete(req.params.transportId);
            res.json({ success: true, message: 'Transport deleted', data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default TransportController;
