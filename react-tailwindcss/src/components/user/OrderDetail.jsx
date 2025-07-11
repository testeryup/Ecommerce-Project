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
  onTogglePasswordVisibility 
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          text: 'Hoàn thành'
        };
      case 'refunded':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Package,
          text: 'Đã hoàn tiền'
        };
      case 'canceled':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle,
          text: 'Đã hủy'
        };
      case 'processing':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: RefreshCw,
          text: 'Đang xử lý'
        };
      case 'shipping':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Truck,
          text: 'Đang giao'
        };
      case 'pending':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: Clock,
          text: 'Chờ xử lý'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: AlertCircle,
          text: 'Không xác định'
        };
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  const statusConfig = getStatusConfig(orderData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="space-y-4">
                  {orderData.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          SKU: {item.skuCode}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Số lượng: {item.quantity}
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        
                        {/* Digital Product Information */}
                        {item.digitalInfo && (
                          <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">Thông tin sản phẩm số:</h4>
                            <div className="space-y-2">
                              {item.digitalInfo.username && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Tài khoản:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                      {item.digitalInfo.username}
                                    </span>
                                    <button
                                      onClick={() => copyToClipboard(item.digitalInfo.username)}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      <Copy className="h-3 w-3 text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              {item.digitalInfo.password && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Mật khẩu:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                      {visiblePasswords.has(`${index}`) 
                                        ? item.digitalInfo.password 
                                        : '••••••••'
                                      }
                                    </span>
                                    <button
                                      onClick={() => onTogglePasswordVisibility && onTogglePasswordVisibility(index)}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      {visiblePasswords.has(`${index}`) 
                                        ? <EyeOff className="h-3 w-3 text-gray-500" />
                                        : <Eye className="h-3 w-3 text-gray-500" />
                                      }
                                    </button>
                                    <button
                                      onClick={() => copyToClipboard(item.digitalInfo.password)}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      <Copy className="h-3 w-3 text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              {item.digitalInfo.additionalInfo && (
                                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                  {item.digitalInfo.additionalInfo}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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
                          {new Date(orderData.createdAt).toLocaleDateString('vi-VN', {
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
                          {orderData.orderItems?.length || 0} sản phẩm
                        </p>
                      </div>
                    </div>
                    
                    {orderData.updatedAt && (
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                          <p className="font-medium text-gray-900">
                            {new Date(orderData.updatedAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
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
                        {orderData.user?.firstName} {orderData.user?.lastName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {orderData.user?.email}
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
                      {formatCurrency(orderData.subtotal || orderData.total)}
                    </span>
                  </div>
                  
                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">
                        -{formatCurrency(orderData.discount)}
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
