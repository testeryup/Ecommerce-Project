import React, { useState, useEffect } from 'react';
import { getAdminStats, getTransactionStats } from '../services/adminService';

const APITest = () => {
  const [adminStats, setAdminStats] = useState(null);
  const [transactionStats, setTransactionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching admin stats...');
        const adminStatsResponse = await getAdminStats();
        console.log('Admin Stats Full Response:', adminStatsResponse);
        
        console.log('Fetching transaction stats...');
        const transactionStatsResponse = await getTransactionStats();
        console.log('Transaction Stats Full Response:', transactionStatsResponse);
        
        setAdminStats(adminStatsResponse);
        setTransactionStats(transactionStatsResponse);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Admin Stats</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(adminStats, null, 2)}
            </pre>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Transaction Stats</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(transactionStats, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITest;
