import express from 'express';
import { config } from './config/env.config.js';
import { customCors } from './core/middleware/cors.middleware.js';
import { connectDatabase } from './config/database.config.js';
import { logger } from './core/utils/logger.js';

const app = express();
const PORT = config.port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(customCors);

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


