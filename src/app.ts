import 'dotenv/config';
import { configureServer } from './config/server';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import routes from './routes';

// Initialize Express app
const app = configureServer();

// API routes
app.use('/api', routes);

// Connect to MongoDB
connectDatabase();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack || '');
  
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack || '');
  
  // Close server & exit process
  process.exit(1);
});

export default app;
