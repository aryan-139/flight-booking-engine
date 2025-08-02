import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../../config/app';
import { Logger } from '../utils/logger';
import { AppError } from '../exception/AppError';

interface RateLimitData {
    count: number;
    resetTime: number;
    banned: boolean;
    banExpiry?: number;
}

class RateLimiter {
    private static instance: RateLimiter;
    private ipStore: Map<string, RateLimitData> = new Map();
    private bannedIPs: Set<string> = new Set();

    private constructor() {
        // Clean up expired entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    public static getInstance(): RateLimiter {
        if (!RateLimiter.instance) {
            RateLimiter.instance = new RateLimiter();
        }
        return RateLimiter.instance;
    }

    private getClientIP(req: Request): string {
        const xForwardedFor = req.headers['x-forwarded-for'] as string;
        const ip =
            xForwardedFor?.split(',')[0]?.trim() ||  // Client IP from proxy
            req.socket?.remoteAddress ||             // Raw socket info
            req.ip ||                                // Express IP (used only if trust proxy is enabled)
            'unknown';
    
        const normalizedIP = ip === '::1' ? '127.0.0.1' : ip;
    
        Logger.debug(`Client IP detected: ${normalizedIP}`);
        return normalizedIP;
    }    

    private isIPBanned(ip: string): boolean {
        const bannedData = this.ipStore.get(ip);
        if (bannedData?.banned && bannedData.banExpiry) {
            if (Date.now() > bannedData.banExpiry) {
                // Ban expired, remove it
                this.ipStore.delete(ip);
                this.bannedIPs.delete(ip);
                return false;
            }
            return true;
        }
        return false;
    }

    private banIP(ip: string, duration: number = 3600000): void { // Default 1 hour ban
        const banExpiry = Date.now() + duration;
        this.ipStore.set(ip, {
            count: 0,
            resetTime: Date.now() + appConfig.rateLimit.windowMs,
            banned: true,
            banExpiry
        });
        this.bannedIPs.add(ip);
        Logger.warn(`IP ${ip} has been banned for ${duration / 1000} seconds`);
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [ip, data] of this.ipStore.entries()) {
            if (now > data.resetTime && !data.banned) {
                this.ipStore.delete(ip);
            }
        }
    }

    public checkRateLimit(req: Request): { allowed: boolean; remaining: number; resetTime: number } {
        const ip = this.getClientIP(req);

        // Check if IP is banned
        if (this.isIPBanned(ip)) {
            throw new AppError('IP address is banned due to excessive requests', 429);
        }

        const now = Date.now();
        const windowMs = appConfig.rateLimit.windowMs;
        const maxRequests = appConfig.rateLimit.maxRequests;

        let data = this.ipStore.get(ip);

        if (!data) {
            data = {
                count: 0,
                resetTime: now + windowMs,
                banned: false
            };
            this.ipStore.set(ip, data);
        }

        // Reset counter if window has expired
        if (now > data.resetTime) {
            data.count = 0;
            data.resetTime = now + windowMs;
            data.banned = false;
        }

        // Increment counter
        data.count++;

        // Check if limit exceeded
        if (data.count > maxRequests) {
            // Ban the IP for excessive requests
            this.banIP(ip);
            throw new AppError('Rate limit exceeded. IP has been banned temporarily.', 429);
        }

        return {
            allowed: true,
            remaining: Math.max(0, maxRequests - data.count),
            resetTime: data.resetTime
        };
    }

    public getBannedIPs(): string[] {
        return Array.from(this.bannedIPs);
    }

    public unbanIP(ip: string): boolean {
        const data = this.ipStore.get(ip);
        if (data?.banned) {
            data.banned = false;
            delete data.banExpiry;
            this.bannedIPs.delete(ip);
            Logger.info(`IP ${ip} has been unbanned`);
            return true;
        }
        return false;
    }
}

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const limiter = RateLimiter.getInstance();
        const result = limiter.checkRateLimit(req);

        // Add rate limit headers
        res.set({
            'X-RateLimit-Limit': appConfig.rateLimit.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
        });
        Logger.debug(`Rate limit check for IP ${req.ip}: ${result.remaining} requests remaining`);
        next();
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                error: 'Rate Limit Exceeded',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            next(error);
        }
    }
};

// Export the RateLimiter class for admin operations
export { RateLimiter };