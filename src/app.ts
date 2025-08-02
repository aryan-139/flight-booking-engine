import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { appConfig } from '../config/app';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { rateLimiter } from './middleware/rateLimiter';
import { Logger } from './utils/logger';
import { DatabaseService } from './services/DatabaseService';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy - this enables req.ip to work properly
app.set('trust proxy', true);

// Middleware
app.use(helmet()); // Security headers
app.use(cors(appConfig.cors)); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Apply rate limiter to all routes
app.use(rateLimiter); 

// Test database connection on startup
DatabaseService.testConnection()
    .then((isConnected) => {
        if (isConnected) {
            Logger.info('Database connection successful');
        } else {
            Logger.error('Database connection failed');
        }
    })
    .catch((error) => {
        Logger.error('Database connection error', { error });
    });

// Routes
app.use(routes);

// 404 handler
app.use('*', notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app; 