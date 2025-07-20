import React, { useState, useEffect } from 'react';
import './Overview.scss';
import { getAdminStats, getTransactionStats } from '../../services/adminService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCurrency } from '../../ultils';
import Loading from '../../components/Loading';
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
    const [customDateRange, setCustomDateRange] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Khởi tạo ngày mặc định
    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    }, []);

    const fetchData = async (params = {}) => {
        try {
            setLoading(true);
            const [statsResponse, transactionResponse] = await Promise.all([
                getAdminStats(params),
                getTransactionStats(params)
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

    useEffect(() => {
        const params = customDateRange 
            ? { startDate, endDate }
            : { timeRange };
        
        fetchData(params);
    }, [timeRange, customDateRange, startDate, endDate]);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        setCustomDateRange(false);
    };

    const handleCustomDateSubmit = () => {
        if (!startDate || !endDate) {
            alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
            return;
        }
        
        if (startDate > endDate) {
            alert('Ngày bắt đầu không được lớn hơn ngày kết thúc');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (endDate > today) {
            alert('Ngày kết thúc không được lớn hơn ngày hiện tại');
            return;
        }

        setCustomDateRange(true);
    };

    const handleCustomDateToggle = () => {
        if (customDateRange) {
            // Nếu đang ở chế độ custom, chuyển về chế độ timeRange
            setCustomDateRange(false);
        } else {
            // Nếu đang ở chế độ timeRange, chuyển về chế độ custom
            setCustomDateRange(true);
        }
    };

    const handleRefresh = () => {
        const params = customDateRange 
            ? { startDate, endDate }
            : { timeRange };
        
        fetchData(params);
    };

    if (loading || !stats || !transactionStats) return <Loading />;

    return (
        <div className="admin-overview">
            <div className="overview-header">
                <h1>Tổng quan hệ thống</h1>
                <div className="time-filter">
                    <button className='filter-btn' onClick={handleRefresh}>
                        <i className="fas fa-sync-alt"></i> Làm mới
                    </button>
                    
                    {!customDateRange && (
                        <>
                            {['today', 'week', 'month'].map(range => (
                                <button
                                    key={range}
                                    className={`filter-btn ${timeRange === range ? 'active' : ''}`}
                                    onClick={() => handleTimeRangeChange(range)}
                                >
                                    {range === 'today' ? 'Hôm nay' :
                                        range === 'week' ? 'Tuần này' : 'Tháng này'}
                                </button>
                            ))}
                        </>
                    )}
                    
                    <button 
                        className={`filter-btn ${customDateRange ? 'active' : ''}`}
                        onClick={handleCustomDateToggle}
                    >
                        <i className="far fa-calendar-alt"></i> Tùy chọn
                    </button>
                </div>
            </div>

            {customDateRange && (
                <div className="custom-date-filter">
                    <div className="date-inputs">
                        <div className="date-input">
                            <label>Từ ngày:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate}
                            />
                        </div>
                        <div className="date-input">
                            <label>Đến ngày:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <button 
                            className="apply-btn"
                            onClick={handleCustomDateSubmit}
                            disabled={!startDate || !endDate || startDate > endDate}
                        >
                            Áp dụng
                        </button>
                    </div>
                    <div className="filter-info">
                        <span>Khoảng thời gian: {startDate} - {endDate}</span>
                    </div>
                </div>
            )}

            {!customDateRange && (
                <div className="current-filter-info">
                    <span>
                        Đang xem: {
                            timeRange === 'today' ? 'Hôm nay' :
                            timeRange === 'week' ? 'Tuần này (7 ngày gần nhất)' :
                            'Tháng này (30 ngày gần nhất)'
                        }
                    </span>
                </div>
            )}

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon users">
                        <FontAwesomeIcon icon="users" />
                    </div>
                    <div className="metric-info">
                        <h3>Người dùng</h3>
                        <p className="metric-value">{stats.users.total.users}</p>
                        <div className="metric-details">
                            <span>Sellers: {stats.users.total.sellers}</span>
                            <span>Admins: {stats.users.total.admins}</span>
                            <span>Suspended: {stats.users.total.suspended}</span>
                        </div>
                        {customDateRange && (
                            <div className="period-info">
                                <small>Người dùng mới: {stats.users.periodTotal}</small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon revenue">
                        <FontAwesomeIcon icon="wallet" />
                    </div>
                    <div className="metric-info">
                        <h3>Doanh thu</h3>
                        <p className="metric-value">{formatCurrency(stats.revenue.periodTotal)}₫</p>
                        {customDateRange && (
                            <div className="period-info">
                                <small>Khoảng thời gian đã chọn</small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon orders">
                        <FontAwesomeIcon icon="shopping-cart" />
                    </div>
                    <div className="metric-info">
                        <h3>Đơn hàng</h3>
                        <p className="metric-value">{stats.orders.periodTotal}</p>
                        {customDateRange && (
                            <div className="period-info">
                                <small>Khoảng thời gian đã chọn</small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon deposits">
                        <FontAwesomeIcon icon="money-bill-wave" />
                    </div>
                    <div className="metric-info">
                        <h3>Nạp tiền</h3>
                        <p className="metric-value">{formatCurrency(stats.deposits.periodTotal)}₫</p>
                        {customDateRange && (
                            <div className="period-info">
                                <small>Khoảng thời gian đã chọn</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Doanh thu</h3>
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

                <div className="chart-card">
                    <h3>Đơn hàng</h3>
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
                
                <div className="chart-card">
                    <h3>Người dùng mới</h3>
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
                            <Legend></Legend>
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

                <div className="chart-card">
                    <h3>Giao dịch</h3>
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
    );
}