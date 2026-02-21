import AssignmentModel from '../models/assignmentModel.js';
import { TourLeaderModel, MuthawifModel } from '../models/staffModel.js';

const AssignmentController = {
    // Get all assignments with staff names
    getAll: async (req, res) => {
        try {
            const assignments = await AssignmentModel.getAllAssignments();
            res.json({ success: true, message: 'Assignments retrieved', data: assignments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // Tour Leaders
    assignTourLeader: async (req, res) => {
        try {
            const { tour_leader_id } = req.body;
            const result = await AssignmentModel.assignTourLeader(req.params.id, tour_leader_id);
            res.status(201).json({ success: true, message: 'Tour leader assigned', data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    getTourLeaders: async (req, res) => {
        try {
            const leaders = await AssignmentModel.getTourLeadersByGroup(req.params.id);
            res.json({ success: true, message: 'Tour leaders retrieved', data: leaders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    unassignTourLeader: async (req, res) => {
        try {
            await AssignmentModel.unassignTourLeader(req.params.id, req.params.leaderId);
            res.json({ success: true, message: 'Tour leader unassigned', data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // Muthawifs
    assignMuthawif: async (req, res) => {
        try {
            const { muthawif_id } = req.body;
            const result = await AssignmentModel.assignMuthawif(req.params.id, muthawif_id);
            res.status(201).json({ success: true, message: 'Muthawif assigned', data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    getMuthawifs: async (req, res) => {
        try {
            const muthawifs = await AssignmentModel.getMuthawifsByGroup(req.params.id);
            res.json({ success: true, message: 'Muthawifs retrieved', data: muthawifs });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    unassignMuthawif: async (req, res) => {
        try {
            await AssignmentModel.unassignMuthawif(req.params.id, req.params.muthawifId);
            res.json({ success: true, message: 'Muthawif unassigned', data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // Staff lists for dropdowns
    getAllTourLeaders: async (req, res) => {
        try {
            const leaders = await TourLeaderModel.findAll();
            res.json({ success: true, message: 'All tour leaders retrieved', data: leaders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    getAllMuthawifs: async (req, res) => {
        try {
            const muthawifs = await MuthawifModel.findAll();
            res.json({ success: true, message: 'All muthawifs retrieved', data: muthawifs });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default AssignmentController;
