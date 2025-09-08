import { Router } from 'express';
import adminRoutes from './admin';
import flightRoutes from './flight';
import passengerRoutes from './passenger';
import bookingRoutes from './booking';

const router = Router();

// API routes
router.use('/api/admin', adminRoutes);
router.use('/api/flight', flightRoutes);
router.use('/api/passenger', passengerRoutes);
router.use('/api/booking', bookingRoutes);

// Root route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Flight Booking Engine API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

export default router; 