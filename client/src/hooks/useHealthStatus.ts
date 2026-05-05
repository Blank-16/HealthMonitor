import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HealthStatus } from '../types';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/status';

export const useHealthStatus = () => {
  const [data, setData] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevData = useRef<HealthStatus[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get<HealthStatus[]>(API_URL);
      
      // Check for status changes to show toasts
      if (prevData.current.length > 0) {
        response.data.forEach((service) => {
          const prevService = prevData.current.find((s) => s.url === service.url);
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

      setData(response.data);
      prevData.current = response.data;
      setError(null);
    } catch (err) {
      setError('Failed to fetch health status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};
