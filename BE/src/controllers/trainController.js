import TrainModel from '../models/trainModel.js';

const TrainController = {
    getByGroup: async (req, res) => {
        try {
            const trains = await TrainModel.findByGroupId(req.params.id);
            res.json({ success: true, message: 'Train reservations retrieved', data: trains });
        } catch (error) {
            console.error('Train getByGroup error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    create: async (req, res) => {
        try {
            const train = await TrainModel.create(req.params.id, req.body);
            res.status(201).json({ success: true, message: 'Train reservation created', data: train });
        } catch (error) {
            console.error('Train create error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    update: async (req, res) => {
        try {
            const train = await TrainModel.update(req.params.trainId, req.body);
            if (!train) {
                return res.status(404).json({ success: false, message: 'Train reservation not found', data: null });
            }
            res.json({ success: true, message: 'Train reservation updated', data: train });
        } catch (error) {
            console.error('Train update error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    delete: async (req, res) => {
        try {
            await TrainModel.delete(req.params.trainId);
            res.json({ success: true, message: 'Train reservation deleted', data: null });
        } catch (error) {
            console.error('Train delete error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default TrainController;
