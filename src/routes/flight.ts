import { FlightController } from '../controllers/FlightController';
import { Router } from 'express';

const router = Router();

router.post('/', FlightController.createFlight);
router.get('/all-flights', FlightController.getAllFlights);

export default router;