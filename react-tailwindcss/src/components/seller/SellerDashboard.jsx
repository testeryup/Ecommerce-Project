import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import Button from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Users,
  Eye,
  Star,
  Calendar,
  Clock,
  Plus,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import Header from '../Header';
import Footer from '../Footer';

const SellerDashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  
  // Mock data - should be fetched from API
  const [stats, setStats] = useState({
    totalRevenue: 15750000,
    totalOrders: 156,
    totalProducts: 24,
    averageRating: 4.8,
    pendingOrders: 8,
    completedOrders: 142,
    returnedOrders: 6,
    viewCount: 2340,
    conversionRate: 3.2
  });

  const [revenueData, setRevenueData] = useState([
    { name: 'T1', revenue: 2100000, orders: 15 },
    { name: 'T2', revenue: 1800000, orders: 12 },
    { name: 'T3', revenue: 2400000, orders: 18 },
    { name: 'T4', revenue: 1950000, orders: 14 },
    { name: 'T5', revenue: 2650000, orders: 22 },
    { name: 'T6', revenue: 2200000, orders: 16 },
    { name: 'T7', revenue: 2650000, orders: 21 }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'Nguyễn Văn A',
      product: 'iPhone 15 Pro',
      quantity: 1,
      total: 28500000,
      status: 'pending',
      date: '2024-01-22T10:30:00Z'
    },
    {
      id: 'ORD-002',
      customer: 'Trần Thị B',
      product: 'MacBook Air M2',
      quantity: 1,
      total: 24990000,
      status: 'processing',
      date: '2024-01-21T15:45:00Z'
    },
    {
      id: 'ORD-003',
      customer: 'Lê Văn C',
      product: 'iPad Pro',
      quantity: 2,
      total: 21500000,
      status: 'completed',
      date: '2024-01-20T09:15:00Z'
    }
  ]);

  const [topProducts, setTopProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      sold: 45,
      revenue: 1355000000,
      stock: 12,
      rating: 4.9
    },
    {
      id: 2,
      name: 'MacBook Pro M3',
      sold: 23,
      revenue: 1264770000,
      stock: 8,
      rating: 4.8
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      sold: 67,
      revenue: 436550000,
      stock: 25,
      rating: 4.7
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
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600', text: 'Hết hàng' };
    if (stock <= 5) return { color: 'text-yellow-600', text: 'Sắp hết' };
    return { color: 'text-green-600', text: 'Còn hàng' };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chưa đăng nhập</h1>
          <p className="text-gray-600 mb-8">Vui lòng đăng nhập để xem seller dashboard</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== 'seller') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-600 mb-8">Bạn cần có quyền seller để truy cập trang này</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Về trang chủ
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
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
                  Seller Dashboard
                </h1>
                <p className="mt-1 text-gray-600">Quản lý cửa hàng và theo dõi doanh số của bạn</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Link to="/seller/products/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setLoading(!loading)}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12.5% so với tháng trước</span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    <p className="text-sm text-blue-600">{stats.pendingOrders} đơn chờ xử lý</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    <p className="text-sm text-purple-600">Đang hoạt động</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm text-yellow-600">Từ {stats.totalOrders} đánh giá</span>
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Doanh thu 7 ngày qua
                </CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu và số đơn hàng theo ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value) : `${value} đơn`,
                        name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      fill="url(#revenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Đơn hoàn thành</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{stats.completedOrders}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">Đơn chờ xử lý</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{stats.pendingOrders}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium">Đơn trả hàng</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{stats.returnedOrders}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Lượt xem</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{stats.viewCount.toLocaleString()}</span>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tỷ lệ chuyển đổi</span>
                    <span className="font-medium">{stats.conversionRate}%</span>
                  </div>
                  <Progress value={stats.conversionRate * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Đơn hàng gần đây
                </CardTitle>
                <Link to="/seller/orders">
                  <Button variant="ghost" size="sm">
                    Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">#{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-sm text-gray-500">{order.product} x{order.quantity}</p>
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
                        <Button variant="ghost" size="sm" className="mt-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Sản phẩm bán chạy
                </CardTitle>
                <Link to="/seller/products">
                  <Button variant="ghost" size="sm">
                    Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">Đã bán: {product.sold}</span>
                          <span className="text-xs text-gray-500">Doanh thu: {formatCurrency(product.revenue)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                          <div className={`text-xs ${getStockStatus(product.stock).color}`}>
                            {getStockStatus(product.stock).text} ({product.stock})
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SellerDashboard;
