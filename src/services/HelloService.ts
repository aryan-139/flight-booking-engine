import { Logger } from '../utils/logger';

export class HelloService {
    public static getHelloMessage(): string {
        Logger.info('Hello service called');
        return 'Hello World from Flight Booking Engine!';
    }

    public static getHealthStatus(): { status: string; uptime: number } {
        return {
            status: 'healthy',
            uptime: process.uptime()
        };
    }
} 