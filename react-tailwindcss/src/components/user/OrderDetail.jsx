import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../ui/Breadcrumb';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  RefreshCw,
  User,
  Mail,
  Phone,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatCurrency } from '../../ultils/currencyHelper';

const OrderDetailComponent = ({ 
  orderData, 
  loading = false, 
  visiblePasswords = new Set(), 
  onTogglePasswordVisibility,
  orderStatus = {},
  formatDate,
  copyToClipboard,
  inventoriesBySku = {}
}) => {
  const getStatusConfig = (status) => {
    const statusMap = orderStatus[status] || orderStatus.default || { label: status, color: 'default' };
    
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          text: statusMap.label || 'Hoàn thành'
        };
      case 'refunded':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Package,
          text: statusMap.label || 'Đã hoàn tiền'
        };
      case 'canceled':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle,
          text: statusMap.label || 'Đã hủy'
        };
      case 'processing':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: RefreshCw,
          text: statusMap.label || 'Đang xử lý'
        };
      case 'shipping':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Truck,
          text: statusMap.label || 'Đang giao'
        };
      case 'pending':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: Clock,
          text: statusMap.label || 'Chờ xử lý'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: AlertCircle,
          text: statusMap.label || 'Không xác định'
        };
    }
  };

  const handleCopyToClipboard = async (text, type) => {
    if (copyToClipboard) {
      await copyToClipboard(text, type);
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-600 mb-8">
              Đơn hàng bạn tìm kiếm có thể không tồn tại hoặc đã bị xóa.
            </p>
            <Link 
              to="/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Debug logs
  console.log('OrderDetailComponent - orderData:', orderData);
  console.log('OrderDetailComponent - user:', orderData.user);
  console.log('OrderDetailComponent - items:', orderData.items);

  const statusConfig = getStatusConfig(orderData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Đơn hàng của tôi', href: '/orders' },
          { label: `Đơn hàng #${orderData?.orderId?.slice(-8)}`, href: '#', isLast: true }
        ]} />
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách đơn hàng
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đơn hàng
              </h1>
              <p className="text-gray-600">
                Đơn hàng #{orderData.orderId?.slice(-8)}
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-medium ${statusConfig.color}`}>
              <StatusIcon className="h-4 w-4" />
              {statusConfig.text}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sản phẩm đã đặt
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {orderData.skuDetails?.map((sku) => (
                    <div key={sku._id} className="border border-gray-200 rounded-2xl overflow-hidden">
                      {/* SKU Header */}
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {sku.productName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {sku.name}
                            </p>
                          </div>
                          <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(sku.price)}
                          </span>
                        </div>
                      </div>

                      {/* Account Credentials */}
                      <div className="p-6">
                        <div className="grid gap-4">
                          {inventoriesBySku[sku._id]?.map((inventory) => {
                            const [username, password] = inventory.credentials.split('|');
                            return (
                              <div key={inventory._id} className="bg-white border border-gray-200 rounded-xl p-4">
                                <h4 className="font-medium text-gray-900 mb-3">Thông tin tài khoản</h4>
                                
                                {/* Username */}
                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-sm text-gray-600">Tài khoản</label>
                                    <button
                                      onClick={() => handleCopyToClipboard(username, 'tài khoản')}
                                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      <Copy className="h-4 w-4 text-gray-500" />
                                    </button>
                                  </div>
                                  <div className="font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                                    {username}
                                  </div>
                                </div>

                                {/* Password */}
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-sm text-gray-600">Mật khẩu</label>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => onTogglePasswordVisibility && onTogglePasswordVisibility(inventory._id)}
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                      >
                                        {visiblePasswords.has(inventory._id) 
                                          ? <EyeOff className="h-4 w-4 text-gray-500" />
                                          : <Eye className="h-4 w-4 text-gray-500" />
                                        }
                                      </button>
                                      <button
                                        onClick={() => handleCopyToClipboard(password, 'mật khẩu')}
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                      >
                                        <Copy className="h-4 w-4 text-gray-500" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                                    {visiblePasswords.has(inventory._id) ? password : '••••••••'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Thông tin đơn hàng
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                        <p className="font-medium text-gray-900">
                          {formatDate ? formatDate(orderData.createdAt) : new Date(orderData.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                        <p className="font-medium text-gray-900">
                          {orderData.paymentMethod === 'balance' ? 'Số dư tài khoản' : 'Chuyển khoản'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Tổng số sản phẩm</p>
                        <p className="font-medium text-gray-900">
                          {orderData.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0} sản phẩm
                        </p>
                      </div>
                    </div>
                    
                    {/* {orderData.updatedAt && (
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                          <p className="font-medium text-gray-900">
                            {formatDate ? formatDate(orderData.updatedAt) : new Date(orderData.updatedAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin khách hàng
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tên khách hàng</p>
                      <p className="font-medium text-gray-900">
                        {orderData.user?.firstName && orderData.user?.lastName 
                          ? `${orderData.user.firstName} ${orderData.user.lastName}`
                          : orderData.user?.email?.split('@')[0] || 'Chưa có thông tin'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {orderData.user?.email || 'Chưa có thông tin'}
                      </p>
                    </div>
                  </div>
                  
                  {orderData.user?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Số điện thoại</p>
                        <p className="font-medium text-gray-900">
                          {orderData.user.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Tổng kết đơn hàng</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(orderData.total + (orderData.saved ?? 0))}
                    </span>
                  </div>
                  
                  {orderData.saved > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">
                        -{formatCurrency(orderData.saved)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(orderData.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailComponent;
