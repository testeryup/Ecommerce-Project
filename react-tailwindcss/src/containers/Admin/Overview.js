import React, { useState, useEffect } from 'react';
import { getAdminStats, getTransactionStats } from '../../services/adminService';
import { formatCurrency } from '../../ultils';
import Loading from '../../components/Loading';
import { 
    Users, 
    Wallet, 
    ShoppingCart, 
    CreditCard,
    RotateCcw
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
    Legend,
    Line,
    LineChart
} from 'recharts';

export default function Overview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');
    const [transactionStats, setTransactionStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsResponse, transactionResponse] = await Promise.all([
                    getAdminStats(),
                    getTransactionStats()
                ]);

                if (statsResponse.errCode === 0) {
                    setStats(statsResponse.data);
                }
                if (transactionResponse.errCode === 0) {
                    setTransactionStats(transactionResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !stats || !transactionStats) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Làm mới
                    </button>
                    {['today', 'week', 'month'].map(range => (
                        <button
                            key={range}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                timeRange === range 
                                    ? 'bg-indigo-600 text-white' 
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
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Người dùng</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{stats.users.total.users}</dd>
                                </dl>
                                <div className="mt-2 text-xs text-gray-500 space-y-1">
                                    <div>Sellers: {stats.users.total.sellers}</div>
                                    <div>Admins: {stats.users.total.admins}</div>
                                    <div>Suspended: {stats.users.total.suspended}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Wallet className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Doanh thu</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue[timeRange])}₫</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ShoppingCart className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Đơn hàng</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{stats.orders[timeRange]}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Nạp tiền</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.deposits[timeRange])}₫</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Doanh thu</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.revenue.timeline}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
                                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                                        return value;
                                    }}
                                />
                                <Tooltip formatter={(value) => [`${formatCurrency(value)}₫`, 'Doanh thu']} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0a59cc"
                                    fill="#e7f0ff"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Đơn hàng</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.orders.timeline}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [`${value} đơn hàng`, 'Số lượng']}
                                    cursor={{ fill: 'rgba(46, 204, 113, 0.1)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#2ecc71"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Người dùng mới</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.users.timeline}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    allowDecimals={false}
                                    tickCount={5}
                                    domain={[0, 'auto']}
                                />
                                <Tooltip formatter={(value) => [`${value}`, 'Người dùng mới']} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fill="#e7f0ff"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Giao dịch</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={transactionStats.chartData}>
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
                                    formatter={(value) => [`${formatCurrency(value)}₫`]}
                                    labelFormatter={(label) => `Ngày: ${label}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="deposit"
                                    name="Nạp tiền"
                                    stroke="#2ecc71"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="withdrawal"
                                    name="Rút tiền"
                                    stroke="#e74c3c"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="refund"
                                    name="Hoàn tiền"
                                    stroke="#f1c40f"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
