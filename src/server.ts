import express from 'express';
import cors from 'cors';
import { config } from './config/env.config.js';
import { customCors, corsOptions } from './core/middleware/cors.middleware.js';
import { connectDatabase } from './config/database.config.js';
import { logger } from './core/utils/logger.js';
import { errorHandler, requestLogger } from './core/middleware/request-lifecycle.middleware.js';
import { AppRoutes } from './routes.js';

const app = express();
const PORT = config.port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(customCors);
app.options(/(.*)/, cors(corsOptions));
// Request logging (security-focused)
app.use(requestLogger);

// Routes
const routes = new AppRoutes();
app.use('/api', routes.getRouter());

// Global error handler (must be after routes)
app.use(errorHandler);

startServer();
 
export async function startServer(): Promise<void> {
	try {
		await connectDatabase();
		logger.info('Database connection established');

		app.listen(PORT, () => {
			logger.info(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		logger.error('Failed to start server', { error });
		process.exit(1);
	}
}


