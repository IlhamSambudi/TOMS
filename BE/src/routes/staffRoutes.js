import { Router } from 'express';
import AssignmentController from '../controllers/assignmentController.js';
import { TourLeaderModel, MuthawifModel } from '../models/staffModel.js';

const router = Router();

// Staff lists for dropdowns
router.get('/tour-leaders', AssignmentController.getAllTourLeaders);
router.get('/muthawifs', AssignmentController.getAllMuthawifs);

// Create staff
router.post('/tour-leaders', async (req, res) => {
    try {
        const { name, phone } = req.body;
        const leader = await TourLeaderModel.create(name, phone);
        res.status(201).json({ success: true, message: 'Tour leader created', data: leader });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
});

router.post('/muthawifs', async (req, res) => {
    try {
        const { name, phone } = req.body;
        const muthawif = await MuthawifModel.create(name, phone);
        res.status(201).json({ success: true, message: 'Muthawif created', data: muthawif });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
});

export default router;
