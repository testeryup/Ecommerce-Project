import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../../../services/userService';
import { formatCurrency } from '../../../ultils';
import { toast } from 'react-hot-toast';
import Layout from '../../../components/Layout';
import OrderDetailComponent from '../../../components/user/OrderDetail.jsx';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());

  const orderStatus = {
    completed: { label: 'Hoàn thành', color: 'success' },
    refunded: { label: 'Đã hoàn tiền', color: 'info' },
    canceled: { label: 'Đã huỷ', color: 'danger' },
    processing: { label: 'Đang xử lý', color: 'warning' },
    pending: { label: 'Chờ xử lý', color: 'secondary' },
    default: { label: 'Không xác định', color: 'default' }
  };

  useEffect(() => {
    const fetchOrderData = async (orderId) => {
      try {
        const response = await getOrderById(orderId);
        console.log('Order API Response:', response); // Debug log
        if (response.errCode === 0 && response.data) {
          console.log('Order Data:', response.data); // Debug log
          console.log('User Data:', response.data.user); // Debug log
          console.log('Items Data:', response.data.items); // Debug log
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

  const togglePassword = (inventoryId) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(inventoryId)) {
        newSet.delete(inventoryId);
      } else {
        newSet.add(inventoryId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${type}`);
    } catch (err) {
      toast.error('Không thể sao chép');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group inventories by SKU
  const inventoriesBySku = orderData?.inventoryDetails?.reduce((acc, inv) => {
    if (!acc[inv.sku]) {
      acc[inv.sku] = [];
    }
    acc[inv.sku].push(inv);
    return acc;
  }, {});

  const handleTogglePasswordVisibility = (inventoryId) => {
    togglePassword(inventoryId);
  };

  return (
    <Layout>
      <OrderDetailComponent 
        orderData={orderData}
        loading={loading}
        visiblePasswords={visiblePasswords}
        onTogglePasswordVisibility={handleTogglePasswordVisibility}
        orderStatus={orderStatus}
        formatDate={formatDate}
        copyToClipboard={copyToClipboard}
        inventoriesBySku={inventoriesBySku}
      />
    </Layout>
  );
};

export default OrderDetail;