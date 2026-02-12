import { Router } from 'express';
import TransportController from '../controllers/transportController.js';

const router = Router({ mergeParams: true });

router.get('/', TransportController.getByGroup);
router.post('/', TransportController.create);
router.put('/:transportId', TransportController.update);
router.delete('/:transportId', TransportController.delete);

export default router;
