
import SupabaseConnection from '../database/supabase';
import { Logger } from '../utils/logger';

interface Flight {
    id: string;
    flight_number: string;
    airline: string;
    origin: string;
    destination: string;
    departure_time: Date;
    arrival_time: Date;
    duration: number;
    price: number;
    seats_available: number;
    cabin_class: string;
    created_at?: string;
}

export class FlightDAL {
    private static supabase = SupabaseConnection.getInstance();

    public static async createFlight(flightData: any): Promise<Flight> {
        try {
            const data = await this.supabase.insert('flights', flightData);
            console.log('Inserted flight data:', data);
            return data;
        } catch (error: any) {
            Logger.error('Failed to create flight', { error });
            throw error;
        }
    }
}