import { useState, useEffect, useRef } from 'react';

export const useRealTimeStats = (initialData, updateInterval = 30000) => {
  const [stats, setStats] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const intervalRef = useRef(null);

  // Simulate real-time updates
  const generateRandomUpdate = (currentStats) => {
    if (!currentStats) return null;

    const variance = 0.02; // 2% variance for more realistic updates
    
    return {
      ...currentStats,
      users: {
        ...currentStats.users,
        total: {
          ...currentStats.users?.total,
          users: Math.max(0, Math.floor(
            (currentStats.users?.total?.users || 0) * (1 + (Math.random() - 0.5) * variance * 0.1)
          )),
          sellers: Math.max(0, Math.floor(
            (currentStats.users?.total?.sellers || 0) * (1 + (Math.random() - 0.5) * variance * 0.05)
          )),
          suspended: Math.max(0, Math.floor(
            (currentStats.users?.total?.suspended || 0) * (1 + (Math.random() - 0.5) * variance * 0.1)
          ))
        }
      },
      orders: {
        ...currentStats.orders,
        today: Math.max(0, Math.floor(
          (currentStats.orders?.today || 0) * (1 + (Math.random() - 0.5) * variance)
        )),
        month: Math.max(0, Math.floor(
          (currentStats.orders?.month || 0) * (1 + (Math.random() - 0.5) * variance * 0.1)
        ))
      },
      revenue: {
        ...currentStats.revenue,
        today: Math.max(0, Math.floor(
          (currentStats.revenue?.today || 0) * (1 + (Math.random() - 0.5) * variance)
        )),
        month: Math.max(0, Math.floor(
          (currentStats.revenue?.month || 0) * (1 + (Math.random() - 0.5) * variance * 0.1)
        ))
      },
      deposits: {
        ...currentStats.deposits,
        today: Math.max(0, Math.floor(
          (currentStats.deposits?.today || 0) * (1 + (Math.random() - 0.5) * variance)
        )),
        month: Math.max(0, Math.floor(
          (currentStats.deposits?.month || 0) * (1 + (Math.random() - 0.5) * variance * 0.1)
        ))
      },
      products: {
        ...currentStats.products,
        total: Math.max(0, Math.floor(
          (currentStats.products?.total || 0) * (1 + (Math.random() - 0.5) * variance * 0.05)
        )),
        active: Math.max(0, Math.floor(
          (currentStats.products?.active || 0) * (1 + (Math.random() - 0.5) * variance * 0.05)
        )),
        pending: Math.max(0, Math.floor(
          (currentStats.products?.pending || 0) * (1 + (Math.random() - 0.5) * variance * 0.1)
        )),
        inactive: Math.max(0, Math.floor(
          (currentStats.products?.inactive || 0) * (1 + (Math.random() - 0.5) * variance * 0.05)
        ))
      }
    };
  };

  useEffect(() => {
    if (initialData) {
      setStats(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const startUpdates = () => {
      intervalRef.current = setInterval(() => {
        setStats(currentStats => {
          const updatedStats = generateRandomUpdate(currentStats);
          if (updatedStats) {
            setLastUpdated(new Date());
            return updatedStats;
          }
          return currentStats;
        });
      }, updateInterval);
    };

    // Start updates after initial data is loaded
    if (stats) {
      startUpdates();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stats, updateInterval]);

  const stopRealTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startRealTimeUpdates = () => {
    if (!intervalRef.current && stats) {
      intervalRef.current = setInterval(() => {
        setStats(currentStats => {
          const updatedStats = generateRandomUpdate(currentStats);
          if (updatedStats) {
            setLastUpdated(new Date());
            return updatedStats;
          }
          return currentStats;
        });
      }, updateInterval);
    }
  };

  return {
    stats,
    lastUpdated,
    stopRealTimeUpdates,
    startRealTimeUpdates,
    isRealTimeActive: !!intervalRef.current
  };
};

export default useRealTimeStats;
