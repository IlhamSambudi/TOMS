import { Router } from 'express';
import AssignmentController from '../controllers/assignmentController.js';

const router = Router({ mergeParams: true });

// Tour Leaders
router.get('/tour-leaders', AssignmentController.getTourLeaders);
router.post('/tour-leaders', AssignmentController.assignTourLeader);
router.delete('/tour-leaders/:leaderId', AssignmentController.unassignTourLeader);

// Muthawifs
router.get('/muthawifs', AssignmentController.getMuthawifs);
router.post('/muthawifs', AssignmentController.assignMuthawif);
router.delete('/muthawifs/:muthawifId', AssignmentController.unassignMuthawif);

export default router;
