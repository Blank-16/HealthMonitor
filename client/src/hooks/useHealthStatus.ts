import { useState, useEffect } from 'react';
import axios from 'axios';
import { HealthStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/status';

export const useHealthStatus = () => {
  const [data, setData] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<HealthStatus[]>(API_URL);
      setData(response.data);
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
