import { Request, Response } from 'express';
import { FlightService } from '../services/FlightService';
import { ResponseHelper } from '../helpers/response';
import { Logger } from '../utils/logger';
import { flightPayloadSchema } from '../validators/flight';

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
} 