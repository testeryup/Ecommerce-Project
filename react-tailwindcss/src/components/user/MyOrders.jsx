import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import Breadcrumb from '../ui/Breadcrumb';
import { ShoppingBag, Clock, Eye, Package, Filter, Search, Calendar, Truck, CheckCircle, XCircle, RefreshCw, User, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { formatCurrency } from '../../ultils/currencyHelper';

const MyOrdersComponent = ({ 
  orders = [], 
  loading = false, 
  onViewOrder,
  pagination,
  activeFilter = 'all',
  filterOptions = [],
  orderStatus = {},
  onFilterChange,
  onPageChange,
  formatDate,
  Pagination
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusConfig = (status) => {
    const statusMap = orderStatus[status] || orderStatus.default || { label: status, color: 'default' };
    
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          text: statusMap.label || 'Hoàn thành'
        };
      case 'pending':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: Clock,
          text: statusMap.label || 'Chờ xử lý'
        };
      case 'canceled':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle,
          text: statusMap.label || 'Đã hủy'
        };
      case 'processing':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: RefreshCw,
          text: statusMap.label || 'Đang xử lý'
        };
      case 'refunded':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: RefreshCw,
          text: statusMap.label || 'Đã hoàn tiền'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: Package,
          text: statusMap.label || status
        };
    }
  };

  const filterStatuses = filterOptions.map(option => ({
    key: option.value,
    label: option.label,
    count: option.value === 'all' 
      ? orders.length 
      : orders.filter(o => o.status === option.value).length
  }));

  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.productName?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Đơn hàng của tôi
              </h1>
              <p className="text-lg text-gray-600">
                Theo dõi và quản lý tất cả đơn hàng của bạn
              </p>
              {pagination && (
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Tổng số đơn hàng: {pagination.totalItems}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>Trang {pagination.currentPage}/{pagination.totalPages}</span>
                  </div>
                </div>
              )}
            </div>
            <Link to="/profile" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700 font-medium">
              <User className="h-5 w-5" />
              Hồ sơ cá nhân
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterStatuses.map(status => (
              <button
                key={status.key}
                onClick={() => onFilterChange && onFilterChange(status.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeFilter === status.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="font-medium">{status.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activeFilter === status.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {status.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {orders.length === 0 
                ? 'Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!' 
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem các đơn hàng khác.'
              }
            </p>
            {orders.length === 0 && (
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors font-medium"
              >
                <Package className="h-5 w-5" />
                Khám phá sản phẩm
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={order.orderId} className="bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-8">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Đơn hàng #{order.orderId?.slice(-8)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate ? formatDate(order.createdAt) : new Date(order.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {order.items?.length || 0} sản phẩm
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {statusConfig.text}
                        </div>
                        <button
                          onClick={() => onViewOrder && onViewOrder(order.orderId)}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          Chi tiết
                        </button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">
                                    {(item.productName || item.name)?.length > 30 ? `${(item.productName || item.name).substring(0, 30)}...` : (item.productName || item.name)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Số lượng: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{order.items.length - 3} sản phẩm khác
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Total */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>Tổng tiền:</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && Pagination && (
          <div className="mt-8">
            <PaginationComponent 
              pagination={pagination}
              onPageChange={onPageChange}
              Pagination={Pagination}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Pagination Component
const PaginationComponent = ({ pagination, onPageChange, Pagination: PaginationData }) => {
  const { pageNumbers, startPage, endPage } = PaginationData();

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* First page button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={!pagination.hasPrev}
        className={`p-2 rounded-lg border transition-colors ${
          !pagination.hasPrev
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      {/* Previous page button */}
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={!pagination.hasPrev}
        className={`p-2 rounded-lg border transition-colors ${
          !pagination.hasPrev
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 border-gray-300 font-medium"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-3 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border font-medium transition-colors ${
            pagination.currentPage === page
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < pagination.totalPages && (
        <>
          {endPage < pagination.totalPages - 1 && (
            <span className="px-3 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 border-gray-300 font-medium"
          >
            {pagination.totalPages}
          </button>
        </>
      )}

      {/* Next page button */}
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={!pagination.hasNext}
        className={`p-2 rounded-lg border transition-colors ${
          !pagination.hasNext
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Last page button */}
      <button
        onClick={() => onPageChange(pagination.totalPages)}
        disabled={!pagination.hasNext}
        className={`p-2 rounded-lg border transition-colors ${
          !pagination.hasNext
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MyOrdersComponent;
