import { createClient } from 'redis';
import dotenv from 'dotenv';
import { HealthStatus } from '../types';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log('Connected to Redis');
  }
};

export const saveStatus = async (status: HealthStatus) => {
  await connectRedis();
  await client.hSet('health_status', status.url, JSON.stringify(status));
};

export const getAllStatuses = async (): Promise<HealthStatus[]> => {
  await connectRedis();
  const statuses = await client.hGetAll('health_status');
  return Object.values(statuses).map((s) => JSON.parse(s));
};
