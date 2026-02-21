import { Router } from 'express';
import AssignmentController from '../controllers/assignmentController.js';

const router = Router();

// Standalone assignment routes
router.get('/', AssignmentController.getAll);

// Get all staff for dropdowns
router.get('/tour-leaders', AssignmentController.getAllTourLeaders);
router.get('/muthawifs', AssignmentController.getAllMuthawifs);

export default router;
