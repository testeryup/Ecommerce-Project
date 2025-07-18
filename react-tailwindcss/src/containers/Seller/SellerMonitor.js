import React, { useState, useEffect } from 'react';
import { getSellerStats } from '../../services/sellerService';
import Loading from '../../components/Loading';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../ultils';
import { 
    Wallet, 
    ShoppingCart, 
    Package, 
    Users,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3
} from 'lucide-react';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const MetricCard = ({ icon: Icon, title, value, change, format, description }) => {
    const changeValue = parseFloat(change) || 0;
    const isPositive = changeValue >= 0;
    
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-2xl font-bold text-gray-900">{format ? format(value) : value}</dd>
                        </dl>
                        {changeValue !== 0 && (
                            <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? 
                                    <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                }
                                {Math.abs(changeValue).toFixed(1)}% so với hôm qua
                            </div>
                        )}
                        {description && (
                            <p className="text-xs text-gray-500 mt-2">{description}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{label}</p>
                <div className="flex items-center mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Doanh thu: {formatCurrency(payload[0].value)}₫</span>
                </div>
            </div>
        );
    }
    return null;
};

const RecentOrders = ({ orders }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Đơn hàng gần đây</h3>
        <div className="space-y-3">
            {orders && orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.orderId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                            <span className="text-sm font-medium text-gray-900">#{order.orderId?.slice(-8) || 'N/A'}</span>
                            <div className="text-sm text-gray-500">{order.buyerName || 'Khách hàng'}</div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                            </span>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                                {formatCurrency(order.total || 0)}₫
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có đơn hàng nào</p>
                </div>
            )}
        </div>
    </div>
);

const TopProducts = ({ products }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm bán chạy</h3>
        <div className="space-y-3">
            {products && products.length > 0 ? (
                products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">{product.name || 'Sản phẩm'}</h4>
                            <p className="text-sm text-gray-500">{product.sku || 'SKU'}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-gray-600">{product.soldCount || 0} đã bán</span>
                            <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(product.revenue || 0)}₫
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có sản phẩm bán chạy</p>
                </div>
            )}
        </div>
    </div>
);

const SalesChart = ({ data, timeRange }) => {
    const formatYAxis = value => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value;
    };

    // Handle empty or invalid data
    const chartData = Array.isArray(data) && data.length > 0 ? data : [
        { time: '00:00', sales: 0 },
        { time: '06:00', sales: 0 },
        { time: '12:00', sales: 0 },
        { time: '18:00', sales: 0 },
        { time: '23:59', sales: 0 }
    ];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Biểu đồ doanh thu {timeRange === 'today' ? 'hôm nay' : timeRange === 'week' ? 'tuần này' : 'tháng này'}
            </h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatYAxis}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#10b981"
                            fill="url(#salesGradient)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có dữ liệu biểu đồ</p>
                </div>
            )}
        </div>
    );
};

export default function SellerMonitor() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('today');

    useEffect(() => {
        fetchStats();
    }, [timeRange]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getSellerStats();
            if (response.errCode === 0) {
                setStats(response.data);
            } else {
                toast.error('Không thể tải thống kê');
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            toast.error('Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) return <div className="flex justify-center items-center min-h-96"><Loading /></div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                    {['today', 'week', 'month'].map(range => (
                        <button
                            key={range}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                timeRange === range 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range === 'today' ? 'Hôm nay' :
                                range === 'week' ? 'Tuần này' : 'Tháng này'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={Wallet}
                    title="Doanh thu"
                    value={stats.revenue?.[timeRange] || 0}
                    change={stats.revenue?.change || 0}
                    format={formatCurrency}
                />
                <MetricCard
                    icon={ShoppingCart}
                    title="Đơn hàng"
                    value={stats.orders?.[timeRange] || 0}
                    change={stats.orders?.change || 0}
                />
                <MetricCard
                    icon={Package}
                    title="Sản phẩm đã bán"
                    value={stats.products?.sold || 0}
                    change={stats.products?.change || 0}
                />
                <MetricCard
                    icon={Users}
                    title="Khách hàng mới"
                    value={stats.customers?.new || 0}
                    change={stats.customers?.change || 0}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
                <SalesChart data={stats.salesChart?.[timeRange] || []} timeRange={timeRange} />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders orders={stats.recentOrders || []} />
                <TopProducts products={stats.topProducts || []} />
            </div>
        </div>
    );
}