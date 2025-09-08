import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';
import { createBookingSchema, updateBookingSchema, bookingIdSchema, userIdQuerySchema } from '../validators/booking';
import { AppError } from '../exception/AppError';
import { Logger } from '../utils/logger';
import { ResponseHelper } from '../helpers/response';

export class BookingController {
    public static async createBooking(req: Request, res: Response): Promise<void> {
        try {
            // Validate request body
            const validatedData = createBookingSchema.parse(req.body);

            const booking = await BookingService.createBooking(validatedData);

            ResponseHelper.created(res, booking, 'Booking created successfully');
        } catch (error: any) {
            Logger.error('Error in createBooking controller', { error });

            if (error instanceof AppError) {
                ResponseHelper.error(res, error.message, error.statusCode);
            } else if (error.name === 'ZodError') {
                ResponseHelper.error(res, 'Validation error: ' + error.errors.map((e: any) => e.message).join(', '), 400);
            } else {
                ResponseHelper.error(res, 'Internal server error', 500);
            }
        }
    }

    public static async getBookingById(req: Request, res: Response): Promise<void> {
        try {
            // Validate booking ID parameter
            const { id } = bookingIdSchema.parse(req.params);

            const booking = await BookingService.getBookingById(id);

            ResponseHelper.success(res, booking, 'Booking retrieved successfully');
        } catch (error: any) {
            Logger.error('Error in getBookingById controller', { error });

            if (error instanceof AppError) {
                ResponseHelper.error(res, error.message, error.statusCode);
            } else if (error.name === 'ZodError') {
                ResponseHelper.error(res, 'Invalid booking ID format', 400);
            } else {
                ResponseHelper.error(res, 'Internal server error', 500);
            }
        }
    }

    public static async getBookingsByUserId(req: Request, res: Response): Promise<void> {
        try {
            // Validate user ID query parameter
            const { user_id } = userIdQuerySchema.parse(req.query);

            const bookings = await BookingService.getBookingsByUserId(user_id);

            ResponseHelper.success(res, bookings, 'User bookings retrieved successfully');
        } catch (error: any) {
            Logger.error('Error in getBookingsByUserId controller', { error });

            if (error instanceof AppError) {
                ResponseHelper.error(res, error.message, error.statusCode);
            } else if (error.name === 'ZodError') {
                ResponseHelper.error(res, 'Invalid user ID', 400);
            } else {
                ResponseHelper.error(res, 'Internal server error', 500);
            }
        }
    }

    public static async updateBooking(req: Request, res: Response): Promise<void> {
        try {
            // Validate booking ID parameter
            const { id } = bookingIdSchema.parse(req.params);

            // Validate request body
            const validatedData = updateBookingSchema.parse(req.body);

            const booking = await BookingService.updateBooking(id, validatedData);

            ResponseHelper.success(res, booking, 'Booking updated successfully');
        } catch (error: any) {
            Logger.error('Error in updateBooking controller', { error });

            if (error instanceof AppError) {
                ResponseHelper.error(res, error.message, error.statusCode);
            } else if (error.name === 'ZodError') {
                ResponseHelper.error(res, 'Validation error: ' + error.errors.map((e: any) => e.message).join(', '), 400);
            } else {
                ResponseHelper.error(res, 'Internal server error', 500);
            }
        }
    }

    public static async getAllBookings(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await BookingService.getAllBookings();

            ResponseHelper.success(res, bookings, 'All bookings retrieved successfully');
        } catch (error: any) {
            Logger.error('Error in getAllBookings controller', { error });

            if (error instanceof AppError) {
                ResponseHelper.error(res, error.message, error.statusCode);
            } else {
                ResponseHelper.error(res, 'Internal server error', 500);
            }
        }
    }

    public static async deleteBooking(req: Request, res: Response): Promise<void> {
        try {
            // Validate booking ID parameter
            const { id } = bookingIdSchema.parse(req.params);

            await BookingService.deleteBooking(id);

            ResponseHelper.success(res, null, 'Booking deleted successfully');
        } catch (error: any) {
            Logger.error('Error in deleteBooking controller', { error });

            if (error instanceof AppError) {
                ResponseHelper.error(res, error.message, error.statusCode);
            } else if (error.name === 'ZodError') {
                ResponseHelper.error(res, 'Invalid booking ID format', 400);
            } else {
                ResponseHelper.error(res, 'Internal server error', 500);
            }
        }
    }
}