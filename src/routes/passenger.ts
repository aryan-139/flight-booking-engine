import { Router } from 'express';
import { PassengerController } from '../controllers/PassengerController';

const router = Router();

// POST /api/passenger - Create a new passenger
router.post('/', PassengerController.createPassenger);

// GET /api/passenger/user/:user_id - Get all passengers by user ID
router.get('/user/:user_id', PassengerController.getPassengersByUserId);

// GET /api/passenger/:passenger_id - Get passenger by ID
router.get('/:passenger_id', PassengerController.getPassengerById);

// PUT /api/passenger/:passenger_id - Update passenger
router.put('/:passenger_id', PassengerController.updatePassenger);

// DELETE /api/passenger/:passenger_id - Delete passenger
router.delete('/:passenger_id', PassengerController.deletePassenger);

export default router;
