import { Flight } from '../models/Flight';
import SupabaseConnection from '../database/supabase';
import { Logger } from '../utils/logger';

export class FlightDAL {
    private static supabase = SupabaseConnection.getInstance();

    public static async createFlight(req: any): Promise<Flight> {
        try {
            let flightData = {
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

    public static async getAllFlights(): Promise<Flight[]> {
        try {
            const data = await this.supabase.query('flights');
            return data;
        } catch (error: any) {
            Logger.error('Failed to fetch flights', { error });
            throw error;
        }
    }

    public static async searchFlights(searchParams: any): Promise<Flight[]> {
        try {
            const supabase = SupabaseConnection.getInstance().getClient();
            let queryBuilder = supabase
                .from('flights')
                .select('*');
            if (searchParams.origin) {
                queryBuilder = queryBuilder.eq('origin', searchParams.origin);
            }
            if (searchParams.destination) {
                queryBuilder = queryBuilder.eq('destination', searchParams.destination);
            }
            if (searchParams.cabin) {
                queryBuilder = queryBuilder.eq('cabin_class', searchParams.cabin);
            }
            if (searchParams.depart_date) {
                const startDate = new Date(searchParams.depart_date);
                startDate.setUTCHours(0, 0, 0, 0);
                const endDate = new Date(startDate);
                endDate.setUTCDate(startDate.getUTCDate() + 1);
                queryBuilder = queryBuilder.gte('departure_time', startDate.toISOString());
                queryBuilder = queryBuilder.lt('departure_time', endDate.toISOString());
            }
            if (searchParams.adults) {
                const totalPassengers = searchParams.adults;
                queryBuilder = queryBuilder.gte('seats_available', totalPassengers);
            }
            queryBuilder = queryBuilder.order('departure_time', { ascending: true });
            const page = searchParams.page_number ? parseInt(searchParams.page_number, 10) : 1;
            const pageSize = searchParams.page_size ? parseInt(searchParams.page_size, 10) : 10;
            const offset = (page - 1) * pageSize;
            const to = offset + pageSize - 1;
            queryBuilder = queryBuilder.range(offset, to);
            const { data, error } = await queryBuilder;

            if (error) {
                Logger.error('Failed to search flights', { error });
                throw error;
            }

            return data as Flight[];
        } catch (error: any) {
            Logger.error('Failed to search flights', { error });
            throw error;
        }
    }

    public static async getFlightById(flightId: string): Promise<Flight> {
        try {
            const data = await this.supabase.query('flights', {
                filters: { flight_id: flightId }
            });
            return data[0]; // Return the first (and should be only) result
        } catch (error: any) {
            Logger.error('Failed to fetch flight', { error });
            throw error;
        }
    }
}