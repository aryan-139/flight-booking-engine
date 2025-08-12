import { FlightDAL } from '../dal/flightDAL';
import SupabaseConnection from '../database/supabase';
import { Flight, CreateFlightRequest } from '../models/Flight';
import { Logger } from '../utils/logger';

export class FlightService {
    private static supabase = SupabaseConnection.getInstance();

    public static async createFlight(flightData: any): Promise<any> {
        try {
            const flight = await FlightDAL.createFlight(flightData);
            return flight;
        } catch (error: any) {
            Logger.error('Failed to create flight', { error });
            throw error;
        }
    }

} 