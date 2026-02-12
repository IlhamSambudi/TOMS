import HandlingCompanyModel from '../models/handlingModel.js';

const HandlingController = {
    getAll: async (req, res) => {
        try {
            const companies = await HandlingCompanyModel.findAll();
            res.json({ success: true, message: 'Handling companies retrieved', data: companies });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    create: async (req, res) => {
        try {
            const company = await HandlingCompanyModel.create(req.body);
            res.status(201).json({ success: true, message: 'Handling company created', data: company });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default HandlingController;
