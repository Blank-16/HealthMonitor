import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import { HealthStatus } from '../types';
import { toast } from 'sonner';

interface HealthState {
  data: HealthStatus[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/status';

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

        // Check for status changes to show toasts
        if (oldData.length > 0) {
          newData.forEach((service) => {
            const prevService = oldData.find((s) => s.url === service.url);
            if (prevService && prevService.status !== service.status) {
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
      } catch (err) {
        set((state) => {
          state.error = 'Failed to fetch health status';
          state.loading = false;
        });
        console.error(err);
      }
    },
  }))
);
