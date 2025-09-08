import { FlightController } from '../controllers/FlightController';
import { Router } from 'express';

const router = Router();

router.post('/', FlightController.createFlight);
router.get('/all-flights', FlightController.getAllFlights);
router.get('/search-flights', FlightController.searchFlights);
router.get('/get-flight-by-id/:flight_id', FlightController.getFlightById);

export default router;