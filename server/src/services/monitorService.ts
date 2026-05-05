import axios from 'axios';
import { saveStatus } from './redisService';
import { HealthStatus } from '../types';
import { logger } from './loggerService';

const pingUrl = async (url: string): Promise<HealthStatus> => {
  const start = Date.now();
  try {
    await axios.get(url, { timeout: 10000 });
    const latency = Date.now() - start;
    return {
      url,
      status: 'up',
      latency,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    const latency = Date.now() - start;
    return {
      url,
      status: 'down',
      latency,
      lastChecked: new Date().toISOString(),
    };
  }
};

export const startMonitoring = () => {
  const urls = process.env.URLS_TO_MONITOR?.split(',') || [];
  const interval = parseInt(process.env.MONITOR_INTERVAL || '60000', 10);

  logger.info(`Starting monitoring for ${urls.length} URLs every ${interval}ms`);

  const runPings = async () => {
    for (const url of urls) {
      const status = await pingUrl(url.trim());
      await saveStatus(status);
      logger.info(`Checked ${url}: ${status.status} (${status.latency}ms)`);
    }
  };

  runPings();
  setInterval(runPings, interval);
};
