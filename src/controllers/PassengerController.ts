import { Request, Response } from 'express';
import { PassengerService } from '../services/PassengerService';
import { ResponseHelper } from '../helpers/response';
import { Logger } from '../utils/logger';
import { createPassengerSchema, getPassengerByUserIdSchema } from '../validators/passenger';

export class PassengerController {
    public static async createPassenger(req: Request, res: Response): Promise<void> {
        try {
            // Validate request body
            const result = createPassengerSchema.safeParse(req.body);
            if (!result.success) {
                return ResponseHelper.error(res, result.error.message, 400);
            }

            const passengerData = result.data;
            const passenger = await PassengerService.createPassenger(passengerData);

            ResponseHelper.success(res, passenger, 'Passenger created successfully', 201);
        } catch (error: any) {
            Logger.error('Failed to create passenger', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }

    public static async getPassengersByUserId(req: Request, res: Response): Promise<void> {
        try {
            // Validate user_id parameter
            const result = getPassengerByUserIdSchema.safeParse({ user_id: req.params.user_id });
            if (!result.success) {
                return ResponseHelper.error(res, result.error.message, 400);
            }

            const userId = result.data.user_id;
            const passengers = await PassengerService.getPassengersByUserId(userId);

            ResponseHelper.success(res, passengers, 'Passengers fetched successfully', 200);
        } catch (error: any) {
            Logger.error('Failed to fetch passengers by user ID', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }

    public static async getPassengerById(req: Request, res: Response): Promise<void> {
        try {
            const passengerId = req.params.passenger_id;
            if (!passengerId) {
                return ResponseHelper.error(res, 'Passenger ID is required', 400);
            }

            const passenger = await PassengerService.getPassengerById(passengerId);
            ResponseHelper.success(res, passenger, 'Passenger fetched successfully', 200);
        } catch (error: any) {
            Logger.error('Failed to fetch passenger by ID', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }

    public static async updatePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId = req.params.passenger_id;
            if (!passengerId) {
                return ResponseHelper.error(res, 'Passenger ID is required', 400);
            }

            // Validate request body (optional fields)
            const { name, dob, type } = req.body;
            const updateData: any = {};

            if (name !== undefined) updateData.name = name;
            if (dob !== undefined) updateData.dob = dob;
            if (type !== undefined) updateData.type = type;

            if (Object.keys(updateData).length === 0) {
                return ResponseHelper.error(res, 'At least one field must be provided for update', 400);
            }

            const passenger = await PassengerService.updatePassenger(passengerId, updateData);
            ResponseHelper.success(res, passenger, 'Passenger updated successfully', 200);
        } catch (error: any) {
            Logger.error('Failed to update passenger', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }

    public static async deletePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId = req.params.passenger_id;
            if (!passengerId) {
                return ResponseHelper.error(res, 'Passenger ID is required', 400);
            }

            const result = await PassengerService.deletePassenger(passengerId);
            ResponseHelper.success(res, { deleted: result }, 'Passenger deleted successfully', 200);
        } catch (error: any) {
            Logger.error('Failed to delete passenger', { error });
            return ResponseHelper.error(res, error?.message || 'Unknown error', 400);
        }
    }
}
