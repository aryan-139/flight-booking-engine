import { Request, Response } from 'express';
import { FlightService } from '../services/FlightService';
import { ResponseHelper } from '../helpers/response';
import { Logger } from '../utils/logger';
import { flightPayloadSchema, flightSearchQuerySchema } from '../validators/flight';

export class FlightController {
    public static async createFlight(req: Request, res: Response): Promise<void> {
        try {
            const result = flightPayloadSchema.safeParse(req.body);
            if (!result.success) return ResponseHelper.error(res, result.error.message, 400);
            const flightData = result.data;
            const flight = await FlightService.createFlight(flightData);
            ResponseHelper.success(res, flight, 'Flight created successfully', 201);
        } catch (error: any) {
            Logger.error('Failed to create flight', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }

    public static async getAllFlights(req: Request, res: Response): Promise<void> {
        try {
            const flights = await FlightService.getAllFlights();
            ResponseHelper.success(res, flights, 'Flights fetched successfully', 200);
        } catch (error: any) {
            Logger.error('Failed to fetch flights', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }

    public static async searchFlights(req: Request, res: Response): Promise<void> {
        try {
            parseInt(req.query.adults as string); 
            console.log(req.query.adults);
            const result = flightSearchQuerySchema.safeParse(req.query);
            if (!result.success) {
                return ResponseHelper.error(res, result.error.message, 400);
            }
            
            const searchParams = result.data;
            const flights = await FlightService.searchFlights(searchParams);

            const response = {
                flights,
                total: flights.length,
                search_params: searchParams
            };

            ResponseHelper.success(res, response, 'Flights searched successfully', 200);
        } catch (error: any) {
            Logger.error('Failed to search flights', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }
} 