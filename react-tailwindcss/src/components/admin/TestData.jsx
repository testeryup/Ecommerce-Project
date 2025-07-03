import React, { useState, useEffect } from 'react';
import { getAdminStats, getTransactionStats } from '../../services/adminService';

const TestData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, transactionResponse] = await Promise.all([
          getAdminStats(),
          getTransactionStats()
        ]);

        console.log('Stats Response:', statsResponse);
        console.log('Transaction Response:', transactionResponse);

        setData({
          stats: statsResponse,
          transactions: transactionResponse
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Data</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Admin Stats:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(data?.stats, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="font-semibold">Transaction Stats:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(data?.transactions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestData;
