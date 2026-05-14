import { createClient } from 'redis';
import dotenv from 'dotenv';
import { HealthStatus, HealthStatusSchema } from '../types';
import { logger } from './loggerService';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => logger.error('Redis Client Error', err));

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    logger.info('Connected to Redis');
  }
};

export const saveStatus = async (status: HealthStatus) => {
  await client.hSet('health_status', status.url, JSON.stringify(status));
};

export const getAllStatuses = async (): Promise<HealthStatus[]> => {
  const statuses = await client.hGetAll('health_status');
  return Object.values(statuses)
    .map((s) => {
      try {
        return HealthStatusSchema.parse(JSON.parse(s));
      } catch (error) {
        logger.error(`Failed to parse status from Redis: ${s}`, error);
        return null;
      }
    })
    .filter((s): s is HealthStatus => s !== null);
};
