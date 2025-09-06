import { FlightController } from '../controllers/FlightController';
import { Router } from 'express';

const router = Router();

router.post('/', FlightController.createFlight);
router.get('/all-flights', FlightController.getAllFlights);
router.get('/search-flights', FlightController.searchFlights);

export default router;