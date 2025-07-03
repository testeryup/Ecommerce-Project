import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Eye,
  RefreshCw
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

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    users: { total: 1234, growth: 12.5, timeline: [] },
    revenue: { total: 125000000, growth: 8.3, timeline: [] },
    orders: { total: 856, growth: -2.1, timeline: [] },
    deposits: { total: 95000000, growth: 15.2, timeline: [] }
  });

  // Mock data for charts
  const revenueData = [
    { name: 'T1', value: 4000, orders: 240 },
    { name: 'T2', value: 3000, orders: 139 },
    { name: 'T3', value: 2000, orders: 980 },
    { name: 'T4', value: 2780, orders: 390 },
    { name: 'T5', value: 1890, orders: 480 },
    { name: 'T6', value: 2390, orders: 380 },
    { name: 'T7', value: 3490, orders: 430 }
  ];

  const userGrowthData = [
    { name: 'T1', users: 100, activeUsers: 80 },
    { name: 'T2', users: 150, activeUsers: 120 },
    { name: 'T3', users: 200, activeUsers: 180 },
    { name: 'T4', users: 280, activeUsers: 220 },
    { name: 'T5', users: 350, activeUsers: 300 },
    { name: 'T6', users: 420, activeUsers: 380 },
    { name: 'T7', users: 500, activeUsers: 450 }
  ];

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const MetricCard = ({ title, value, change, icon: Icon, description, trend }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span>so với tháng trước</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất và thống kê tổng quan của hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="day">Ngày</TabsTrigger>
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Tổng người dùng"
          value={stats.users.total.toLocaleString()}
          change={stats.users.growth}
          icon={Users}
          description="Tổng số người dùng đã đăng ký"
          trend={stats.users.growth > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Doanh thu"
          value={formatCurrency(stats.revenue.total)}
          change={stats.revenue.growth}
          icon={DollarSign}
          description="Tổng doanh thu trong tháng"
          trend={stats.revenue.growth > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Đơn hàng"
          value={stats.orders.total.toLocaleString()}
          change={stats.orders.growth}
          icon={ShoppingCart}
          description="Tổng số đơn hàng đã xử lý"
          trend={stats.orders.growth > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Giao dịch"
          value={formatCurrency(stats.deposits.total)}
          change={stats.deposits.growth}
          icon={Activity}
          description="Tổng giá trị giao dịch"
          trend={stats.deposits.growth > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo thời gian</CardTitle>
            <CardDescription>
              Biểu đồ doanh thu và số đơn hàng trong 7 ngày qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'value' ? formatCurrency(value) : value,
                    name === 'value' ? 'Doanh thu' : 'Đơn hàng'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
            <CardDescription>
              Số lượng người dùng mới và người dùng hoạt động
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Tổng người dùng"
                />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Người dùng hoạt động"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              5 đơn hàng mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: '#1234', customer: 'Nguyễn Văn A', amount: 2500000, status: 'completed' },
                { id: '#1235', customer: 'Trần Thị B', amount: 1800000, status: 'pending' },
                { id: '#1236', customer: 'Lê Văn C', amount: 3200000, status: 'processing' },
                { id: '#1237', customer: 'Phạm Thị D', amount: 950000, status: 'completed' },
                { id: '#1238', customer: 'Hoàng Văn E', amount: 4100000, status: 'cancelled' }
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {formatCurrency(order.amount)}
                    </span>
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                        order.status === 'processing' ? 'outline' : 'destructive'
                      }
                    >
                      {order.status === 'completed' ? 'Hoàn thành' :
                       order.status === 'pending' ? 'Chờ xử lý' :
                       order.status === 'processing' ? 'Đang xử lý' : 'Đã hủy'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>
              Top 5 sản phẩm có doanh số cao nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'iPhone 15 Pro Max', sales: 45, revenue: 67500000 },
                { name: 'Samsung Galaxy S24', sales: 38, revenue: 45600000 },
                { name: 'MacBook Pro M3', sales: 22, revenue: 55000000 },
                { name: 'iPad Air', sales: 31, revenue: 24800000 },
                { name: 'AirPods Pro', sales: 67, revenue: 20100000 }
              ].map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} đã bán</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
