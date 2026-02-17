import { Router } from 'express';
import TransportController from '../controllers/transportController.js';

const router = Router();

router.get('/', TransportController.getAll);

export default router;
