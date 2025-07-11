import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyOrdersComponent from '../../../components/user/MyOrders.jsx';
import { getOrders } from '../../../services/userService';
import Layout from '../../../components/Layout';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders({ page: 1, limit: 50, status: 'all' });
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <Layout>
      <MyOrdersComponent 
        orders={orders}
        loading={loading}
        onViewOrder={handleViewOrder}
      />
    </Layout>
  );
};

export default MyOrders;