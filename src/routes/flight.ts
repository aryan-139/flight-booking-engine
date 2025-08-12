import { FlightController } from '../controllers/FlightController';
import { Router } from 'express';

const router = Router();

router.post('/', FlightController.createFlight);

export default router;