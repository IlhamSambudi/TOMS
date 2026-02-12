import { Router } from 'express';
import FlightController from '../controllers/flightController.js';

const router = Router();

router.get('/', FlightController.getAll);
router.get('/:id', FlightController.getById);
router.post('/', FlightController.create);
router.put('/:id', FlightController.update);
router.delete('/:id', FlightController.delete);

export default router;
