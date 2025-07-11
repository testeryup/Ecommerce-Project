import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../../../services/userService';
import { toast } from 'react-hot-toast';
import Layout from '../../../components/Layout';
import OrderDetailComponent from '../../../components/user/OrderDetail.jsx';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());

  useEffect(() => {
    const fetchOrderData = async (orderId) => {
      try {
        const response = await getOrderById(orderId);
        if (response.errCode === 0 && response.data) {
          setOrderData(response.data);
        } else {
          toast.error('Không tìm thấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error('Có lỗi xảy ra khi tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData(orderId);
    }
  }, [orderId]);

  const handleTogglePasswordVisibility = (index) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(`${index}`)) {
        newSet.delete(`${index}`);
      } else {
        newSet.add(`${index}`);
      }
      return newSet;
    });
  };

  return (
    <Layout>
      <OrderDetailComponent 
        orderData={orderData}
        loading={loading}
        visiblePasswords={visiblePasswords}
        onTogglePasswordVisibility={handleTogglePasswordVisibility}
      />
    </Layout>
  );
};

export default OrderDetail;