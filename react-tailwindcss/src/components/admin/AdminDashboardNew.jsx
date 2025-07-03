import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  RefreshCw,
  Wallet,
  CreditCard,
  Package,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { getAdminStats, getTransactionStats } from '../../services/adminService';
import { formatCurrency } from '../../ultils';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [transactionStats, setTransactionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, transactionResponse] = await Promise.all([
        getAdminStats(),
        getTransactionStats()
      ]);

      if (statsResponse.errCode === 0) {
        setStats(statsResponse.data);
      } else {
        toast.error('Không thể tải thống kê hệ thống');
      }

      if (transactionResponse.errCode === 0) {
        setTransactionStats(transactionResponse.data);
      } else {
        toast.error('Không thể tải thống kê giao dịch');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!stats && !transactionStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-4">Không thể tải dữ liệu dashboard</p>
          <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Tổng quan về hoạt động kinh doanh và hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="flex rounded-lg bg-white border shadow-sm">
                {['today', 'week', 'month'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={`rounded-lg ${timeRange === range ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  >
                    {range === 'today' ? 'Hôm nay' :
                     range === 'week' ? 'Tuần' : 'Tháng'}
                  </Button>
                ))}
              </div>
            </div>
            <Button 
              onClick={fetchData} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-white"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Tổng người dùng</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {stats?.users?.total?.users || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-600 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Doanh thu</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {formatCurrency(stats?.revenue?.[timeRange] || 0)}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.3%</span>
                  </div>
                </div>
                <div className="p-3 bg-green-600 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Đơn hàng</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {stats?.orders?.[timeRange] || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5.2%</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-600 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Withdrawals */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Chờ duyệt</p>
                  <p className="text-3xl font-bold text-orange-900 mt-1">
                    {transactionStats?.summary?.withdrawal?.pending || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">Cần xử lý</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-600 rounded-full">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Thống kê người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Người dùng</span>
                  <span className="font-semibold">{stats?.users?.total?.users || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Người bán</span>
                  <span className="font-semibold">{stats?.users?.total?.sellers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quản trị viên</span>
                  <span className="font-semibold">{stats?.users?.total?.admins || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bị đình chỉ</span>
                  <Badge variant="destructive">{stats?.users?.total?.suspended || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thống kê sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tổng sản phẩm</span>
                  <span className="font-semibold">{stats?.products?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đang hoạt động</span>
                  <Badge variant="default">{stats?.products?.active || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Chờ duyệt</span>
                  <Badge variant="secondary">{stats?.products?.pending || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tạm dừng</span>
                  <Badge variant="outline">{stats?.products?.inactive || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tổng quan giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Nạp tiền</span>
                    <span className="font-semibold">
                      {formatCurrency(transactionStats?.summary?.deposit?.total || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Thành công</span>
                    <Badge variant="outline" className="text-green-600">
                      {transactionStats?.summary?.deposit?.completed || 0}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Rút tiền</span>
                    <span className="font-semibold">
                      {formatCurrency(transactionStats?.summary?.withdrawal?.total || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Chờ duyệt</span>
                    <Badge variant="outline" className="text-yellow-600">
                      {transactionStats?.summary?.withdrawal?.pending || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu</CardTitle>
              <CardDescription>
                Doanh thu theo thời gian trong {timeRange === 'today' ? 'ngày' : timeRange === 'week' ? 'tuần' : 'tháng'} này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {stats?.revenue?.timeline && stats.revenue.timeline.length > 0 ? (
                  <AreaChart data={stats.revenue.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value;
                      }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value)}`, 'Doanh thu']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#059669"
                      fill="#10b981"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có dữ liệu doanh thu</p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ đơn hàng</CardTitle>
              <CardDescription>
                Số lượng đơn hàng theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {stats?.orders?.timeline && stats.orders.timeline.length > 0 ? (
                  <BarChart data={stats.orders.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'Đơn hàng']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có dữ liệu đơn hàng</p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Các giao dịch và hoạt động mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactionStats?.recentTransactions && transactionStats.recentTransactions.length > 0 ? (
                transactionStats.recentTransactions.slice(0, 5).map((transaction, index) => (
                  <div key={transaction.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-500' : 
                        transaction.type === 'withdrawal' ? 'bg-blue-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.type === 'deposit' ? 'Nạp tiền' : 
                           transaction.type === 'withdrawal' ? 'Rút tiền' : 'Hoàn tiền'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.username || 'Anonymous'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 
                                 transaction.status === 'pending' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {transaction.status === 'completed' ? 'Hoàn thành' : 
                         transaction.status === 'pending' ? 'Chờ duyệt' : 
                         transaction.status === 'failed' ? 'Thất bại' : 'Đã hủy'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có hoạt động gần đây</p>
                  <p className="text-sm">Các giao dịch mới sẽ hiển thị ở đây</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
