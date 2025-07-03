import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  User, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  Calendar,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Gift,
  Settings,
  Bell,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 8,
    cancelledOrders: 2,
    totalSpent: 2450000,
    savedAmount: 340000,
    loyaltyPoints: 1250,
    nextReward: 2000
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      items: ['iPhone 15 Pro', 'AirPods Pro'],
      total: 28500000,
      status: 'delivered',
      date: '2024-01-15',
      image: '/api/placeholder/60/60'
    },
    {
      id: 'ORD-002',
      items: ['MacBook Air M2'],
      total: 24990000,
      status: 'processing',
      date: '2024-01-20',
      image: '/api/placeholder/60/60'
    },
    {
      id: 'ORD-003',
      items: ['iPad Pro', 'Apple Pencil'],
      total: 21500000,
      status: 'shipped',
      date: '2024-01-22',
      image: '/api/placeholder/60/60'
    }
  ]);

  const [favoriteProducts, setFavoriteProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 29990000,
      image: '/api/placeholder/80/80',
      discount: 5
    },
    {
      id: 2,
      name: 'MacBook Pro M3',
      price: 54990000,
      image: '/api/placeholder/80/80',
      discount: 10
    },
    {
      id: 3,
      name: 'AirPods Max',
      price: 13490000,
      image: '/api/placeholder/80/80',
      discount: 15
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      delivered: 'Đã giao',
      processing: 'Đang xử lý',
      shipped: 'Đang giao',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chưa đăng nhập</h1>
          <p className="text-gray-600 mb-8">Vui lòng đăng nhập để xem dashboard</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-gray-600">Chào mừng trở lại, {user?.firstName || user?.username}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Thông báo
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    <p className="text-sm text-gray-500">{stats.completedOrders} đã hoàn thành</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng chi tiêu</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                    <p className="text-sm text-green-600">Tiết kiệm {formatCurrency(stats.savedAmount)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Điểm tích lũy</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
                    <p className="text-sm text-purple-600">{stats.nextReward - stats.loyaltyPoints} điểm nữa để thưởng</p>
                  </div>
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-3">
                  <Progress value={(stats.loyaltyPoints / stats.nextReward) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đơn chờ xử lý</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                    <p className="text-sm text-orange-600">Cần theo dõi</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback className="text-lg">
                        {(user?.firstName || user?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user?.username}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {user?.email}
                        </div>
                        {user?.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                          </div>
                        )}
                        {user?.address && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {user.address}
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Link to="/profile">
                          <Button variant="outline" size="sm">
                            Chỉnh sửa hồ sơ
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Đơn hàng gần đây
                  </CardTitle>
                  <Link to="/orders">
                    <Button variant="ghost" size="sm">
                      Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">#{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {order.items.length === 1 
                                ? order.items[0] 
                                : `${order.items[0]} +${order.items.length - 1} sản phẩm khác`}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge className={getOrderStatusColor(order.status)}>
                                {getOrderStatusText(order.status)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(order.date).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="mt-1">
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/orders" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Xem đơn hàng
                    </Button>
                  </Link>
                  <Link to="/cart" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Giỏ hàng
                    </Button>
                  </Link>
                  <Link to="/profile" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Cập nhật hồ sơ
                    </Button>
                  </Link>
                  <Link to="/transactions" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Lịch sử giao dịch
                    </Button>
                  </Link>
                  <Link to="/support" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Hỗ trợ
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Favorite Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Sản phẩm yêu thích
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {favoriteProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-semibold text-blue-600">
                              {formatCurrency(product.price)}
                            </span>
                            {product.discount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                -{product.discount}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/products">
                      <Button variant="outline" size="sm" className="w-full">
                        Xem thêm sản phẩm
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Account Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Hạng thành viên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Thành viên Vàng</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Chi tiêu thêm {formatCurrency(1000000)} để lên hạng Bạch Kim
                    </p>
                    <div className="mt-4">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">75% hoàn thành</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboard;
