import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Button from '../ui/Button';
import MetricCard from './MetricCard';
import useRealTimeStats from '../../hooks/useRealTimeStats';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Activity,
  Eye,
  ArrowUpRight,
  Play,
  Pause,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  getAdminStats 
} from '../../services/adminService';

const AdminDashboard = () => {
  const { user } = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, year

  // Use real-time stats hook
  const { 
    stats: realTimeStats, 
    lastUpdated, 
    stopRealTimeUpdates, 
    startRealTimeUpdates, 
    isRealTimeActive 
  } = useRealTimeStats(adminStats, 5000); // Update every 5 seconds

  // Sample data for charts (in a real app, this would come from API)
  const generateChartData = () => {
    if (!realTimeStats) return { revenueData: [], categoryData: [] };

    // Revenue chart data from backend timeline
    const revenueData = realTimeStats.revenue?.timeline?.map((item, index) => ({
      name: new Date(item.date).toLocaleDateString('vi-VN', { 
        month: 'short', 
        day: 'numeric' 
      }),
      revenue: item.value,
      orders: realTimeStats.orders?.timeline?.[index]?.value || 0,
      users: realTimeStats.users?.timeline?.[index]?.value || 0
    })) || [];

    // Category data based on product status
    const productStats = realTimeStats.products || {};
    const categoryData = [
      { 
        name: 'Sản phẩm đang hoạt động', 
        value: productStats.active || 0, 
        color: '#3b82f6' 
      },
      { 
        name: 'Sản phẩm chờ duyệt', 
        value: productStats.pending || 0, 
        color: '#f59e0b' 
      },
      { 
        name: 'Sản phẩm ngừng bán', 
        value: productStats.inactive || 0, 
        color: '#ef4444' 
      }
    ];

    return { revenueData, categoryData };
  };

  const { revenueData, categoryData } = generateChartData();

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const adminStatsResponse = await getAdminStats().catch(err => {
        console.error('Admin stats error:', err);
        return { data: null };
      });

      setAdminStats(adminStatsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  const toggleRealTime = () => {
    if (isRealTimeActive) {
      stopRealTimeUpdates();
    } else {
      startRealTimeUpdates();
    }
  };

  const formatLastUpdated = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Chào mừng trở lại, {user?.username || 'Admin'}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Chào mừng trở lại, {user?.username || 'Admin'}</p>
          </div>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tải lại
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-red-600 mb-2">Lỗi tải dữ liệu</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refreshData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tổng quan Dashboard
          </h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại, <span className="font-medium">{user?.username || 'Admin'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Cập nhật: {formatLastUpdated(lastUpdated)}</span>
          </div>
          <Button
            onClick={toggleRealTime}
            variant={isRealTimeActive ? "default" : "outline"}
            size="sm"
            className="h-8"
          >
            {isRealTimeActive ? (
              <>
                <Pause className="mr-2 h-3 w-3" />
                Dừng
              </>
            ) : (
              <>
                <Play className="mr-2 h-3 w-3" />
                Live
              </>
            )}
          </Button>
          <div className="flex rounded-lg border p-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="h-8 px-3"
              >
                {range === 'day' ? 'Ngày' : range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
              </Button>
            ))}
          </div>
          <Button onClick={refreshData} variant="outline" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Real-time Status Banner */}
      {isRealTimeActive && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardContent className="flex items-center gap-2 py-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Đang cập nhật dữ liệu thời gian thực
            </span>
            <span className="text-xs text-green-600 dark:text-green-400 ml-auto">
              Cập nhật lần cuối: {formatLastUpdated(lastUpdated)}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Tổng người dùng"
          value={realTimeStats?.users?.total?.users || 0}
          change={12.5}
          changeType="positive"
          icon={Users}
          color="blue"
        />
        
        <MetricCard
          title="Đơn hàng tháng này"
          value={realTimeStats?.orders?.month || 0}
          change={8.2}
          changeType="positive"
          icon={ShoppingCart}
          color="purple"
        />
        
        <MetricCard
          title="Doanh thu tháng này"
          value={realTimeStats?.revenue?.month || 0}
          change={15.3}
          changeType="positive"
          icon={DollarSign}
          color="green"
          format="currency"
        />
        
        <MetricCard
          title="Tổng sản phẩm"
          value={realTimeStats?.products?.total || 0}
          change={3.1}
          changeType="positive"
          icon={Package}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Biểu đồ doanh thu
            </CardTitle>
            <CardDescription>
              Doanh thu theo thời gian ({timeRange === 'month' ? 'theo tháng' : 'theo ngày'})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={formatNumber}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                  labelStyle={{ color: '#1e293b' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Đơn hàng & Người dùng
            </CardTitle>
            <CardDescription>
              Thống kê đơn hàng và người dùng mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="orders" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                  name="Đơn hàng"
                />
                <Bar 
                  dataKey="users" 
                  fill="#06d6a0" 
                  radius={[4, 4, 0, 0]}
                  name="Người dùng mới"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Category Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Phân phối danh mục</CardTitle>
            <CardDescription>
              Tỷ lệ sản phẩm theo danh mục
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
                <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value} sản phẩm</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Thống kê chi tiết và hoạt động hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Đơn hàng hôm nay</p>
                    <p className="text-2xl font-bold text-blue-600">{realTimeStats?.orders?.today || 0}</p>
                  </div>
                  <div className="text-green-600">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Doanh thu hôm nay</p>
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(realTimeStats?.revenue?.today || 0)}
                    </p>
                  </div>
                  <div className="text-green-600">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Nạp tiền hôm nay</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(realTimeStats?.deposits?.today || 0)}
                    </p>
                  </div>
                  <div className="text-green-600">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Người dùng online</p>
                    <p className="text-2xl font-bold text-green-600">{realTimeStats?.users?.online || 0}</p>
                  </div>
                  <div className="text-green-600">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Người bán</p>
                    <p className="text-2xl font-bold text-orange-600">{realTimeStats?.users?.total?.sellers || 0}</p>
                  </div>
                  <div className="text-blue-600">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Sản phẩm chờ duyệt</p>
                    <p className="text-2xl font-bold text-yellow-600">{realTimeStats?.products?.pending || 0}</p>
                  </div>
                  <div className="text-yellow-600">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Tài khoản bị khóa</p>
                    <p className="text-2xl font-bold text-red-600">{realTimeStats?.users?.total?.suspended || 0}</p>
                  </div>
                  <div className="text-red-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
