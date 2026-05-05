import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { globalErrorHandler } from './middleware/errorHandler';
import { connectRedis, getAllStatuses } from './services/redisService';
import { startMonitoring } from './services/monitorService';

dotenv.config();

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

app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectRedis();
    startMonitoring();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
