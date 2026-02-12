import { Router } from 'express';
import GroupFlightController from '../controllers/groupFlightController.js';

// mergeParams so we get :id from parent (groupRoutes)
const router = Router({ mergeParams: true });

router.get('/', GroupFlightController.getSegments);
router.post('/', GroupFlightController.addSegment);
router.put('/:segmentId', GroupFlightController.updateSegment);
router.delete('/:segmentId', GroupFlightController.deleteSegment);

export default router;
