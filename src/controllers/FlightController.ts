import { Request, Response } from 'express';
import { FlightService } from '../services/FlightService';
import { ResponseHelper } from '../helpers/response';
import { Logger } from '../utils/logger';

export class FlightController {
    public static async getAllFlights(req: Request, res: Response): Promise<void> {
        try {
            const flights = await FlightService.getAllFlights();
            ResponseHelper.success(res, { flights }, 'Flights retrieved successfully');
        } catch (error) {
            Logger.error('Failed to get all flights', { error });
            ResponseHelper.error(res, 'Failed to retrieve flights', 500);
        }
    }

    public static async getFlightById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const flight = await FlightService.getFlightById(id);
            
            if (!flight) {
                ResponseHelper.error(res, 'Flight not found', 404);
                return;
            }

            ResponseHelper.success(res, { flight }, 'Flight retrieved successfully');
        } catch (error) {
            Logger.error('Failed to get flight by id', { error });
            ResponseHelper.error(res, 'Failed to retrieve flight', 500);
        }
    }

    public static async createFlight(req: Request, res: Response): Promise<void> {
        try {
            const flightData = req.body;
            const flight = await FlightService.createFlight(flightData);
            ResponseHelper.success(res, { flight }, 'Flight created successfully', 201);
        } catch (error) {
            Logger.error('Failed to create flight', { error });
            ResponseHelper.error(res, 'Failed to create flight', 500);
        }
    }

    public static async insertTestFlight(req: Request, res: Response): Promise<void> {
        try {
            const flight = await FlightService.insertTestFlight();
            ResponseHelper.success(res, { flight }, 'Test flight inserted successfully', 201);
        } catch (error) {
            Logger.error('Failed to insert test flight', { error });
            ResponseHelper.error(res, 'Failed to insert test flight', 500);
        }
    }

    public static async searchFlights(req: Request, res: Response): Promise<void> {
        try {
            const { origin, destination, date } = req.query;
            const flights = await FlightService.searchFlights(
                origin as string,
                destination as string,
                date as string
            );
            ResponseHelper.success(res, { flights }, 'Flight search completed successfully');
        } catch (error) {
            Logger.error('Failed to search flights', { error });
            ResponseHelper.error(res, 'Failed to search flights', 500);
        }
    }
} 