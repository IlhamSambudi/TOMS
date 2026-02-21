import { Router } from 'express';
import HotelController from '../controllers/hotelController.js';

const router = Router({ mergeParams: true });

router.get('/', HotelController.getByGroup);
router.post('/', HotelController.create);
router.put('/:hotelId', HotelController.update);
router.delete('/:hotelId', HotelController.delete);

export default router;
