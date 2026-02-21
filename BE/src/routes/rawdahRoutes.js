import express from 'express';
import RawdahController from '../controllers/rawdahController.js';

const router = express.Router();

router.get('/', RawdahController.getAll);
router.get('/group/:groupId', RawdahController.getByGroup);
router.put('/group/:groupId', RawdahController.upsert);

export default router;
