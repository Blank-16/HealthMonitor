import axios from 'axios';
import { saveStatus } from './redisService';
import { HealthStatus } from '../types';
import { logger } from './loggerService';

const defaultUrls = [
  'https://google.com',
  'https://github.com',
  'https://openai.com',
  'https://microsoft.com',
  'https://apple.com',
  'https://amazon.com',
  'https://netflix.com',
  'https://spotify.com',
  'https://x.com',
  'https://linkedin.com'
];

const getUrlsToMonitor = () => {
  return process.env.URLS_TO_MONITOR
    ? process.env.URLS_TO_MONITOR.split(',').map(u => u.trim()).filter(u => u.length > 0)
    : defaultUrls;
};

const pingUrl = async (url: string): Promise<HealthStatus> => {
  const start = Date.now();
  try {
    if (!url.startsWith('http')) {
      throw new Error('Invalid protocol');
    }

    await axios.get(url, { 
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        'User-Agent': 'HealthMonitor/1.0.0 (https://github.com/example/healthmonitor)',
      }
    });
    
    return {
      url,
      status: 'up',
      latency: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.warn(`Health check failed for ${url}: ${message}`);
    return {
      url,
      status: 'down',
      latency: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  }
};

export const triggerManualRefresh = async () => {
  const urlsToMonitor = getUrlsToMonitor();
  logger.info(`Manual refresh triggered for ${urlsToMonitor.length} URLs`);
  
  // All pings start immediately in parallel
  const pingPromises = urlsToMonitor.map(async (url) => {
    const status = await pingUrl(url);
    try {
      await saveStatus(status);
    } catch (err) {
      logger.error(`Failed to save status for ${url} to Redis:`, err);
    }
    return status;
  });

  return Promise.all(pingPromises);
};

export const startMonitoring = () => {
  const urlsToMonitor = getUrlsToMonitor();
  const interval = parseInt(process.env.MONITOR_INTERVAL || '60000', 10) || 60000;

  logger.info(`Starting monitoring for ${urlsToMonitor.length} URLs every ${interval}ms`);

  const runPings = async () => {
    try {
      // Execute all pings concurrently
      await Promise.all(
        urlsToMonitor.map(async (url) => {
          const status = await pingUrl(url);
          try {
            await saveStatus(status);
            logger.info(`Checked ${url}: ${status.status} (${status.latency}ms)`);
          } catch (err) {
            logger.error(`Failed to save status for ${url} to Redis:`, err);
          }
        })
      );
    } catch (err) {
      logger.error('Unexpected error in monitoring loop:', err);
    }
  };

  runPings();
  setInterval(runPings, interval);
};
