import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middleware/errorHandler';
import { connectRedis, getAllStatuses } from './services/redisService';
import { startMonitoring, triggerManualRefresh } from './services/monitorService';
import { logger } from './services/loggerService';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/status', async (req, res, next) => {
  try {
    const statuses = await getAllStatuses();
    res.json(statuses);
  } catch (error) {
    next(error);
  }
});

app.post('/api/refresh', async (req, res, next) => {
  try {
    const statuses = await triggerManualRefresh();
    res.json(statuses);
  } catch (error) {
    next(error);
  }
});

app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectRedis();
    startMonitoring();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
