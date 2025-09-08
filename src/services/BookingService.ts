import { Booking, CreateBookingRequest, UpdateBookingRequest } from '../models/Booking';
import { BookingDAL } from '../dal/bookingDAL';
import { FlightDAL } from '../dal/flightDAL';
import { PassengerDAL } from '../dal/passengerDAL';
import { AppError } from '../exception/AppError';
import { Logger } from '../utils/logger';

export class BookingService {
    public static async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
        try {
            // Validate flight exists
            const flight = await FlightDAL.getFlightById(bookingData.flight_id.toString());
            if (!flight) {
                throw new AppError('Flight not found', 404);
            }

            // Validate passengers exist
            for (const passengerId of bookingData.passenger_info) {
                const passenger = await PassengerDAL.getPassengerById(passengerId.toString());
                if (!passenger) {
                    throw new AppError(`Passenger with ID ${passengerId} not found`, 404);
                }
            }

            // Check seat availability
            if (flight.seats_available < bookingData.passenger_info.length) {
                throw new AppError('Not enough seats available', 400);
            }

            // Calculate total price (use provided price or calculate from flight price)
            const totalPrice = bookingData.total_price || (flight.price * bookingData.passenger_info.length);

            // Create booking with price
            const bookingRequest = {
                ...bookingData,
                total_price: totalPrice
            };

            const booking = await BookingDAL.createBooking(bookingRequest);

            // Update flight seats
            const updatedSeats = flight.seats_available - bookingData.passenger_info.length;
            await FlightDAL.updateFlight(flight.flight_id.toString(), { seats_available: updatedSeats });

            Logger.info('Booking created successfully', { bookingId: booking.booking_id });
            return booking;
        } catch (error: any) {
            Logger.error('Failed to create booking', { error });
            throw error;
        }
    }

    public static async getBookingById(bookingId: string): Promise<Booking> {
        try {
            const booking = await BookingDAL.getBookingById(bookingId);
            if (!booking) {
                throw new AppError('Booking not found', 404);
            }
            return booking;
        } catch (error: any) {
            Logger.error('Failed to get booking by ID', { error });
            throw error;
        }
    }

    public static async getBookingsByUserId(userId: string): Promise<Booking[]> {
        try {
            const bookings = await BookingDAL.getBookingsByUserId(userId);
            return bookings;
        } catch (error: any) {
            Logger.error('Failed to get bookings by user ID', { error });
            throw error;
        }
    }

    public static async updateBooking(bookingId: string, updateData: UpdateBookingRequest): Promise<Booking> {
        try {
            // Check if booking exists
            const existingBooking = await BookingDAL.getBookingById(bookingId);
            if (!existingBooking) {
                throw new AppError('Booking not found', 404);
            }

            // Convert payment_date string to Date if provided
            const processedUpdateData = { ...updateData };
            if (processedUpdateData.payment_date && typeof processedUpdateData.payment_date === 'string') {
                processedUpdateData.payment_date = new Date(processedUpdateData.payment_date);
            }

            const updatedBooking = await BookingDAL.updateBooking(bookingId, processedUpdateData);
            Logger.info('Booking updated successfully', { bookingId });
            return updatedBooking;
        } catch (error: any) {
            Logger.error('Failed to update booking', { error });
            throw error;
        }
    }

    public static async getAllBookings(): Promise<Booking[]> {
        try {
            const bookings = await BookingDAL.getAllBookings();
            return bookings;
        } catch (error: any) {
            Logger.error('Failed to get all bookings', { error });
            throw error;
        }
    }

    public static async deleteBooking(bookingId: string): Promise<boolean> {
        try {
            // Check if booking exists
            const existingBooking = await BookingDAL.getBookingById(bookingId);
            if (!existingBooking) {
                throw new AppError('Booking not found', 404);
            }

            // If booking is confirmed, we might want to restore seats
            if (existingBooking.payment_status === 'confirmed') {
                const flight = await FlightDAL.getFlightById(existingBooking.flight_id.toString());
                if (flight) {
                    const restoredSeats = flight.seats_available + existingBooking.passenger_info.length;
                    await FlightDAL.updateFlight(flight.flight_id.toString(), { seats_available: restoredSeats });
                }
            }

            const result = await BookingDAL.deleteBooking(bookingId);
            Logger.info('Booking deleted successfully', { bookingId });
            return result;
        } catch (error: any) {
            Logger.error('Failed to delete booking', { error });
            throw error;
        }
    }
}
