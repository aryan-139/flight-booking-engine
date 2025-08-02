import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1')
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    }
}; 