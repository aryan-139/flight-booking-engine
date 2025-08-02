import { Router } from 'express';
import helloRoutes from './hello';
import adminRoutes from './admin';
import SupabaseConnection from '../database/supabase';

const router = Router();

// API routes
router.use('/api', helloRoutes);
//router.use('/api/auth', authRoutes);
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

router.post('/', async (req, res): Promise<void> => {
    try {
        const supabase = SupabaseConnection.getInstance();
        const { data, error } = await supabase.insert('flights', [
            {
                flight_number: 'AI202',
                airline: 'Air India',
                origin: 'DEL',
                destination: 'BOM',
                departure_time: '2025-08-02T06:00:00Z',
                arrival_time: '2025-08-02T08:30:00Z',
                duration: 150, 
                price: 7999,
                seats_available: 42,
                cabin_class: 'Economy',
                created_at: new Date().toTimeString().split(' ')[0] // if required by `time without time zone`
              }
        ]);

        if (error) {
            res.status(500).json({ error: error.message });
            return; 
        }

        res.json({
            message: 'Flight inserted successfully',
            data,
            timestamp: new Date().toISOString()
        });
        return; // ✅ end of route handler

    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Unknown error occurred' });
        return;
    }
});



export default router; 