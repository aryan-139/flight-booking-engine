import SupabaseConnection from '../database/supabase';
import { Flight, CreateFlightRequest } from '../models/Flight';
import { Logger } from '../utils/logger';

export class FlightService {
    private static supabase = SupabaseConnection.getInstance();

    public static async getAllFlights(): Promise<Flight[]> {
        try {
            return await this.supabase.query('flights');
        } catch (error) {
            Logger.error('Failed to get all flights', { error });
            throw error;
        }
    }

    public static async getFlightById(id: string): Promise<Flight | null> {
        try {
            const flights = await this.supabase.query('flights', {
                filters: { id }
            });
            return flights.length > 0 ? flights[0] : null;
        } catch (error) {
            Logger.error('Failed to get flight by id', { error, id });
            throw error;
        }
    }

    public static async createFlight(flightData: CreateFlightRequest): Promise<Flight> {
        try {
            // Calculate duration in minutes
            const departureTime = new Date(flightData.departure_time);
            const arrivalTime = new Date(flightData.arrival_time);
            const duration = Math.round((arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60));

            const flightToInsert = {
                ...flightData,
                duration,
                seats_available: 222, // Default Airbus capacity
                total_seats: 222,
                created_at: new Date(),
                updated_at: new Date()
            };

            return await this.supabase.insert('flights', flightToInsert);
        } catch (error) {
            Logger.error('Failed to create flight', { error, flightData });
            throw error;
        }
    }

    public static async insertTestFlight(): Promise<Flight> {
        try {
            const testFlight: CreateFlightRequest = {
                flight_number: 'AI101',
                airline: 'Air India',
                origin: 'Mumbai (BOM)',
                destination: 'Delhi (DEL)',
                departure_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                arrival_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
                price: 8500,
                cabin_class: 'Economy'
            };

            return await this.createFlight(testFlight);
        } catch (error) {
            Logger.error('Failed to insert test flight', { error });
            throw error;
        }
    }

    public static async searchFlights(origin?: string, destination?: string, date?: string): Promise<Flight[]> {
        try {
            let query: any = {};
            
            if (origin) {
                query.filters = { ...query.filters, origin };
            }
            
            if (destination) {
                query.filters = { ...query.filters, destination };
            }

            const flights = await this.supabase.query('flights', query);
            
            // Filter by date if provided
            if (date) {
                const targetDate = new Date(date);
                return flights.filter((flight: Flight) => {
                    const flightDate = new Date(flight.departure_time);
                    return flightDate.toDateString() === targetDate.toDateString();
                });
            }

            return flights;
        } catch (error) {
            Logger.error('Failed to search flights', { error, origin, destination, date });
            throw error;
        }
    }
} 