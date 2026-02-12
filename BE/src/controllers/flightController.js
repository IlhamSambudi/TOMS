import FlightModel from '../models/flightModel.js';

const FlightController = {
    getAll: async (req, res) => {
        try {
            const flights = await FlightModel.findAll();
            res.json({ success: true, message: 'Flights retrieved', data: flights });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    getById: async (req, res) => {
        try {
            const flight = await FlightModel.findById(req.params.id);
            if (!flight) {
                return res.status(404).json({ success: false, message: 'Flight not found', data: null });
            }
            res.json({ success: true, message: 'Flight retrieved', data: flight });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    create: async (req, res) => {
        try {
            const flight = await FlightModel.create(req.body);
            res.status(201).json({ success: true, message: 'Flight created', data: flight });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    update: async (req, res) => {
        try {
            const flight = await FlightModel.update(req.params.id, req.body);
            if (!flight) {
                return res.status(404).json({ success: false, message: 'Flight not found', data: null });
            }
            res.json({ success: true, message: 'Flight updated', data: flight });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    delete: async (req, res) => {
        try {
            await FlightModel.delete(req.params.id);
            res.json({ success: true, message: 'Flight deleted', data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default FlightController;
