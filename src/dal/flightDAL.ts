import { Flight } from '../models/Flight';
import SupabaseConnection from '../database/supabase';
import { Logger } from '../utils/logger';

export class FlightDAL {
    private static supabase = SupabaseConnection.getInstance();

    public static async createFlight(req: any): Promise<Flight> {
        try {
            let flightData={
                flight_number: req.flight_number,
                airline: req.airline,
                origin: req.origin,
                destination: req.destination,
                departure_time: req.departure_time,
                arrival_time: req.arrival_time,
                duration: req.duration,
                price: req.price,
                seats_available: req.seats_available,
                total_seats: req.total_seats,
                cabin_class: req.cabin_class,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            const data = await this.supabase.insert('flights', flightData);
            return data;
        } catch (error: any) {
            Logger.error('Failed to create flight', { error });
            throw error;
        }
    }
}