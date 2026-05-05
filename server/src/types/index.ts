import { z } from 'zod';

export const HealthStatusSchema = z.object({
  url: z.string().url(),
  status: z.enum(['up', 'down']),
  latency: z.number().nonnegative(),
  lastChecked: z.string().datetime(),
});

export type HealthStatus = z.infer<typeof HealthStatusSchema>;

export interface AppError extends Error {
  statusCode?: number;
}
