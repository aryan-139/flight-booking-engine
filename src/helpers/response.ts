import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: string;
}

export class ResponseHelper {
    public static success<T>(
        res: Response,
        data: T,
        message: string = 'Success',
        statusCode: number = 200
    ): void {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };

        res.status(statusCode).json(response);
    }

    public static error(
        res: Response,
        message: string = 'Error occurred',
        statusCode: number = 500,
        data?: any
    ): void {
        const response: ApiResponse = {
            success: false,
            message,
            data,
            timestamp: new Date().toISOString()
        };

        res.status(statusCode).json(response);
    }

    public static created<T>(
        res: Response,
        data: T,
        message: string = 'Resource created successfully'
    ): void {
        this.success(res, data, message, 201);
    }

    public static noContent(res: Response): void {
        res.status(204).send();
    }
} 