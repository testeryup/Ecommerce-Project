import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyOrdersComponent from '../../../components/user/MyOrders.jsx';
import { getOrders } from '../../../services/userService';
import { formatCurrency } from '../../../ultils';
import { toast } from 'react-hot-toast';
import Layout from '../../../components/Layout';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const filterOptions = [
    { value: 'all', label: 'Tất cả', icon: 'fas fa-list-ul' },
    { value: 'completed', label: 'Hoàn thành', icon: 'fas fa-check-circle' },
    { value: 'processing', label: 'Đang xử lý', icon: 'fas fa-clock' },
    { value: 'canceled', label: 'Đã huỷ', icon: 'fas fa-times-circle' }
  ];

  const orderStatus = {
    completed: { label: 'Hoàn thành', color: 'success', icon: 'fas fa-check-circle' },
    refunded: { label: 'Đã hoàn tiền', color: 'info', icon: 'fas fa-undo' },
    canceled: { label: 'Đã huỷ', color: 'danger', icon: 'fas fa-times-circle' },
    processing: { label: 'Đang xử lý', color: 'warning', icon: 'fas fa-clock' },
    pending: { label: 'Chờ xử lý', color: 'secondary', icon: 'fas fa-hourglass-half' },
    default: { label: 'Không xác định', color: 'default', icon: 'fas fa-question-circle' }
  };

  const fetchOrders = async (page, status = activeFilter) => {
    try {
      setLoading(true);
      const response = await getOrders({
        page,
        limit: pagination.itemsPerPage,
        status: status !== 'all' ? status : undefined
      });

      if (response.errCode === 0) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } else {
        toast.error('Không thể tải danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.currentPage, activeFilter);
  }, [pagination.currentPage, activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - 2);
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return {
      pageNumbers,
      startPage,
      endPage
    };
  };

  return (
    <Layout>
      <MyOrdersComponent 
        orders={orders}
        loading={loading}
        onViewOrder={handleViewOrder}
        pagination={pagination}
        activeFilter={activeFilter}
        filterOptions={filterOptions}
        orderStatus={orderStatus}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        formatDate={formatDate}
        Pagination={Pagination}
      />
    </Layout>
  );
};

export default MyOrders;