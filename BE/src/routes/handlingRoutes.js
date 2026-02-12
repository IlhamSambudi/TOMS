import express from 'express';
import HandlingController from '../controllers/handlingController.js';

const router = express.Router();

router.get('/', HandlingController.getAll);
router.post('/', HandlingController.create);

export default router;
