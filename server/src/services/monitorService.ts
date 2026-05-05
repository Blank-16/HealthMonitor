import axios from 'axios';
import { saveStatus } from './redisService';
import { HealthStatus } from '../types';
import { logger } from './loggerService';

const pingUrl = async (url: string): Promise<HealthStatus> => {
  const start = Date.now();
  try {
    await axios.get(url, { timeout: 10000 });
    return {
      url,
      status: 'up',
      latency: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch {
    return {
      url,
      status: 'down',
      latency: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  }
};

export const startMonitoring = () => {
  const urls = process.env.URLS_TO_MONITOR?.split(',').map(u => u.trim()) || [];
  const interval = parseInt(process.env.MONITOR_INTERVAL || '60000', 10);

  logger.info(`Starting monitoring for ${urls.length} URLs every ${interval}ms`);

  const runPings = async () => {
    await Promise.all(
      urls.map(url =>
        pingUrl(url).then(async status => {
          await saveStatus(status);
          logger.info(`Checked ${url}: ${status.status} (${status.latency}ms)`);
        })
      )
    );
  };

  runPings();
  setInterval(runPings, interval);
};
