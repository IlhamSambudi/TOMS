import { Router } from 'express';
import TrainController from '../controllers/trainController.js';

const router = Router({ mergeParams: true });

router.get('/', TrainController.getByGroup);
router.post('/', TrainController.create);
router.put('/:trainId', TrainController.update);
router.delete('/:trainId', TrainController.delete);

export default router;
