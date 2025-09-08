import { Booking, CreateBookingRequest, UpdateBookingRequest } from '../models/Booking';
import SupabaseConnection from '../database/supabase';
import { Logger } from '../utils/logger';

export class BookingDAL {
    private static supabase = SupabaseConnection.getInstance();

    public static async createBooking(req: CreateBookingRequest): Promise<Booking> {
        try {
            const bookingData = {
                user_id: req.user_id,
                flight_id: req.flight_id,
                booking_type: req.booking_type,
                passenger_info: req.passenger_info,
                payment_status: 'pending' as const,
                total_price: req.total_price || 0, // Use provided price or default to 0
                payment_method: req.payment_method,
                seat_numbers: req.seat_numbers,
                special_requests: req.special_requests || {},
                booking_source: req.booking_source,
                promocode_used: req.promocode_used || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const data = await this.supabase.insert('bookings', bookingData);
            return data;
        } catch (error: any) {
            Logger.error('Failed to create booking', { error });
            throw error;
        }
    }

    public static async getBookingById(bookingId: string): Promise<Booking | null> {
        try {
            const data = await this.supabase.query('bookings', {
                filters: { booking_id: bookingId }
            });
            return data[0] || null;
        } catch (error: any) {
            Logger.error('Failed to fetch booking by ID', { error });
            throw error;
        }
    }

    public static async getBookingsByUserId(userId: string): Promise<Booking[]> {
        try {
            const data = await this.supabase.query('bookings', {
                filters: { user_id: userId }
            });
            return data;
        } catch (error: any) {
            Logger.error('Failed to fetch bookings by user ID', { error });
            throw error;
        }
    }

    public static async updateBooking(bookingId: string, updateData: UpdateBookingRequest): Promise<Booking> {
        try {
            const data = {
                ...updateData,
                updated_at: new Date().toISOString()
            };

            // Update using booking_id as the primary key
            const result = await this.supabase.updateByField('bookings', 'booking_id', bookingId, data);
            return result;
        } catch (error: any) {
            Logger.error('Failed to update booking', { error });
            throw error;
        }
    }

    public static async getAllBookings(): Promise<Booking[]> {
        try {
            const data = await this.supabase.query('bookings');
            return data;
        } catch (error: any) {
            Logger.error('Failed to fetch all bookings', { error });
            throw error;
        }
    }

    public static async deleteBooking(bookingId: string): Promise<boolean> {
        try {
            // Delete using booking_id as the primary key
            await this.supabase.deleteByField('bookings', 'booking_id', bookingId);
            return true;
        } catch (error: any) {
            Logger.error('Failed to delete booking', { error });
            throw error;
        }
    }
}
