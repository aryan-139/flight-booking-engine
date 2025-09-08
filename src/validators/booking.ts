import { z } from 'zod';

export const createBookingSchema = z.object({
    user_id: z.string().min(1, 'User ID is required'),
    flight_id: z.number().int().positive('Flight ID must be a positive integer'),
    booking_type: z.enum(['one-way', 'round-trip']),
    passenger_info: z.array(z.number().int().positive('Passenger ID must be a positive integer'))
        .min(1, 'At least one passenger is required')
        .max(9, 'Maximum 9 passengers allowed per booking'),
    payment_method: z.enum(['card', 'upi', 'netbanking', 'wallet']),
    seat_numbers: z.any().refine((val) => {
        // Validate that seat_numbers is a valid JSON object
        if (typeof val === 'object' && val !== null) {
            return true;
        }
        return false;
    }, 'Seat numbers must be a valid JSON object'),
    special_requests: z.object({
        meal: z.string().optional(),
        wheelchair: z.boolean().optional()
    }).optional(),
    booking_source: z.enum(['web', 'mobile', 'agent']),
    promocode_used: z.string().max(50, 'Promocode must be 50 characters or less').optional(),
    total_price: z.number().min(0, 'Total price must be a positive number').optional()
});

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
    payment_status: z.enum(['pending', 'confirmed', 'processing', 'rejected']).optional(),
    payment_date: z.string().datetime().optional(),
    payment_method: z.enum(['card', 'upi', 'netbanking', 'wallet']).optional(),
    seat_numbers: z.any().optional(),
    special_requests: z.object({
        meal: z.string().optional(),
        wheelchair: z.boolean().optional()
    }).optional(),
    promocode_used: z.string().max(50, 'Promocode must be 50 characters or less').optional()
});

export type UpdateBookingPayload = z.infer<typeof updateBookingSchema>;

export const bookingIdSchema = z.object({
    id: z.string().min(1, 'Booking ID is required')
});

export type BookingIdParams = z.infer<typeof bookingIdSchema>;

export const userIdQuerySchema = z.object({
    user_id: z.string().min(1, 'User ID is required')
});

export type UserIdQuery = z.infer<typeof userIdQuerySchema>;
