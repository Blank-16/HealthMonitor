import { useEffect } from 'react';
import { useHealthStore } from '../store/useHealthStore';

export const useHealthStatus = () => {
  const { data, loading, error, fetchData } = useHealthStore();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
