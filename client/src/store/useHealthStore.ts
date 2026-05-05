import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import type { HealthStatus } from '../types';
import { toast } from 'sonner';

interface HealthState {
  data: HealthStatus[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || '/api/status';

export const useHealthStore = create<HealthState>()(
  immer((set, get) => ({
    data: [],
    loading: true,
    error: null,
    fetchData: async () => {
      try {
        const response = await axios.get<HealthStatus[]>(API_URL);
        const newData = response.data;
        const oldData = get().data;

        if (oldData.length > 0) {
          newData.forEach((service) => {
            const prev = oldData.find((s) => s.url === service.url);
            if (prev && prev.status !== service.status) {
              if (service.status === 'up') {
                toast.success(`${service.url} is back online`, {
                  description: `Operational with ${service.latency}ms latency`,
                });
              } else {
                toast.error(`${service.url} is down`, {
                  description: 'Service ping failed',
                });
              }
            }
          });
        }

        set((state) => {
          state.data = newData;
          state.error = null;
          state.loading = false;
        });
      } catch {
        set((state) => {
          state.error = 'Failed to fetch health status';
          state.loading = false;
        });
        // error intentionally suppressed; user-facing error set in state
      }
    },
  }))
);
