import { Request, Response } from 'express';

export class HelloController {
    public static hello(req: Request, res: Response): void {
        res.json({
            message: 'Hello World from Flight Booking Engine!',
            timestamp: new Date().toISOString(),
            endpoints: {
                flights: '/api/flights',
                bookings: '/api/bookings',
                users: '/api/users'
            }
        });
    }

    public static health(req: Request, res: Response): void {
        res.json({
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    }

    public static welcome(req: Request, res: Response): void {
        res.json({
            message: 'Welcome to Flight Booking Engine API',
            version: '1.0.0',
            status: 'running',
            timestamp: new Date().toISOString()
        });
    }
} 