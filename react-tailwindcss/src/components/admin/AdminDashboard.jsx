import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Activity,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Package,
  CreditCard,
  Star,
  MoreHorizontal,
  Filter,
  Download,
  AlertCircle
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  getAdminStats, 
  getProductStats, 
  getTransactionStats, 
  getAdminOrders,
  getAdminProducts 
} from '../../services/adminService';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [adminStats, setAdminStats] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [productStats, setProductStats] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [transactionStats, setTransactionStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        adminStatsResponse,
        productStatsResponse,
        transactionStatsResponse,
        ordersResponse,
        productsResponse
      ] = await Promise.all([
        getAdminStats(),
        getProductStats(),
        getTransactionStats(),
        getAdminOrders({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        getAdminProducts({ page: 1, limit: 5, sortBy: 'soldCount', sortOrder: 'desc' })
      ]);

      setAdminStats(adminStatsResponse.data);
      setProductStats(productStatsResponse.data);
      setTransactionStats(transactionStatsResponse.data);
      setRecentOrders(ordersResponse.data.orders || []);
      setTopProducts(productsResponse.data.products || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, forceRefresh]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Default/fallback data when API fails or returns empty
  const defaultStats = {
    users: { total: 0, growth: 0, active: 0 },
    revenue: { total: 0, growth: 0, target: 0 },
    orders: { total: 0, growth: 0, pending: 0 },
    products: { total: 0, growth: 0, outOfStock: 0 }
  };

  // Process admin stats for display based on actual API response
  const processedStats = adminStats ? {
    users: {
      total: adminStats.users?.total?.users || 0,
      growth: 0, // Calculate growth based on timeline data
      active: (adminStats.users?.total?.users - adminStats.users?.total?.suspended) || 0
    },
    revenue: {
      total: adminStats.revenue?.month || 0,
      growth: 0, // Calculate growth based on timeline data  
      target: adminStats.revenue?.month * 1.2 || 0 // Set target as 120% of current
    },
    orders: {
      total: adminStats.orders?.month || 0,
      growth: 0, // Calculate growth based on timeline data
      pending: 0 // This would need to come from a different endpoint
    },
    products: {
      total: adminStats.products?.total || 0,
      growth: 0,
      outOfStock: adminStats.products?.inactive || 0
    }
  } : defaultStats;

  // Process chart data with actual API response
  const revenueData = adminStats?.revenue?.timeline ? 
    adminStats.revenue.timeline.slice(-7).map((item, index) => ({
      name: `T${index + 1}`,
      revenue: item.value || 0,
      orders: adminStats.orders?.timeline?.[adminStats.orders.timeline.length - 7 + index]?.value || 0,
      profit: Math.round((item.value || 0) * 0.3) // Assume 30% profit margin
    })) : [
    { name: 'T1', revenue: 0, orders: 0, profit: 0 },
    { name: 'T2', revenue: 0, orders: 0, profit: 0 },
    { name: 'T3', revenue: 0, orders: 0, profit: 0 },
    { name: 'T4', revenue: 0, orders: 0, profit: 0 },
    { name: 'T5', revenue: 0, orders: 0, profit: 0 },
    { name: 'T6', revenue: 0, orders: 0, profit: 0 },
    { name: 'T7', revenue: 0, orders: 0, profit: 0 }
  ];

  const userGrowthData = adminStats?.users?.timeline ? 
    adminStats.users.timeline.slice(-7).map((item, index) => ({
      name: `T${index + 1}`,
      newUsers: item.value || 0,
      totalUsers: adminStats.users?.total?.users || 0,
      activeUsers: (adminStats.users?.total?.users - adminStats.users?.total?.suspended) || 0
    })) : [
    { name: 'T1', newUsers: 0, totalUsers: 0, activeUsers: 0 },
    { name: 'T2', newUsers: 0, totalUsers: 0, activeUsers: 0 },
    { name: 'T3', newUsers: 0, totalUsers: 0, activeUsers: 0 },
    { name: 'T4', newUsers: 0, totalUsers: 0, activeUsers: 0 },
    { name: 'T5', newUsers: 0, totalUsers: 0, activeUsers: 0 },
    { name: 'T6', newUsers: 0, totalUsers: 0, activeUsers: 0 },
    { name: 'T7', newUsers: 0, totalUsers: 0, activeUsers: 0 }
  ];

  // For now, use static category data since it's not in the API response
  // This should be updated when backend provides category statistics
  const categoryData = [
    { name: 'Sản phẩm có sẵn', value: adminStats?.products?.active || 0, color: '#10b981' },
    { name: 'Sản phẩm không hoạt động', value: adminStats?.products?.inactive || 0, color: '#f59e0b' },
    { name: 'Sản phẩm chờ duyệt', value: adminStats?.products?.pending || 0, color: '#3b82f6' },
  ].filter(item => item.value > 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.default;
  };

  const getStatusText = (status) => {
    const texts = {
      completed: 'Hoàn thành',
      processing: 'Đang xử lý',
      pending: 'Chờ xử lý',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  // Enhanced MetricCard component
  const MetricCard = ({ title, value, change, icon: Icon, description, trend, progress, target, color = 'blue' }) => (
    <Card className={`hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-${color}-500`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-4 w-4 text-${color}-600`} />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {trend === 'up' ? (
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="ml-1">so với tháng trước</span>
          </div>
        </div>
        {progress !== undefined && target && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tiến độ</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Mục tiêu: {target}
            </div>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  // Show access denied if not authenticated or not admin
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Chưa đăng nhập</h2>
          <p className="text-gray-600 max-w-md">
            Bạn cần đăng nhập để truy cập trang quản trị. Vui lòng đăng nhập trước.
          </p>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="mt-4"
          >
            Đi tới trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Không có quyền truy cập</h2>
          <p className="text-gray-600 max-w-md">
            Bạn không có quyền truy cập vào trang quản trị. Chỉ tài khoản admin mới có thể truy cập.
          </p>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="mt-4"
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Tổng quan
          </h1>
          <p className="text-muted-foreground flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Theo dõi hiệu suất và thống kê tổng quan của hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Cập nhật: {new Date().toLocaleString('vi-VN')}</span>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="day">Ngày</TabsTrigger>
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <Activity className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 border-red-200 text-red-600 hover:bg-red-100"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
          {/* Enhanced Metrics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Tổng người dùng"
              value={formatNumber(processedStats.users.total)}
              change={processedStats.users.growth}
              icon={Users}
              description={`${formatNumber(processedStats.users.active)} người dùng hoạt động`}
              trend={processedStats.users.growth > 0 ? 'up' : 'down'}
              progress={processedStats.users.total > 0 ? (processedStats.users.active / processedStats.users.total) * 100 : 0}
              target={`${formatNumber(processedStats.users.total)} người dùng`}
              color="blue"
            />
            <MetricCard
              title="Doanh thu tháng"
              value={formatCurrency(processedStats.revenue.total)}
              change={processedStats.revenue.growth}
              icon={DollarSign}
              description="Tổng doanh thu trong tháng"
              trend={processedStats.revenue.growth > 0 ? 'up' : 'down'}
              progress={processedStats.revenue.target > 0 ? (processedStats.revenue.total / processedStats.revenue.target) * 100 : 0}
              target={formatCurrency(processedStats.revenue.target)}
              color="green"
            />
            <MetricCard
              title="Đơn hàng"
              value={formatNumber(processedStats.orders.total)}
              change={processedStats.orders.growth}
              icon={ShoppingCart}
              description={`${processedStats.orders.pending} đơn hàng chờ xử lý`}
              trend={processedStats.orders.growth > 0 ? 'up' : 'down'}
              color="orange"
            />
            <MetricCard
              title="Sản phẩm"
              value={formatNumber(processedStats.products.total)}
              change={processedStats.products.growth}
              icon={Package}
              description={`${processedStats.products.outOfStock} sản phẩm hết hàng`}
              trend={processedStats.products.growth > 0 ? 'up' : 'down'}
              color="purple"
            />
          </div>

          {/* Enhanced Charts Section */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Revenue Chart - Takes 4 columns */}
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                    Doanh thu & Đơn hàng
                  </CardTitle>
                  <CardDescription>
                    Biểu đồ doanh thu và số đơn hàng trong 7 ngày qua
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value) : 
                        name === 'profit' ? formatCurrency(value) : formatNumber(value),
                        name === 'revenue' ? 'Doanh thu' : 
                        name === 'profit' ? 'Lợi nhuận' : 'Đơn hàng'
                      ]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      fill="url(#revenue)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10b981" 
                      fill="url(#profit)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution - Takes 3 columns */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-purple-600" />
                  Phân bố danh mục
                </CardTitle>
                <CardDescription>
                  Tỷ lệ bán hàng theo danh mục sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Tỷ lệ']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Growth Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Tăng trưởng người dùng
                </CardTitle>
                <CardDescription>
                  Số lượng người dùng mới và người dùng hoạt động theo thời gian
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      formatNumber(value),
                      name === 'newUsers' ? 'Người dùng mới' :
                      name === 'totalUsers' ? 'Tổng người dùng' : 'Người dùng hoạt động'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enhanced Recent Activity Section */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Recent Orders - Takes 3 columns */}
            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5 text-orange-600" />
                    Đơn hàng gần đây
                  </CardTitle>
                  <CardDescription>
                    {recentOrders.length} đơn hàng mới nhất trong hệ thống
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem tất cả
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <div key={order._id || order.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.user?.avatar || ''} alt={order.user?.username || 'User'} />
                          <AvatarFallback>{(order.user?.username || 'U').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">#{order._id?.slice(-8) || order.id}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.user?.username || 'N/A'}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(order.createdAt || order.date).toLocaleDateString('vi-VN')}</span>
                            <span>•</span>
                            <span>{order.items?.length || order.itemCount || 0} sản phẩm</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(order.totalAmount || order.amount || 0)}
                        </p>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có đơn hàng nào</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Products - Takes 2 columns */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-600" />
                    Sản phẩm bán chạy
                  </CardTitle>
                  <CardDescription>
                    Top {topProducts.length} sản phẩm có doanh số cao nhất
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.length > 0 ? topProducts.map((product, index) => (
                    <div key={product._id || product.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={product.images?.[0] || product.image || ''} alt={product.name} />
                        <AvatarFallback>{(product.name || 'P').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-tight">{product.name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {product.category?.name || product.category || 'N/A'}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">
                              {product.soldCount || 0} đã bán
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(product.price || 0)}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có sản phẩm nào</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
              <CardDescription>
                Các thao tác thường dùng trong quản trị hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <Users className="h-6 w-6" />
                  <span>Quản lý người dùng</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <Package className="h-6 w-6" />
                  <span>Thêm sản phẩm</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <ShoppingCart className="h-6 w-6" />
                  <span>Xử lý đơn hàng</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <CreditCard className="h-6 w-6" />
                  <span>Quản lý thanh toán</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
