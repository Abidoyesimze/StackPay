import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './utils/logger';
import { db } from './config/database';
import { redis } from './config/redis';
import { apiLimiter } from './middleware/rate-limit';
import { errorHandler } from './middleware/error-handler';

// Import routes
import invoiceRoutes from './routes/invoices';
import webhookRoutes from './routes/webhooks';
import paymentRoutes from './routes/payments';
import convertRoutes from './routes/convert';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// API routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/convert', convertRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Server startup
async function startServer() {
  try {
    // Connect to Redis
    await redis.connect();
    logger.info('Redis connected');

    // Test database connection
    await db.query('SELECT NOW()');
    logger.info('Database connected');

    // Start server
    const server = app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`);
      logger.info(`Environment: ${config.server.nodeEnv}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing server');
      server.close(async () => {
        await db.close();
        await redis.close();
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();

export default app;
