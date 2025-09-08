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

    public static async getAllFlights(): Promise<Flight[]> {
        try {
            const flights = await FlightDAL.getAllFlights();
            return flights;
        } catch (error: any) {
            Logger.error('Failed to fetch flights', { error });
            throw error;
        }
    }

    public static async searchFlights(query: any): Promise<Flight[]> {
        try {
            const flights = await FlightDAL.searchFlights(query);
            //whenever a search query is made, capture the ORIGIN, DESTINATION for analytics, reminders 
            
            return flights;
        } catch (error: any) {
            Logger.error('Failed to fetch flights', { error });
            throw error;
        }
    }

    public static async getFlightById(flightId: string): Promise<Flight> {
        try {
            const flight = await FlightDAL.getFlightById(flightId);
            return flight;
        } catch (error: any) {
            Logger.error('Failed to fetch flight', { error });
            throw error;
        }
    }

} 