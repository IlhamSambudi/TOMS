import HotelModel from '../models/hotelModel.js';

const HotelController = {
    getByGroup: async (req, res) => {
        try {
            const hotels = await HotelModel.findByGroupId(req.params.id);
            res.json({ success: true, message: 'Hotels retrieved', data: hotels });
        } catch (error) {
            console.error('Hotel getByGroup error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    create: async (req, res) => {
        try {
            const hotel = await HotelModel.create(req.params.id, req.body);
            res.status(201).json({ success: true, message: 'Hotel created', data: hotel });
        } catch (error) {
            console.error('Hotel create error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    update: async (req, res) => {
        try {
            const hotel = await HotelModel.update(req.params.hotelId, req.body);
            if (!hotel) {
                return res.status(404).json({ success: false, message: 'Hotel not found', data: null });
            }
            res.json({ success: true, message: 'Hotel updated', data: hotel });
        } catch (error) {
            console.error('Hotel update error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    delete: async (req, res) => {
        try {
            await HotelModel.delete(req.params.hotelId);
            res.json({ success: true, message: 'Hotel deleted', data: null });
        } catch (error) {
            console.error('Hotel delete error:', error);
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default HotelController;
