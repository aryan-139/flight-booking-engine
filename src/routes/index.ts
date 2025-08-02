import { Router } from 'express';
import helloRoutes from './hello';
import adminRoutes from './admin';

const router = Router();

// API routes
router.use('/api', helloRoutes);
router.use('/api/admin', adminRoutes);

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