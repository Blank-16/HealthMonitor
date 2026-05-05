export interface HealthStatus {
  url: string;
  status: 'up' | 'down';
  latency: number;
  lastChecked: string;
}

export interface AppError extends Error {
  statusCode?: number;
}
