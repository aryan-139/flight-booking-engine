import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to all booking routes
router.use(rateLimiter);

// Create a new booking
router.post('/', BookingController.createBooking);

// Get booking by ID
router.get('/:id', BookingController.getBookingById);

// Get bookings by user ID
router.get('/', BookingController.getBookingsByUserId);

// Update booking
router.put('/:id', BookingController.updateBooking);

// Delete booking
router.delete('/:id', BookingController.deleteBooking);

// Get all bookings (admin route)
router.get('/admin/all', BookingController.getAllBookings);

export default router;
