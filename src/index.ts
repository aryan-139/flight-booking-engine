import app from './app';
import { appConfig } from '../config/app';
import { Logger } from './utils/logger';

const PORT = appConfig.port;

// Start server
app.listen(PORT, () => {
    Logger.info(`🚀 Flight Booking Engine server running on port ${PORT}`);
    Logger.info(`📡 API available at http://localhost:${PORT}`);
    Logger.info(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 