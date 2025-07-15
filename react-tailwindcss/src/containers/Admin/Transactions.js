import React, { useState, useEffect } from 'react';
import { getTransactionStats, approveWithdraw, rejectWithdraw } from '../../services/adminService';
import { 
    RefreshCw,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Check,
    X,
    AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../ultils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const RejectModal = ({ isOpen, onClose, onConfirm, transaction }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối');
            return;
        }
        onConfirm(reason);
        setReason('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Từ chối yêu cầu rút tiền</h3>
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Yêu cầu: #{transaction?._id?.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                        Số tiền: {formatCurrency(transaction?.amount)}₫
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do từ chối
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows="4"
                            placeholder="Nhập lý do từ chối..."
                            required
                        />
                    </div>
                    <div className="flex space-x-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                            Từ chối
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Transactions() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getTransactionStats();
            if (response.errCode === 0) {
                // Ensure the data has the expected structure with defaults
                const data = response.data || {};
                setStats({
                    summary: data.summary || {
                        deposit: { total: 0, count: 0, completed: 0 },
                        withdrawal: { total: 0, count: 0, pending: 0 },
                        revenue: { total: 0, commission: 0 }
                    },
                    chartData: data.chartData || [],
                    pendingWithdrawals: data.recentWithdraws || []
                });
            } else {
                toast.error('Không thể tải thống kê giao dịch');
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Đã xảy ra lỗi khi tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleApprove = async (transactionId) => {
        try {
            const response = await approveWithdraw(transactionId);
            if (response.errCode === 0) {
                toast.success('Đã duyệt yêu cầu rút tiền');
                fetchStats();
            } else {
                toast.error(response.message || 'Không thể duyệt yêu cầu');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi duyệt yêu cầu');
        }
    };

    const handleReject = async (reason) => {
        try {
            const response = await rejectWithdraw(selectedTransaction._id, reason);
            if (response.errCode === 0) {
                toast.success('Đã từ chối yêu cầu rút tiền');
                setIsRejectModalOpen(false);
                setSelectedTransaction(null);
                fetchStats();
            } else {
                toast.error(response.message || 'Không thể từ chối yêu cầu');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi từ chối yêu cầu');
        }
    };

    const openRejectModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsRejectModalOpen(true);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
            approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800', icon: Check },
            rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: X }
        };
        return statusMap[status] || { label: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    };

    if (loading || !stats || !stats.summary) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý giao dịch</h1>
                <button
                    onClick={fetchStats}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 sm:mt-0"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Làm mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Nạp tiền</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.summary?.deposit?.total || 0)}₫</dd>
                                </dl>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <div>Số lượng: {stats.summary?.deposit?.count || 0}</div>
                                    <div>Hoàn thành: {stats.summary?.deposit?.completed || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingDown className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Rút tiền</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.summary?.withdrawal?.total || 0)}₫</dd>
                                </dl>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <div>Số lượng: {stats.summary?.withdrawal?.count || 0}</div>
                                    <div>Chờ duyệt: {stats.summary?.withdrawal?.pending || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DollarSign className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Doanh thu</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.summary?.revenue?.total || 0)}₫</dd>
                                </dl>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <div>Hoa hồng: {formatCurrency(stats.summary?.revenue?.commission || 0)}₫</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Biểu đồ giao dịch</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${formatCurrency(value)}₫`}
                        />
                        <Tooltip 
                            formatter={(value) => [`${formatCurrency(value)}₫`]}
                            labelFormatter={(label) => `Ngày: ${label}`}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="deposit" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            name="Nạp tiền"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="withdrawal" 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            name="Rút tiền"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Pending Withdrawals */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Yêu cầu rút tiền chờ duyệt</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã giao dịch
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người bán
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.pendingWithdrawals?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Không có yêu cầu rút tiền nào chờ duyệt
                                    </td>
                                </tr>
                            ) : (
                                stats.pendingWithdrawals?.map(transaction => {
                                    const statusInfo = getStatusInfo(transaction.status);
                                    const StatusIcon = statusInfo.icon;
                                    
                                    return (
                                        <tr key={transaction._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{transaction._id.slice(-8)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{transaction.userInfo?.username}</div>
                                                <div className="text-sm text-gray-500">{transaction.userInfo?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(transaction.amount)}₫
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {transaction.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleApprove(transaction._id)}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            <Check className="h-3 w-3 mr-1" />
                                                            Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(transaction)}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <X className="h-3 w-3 mr-1" />
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal */}
            <RejectModal
                isOpen={isRejectModalOpen}
                onClose={() => {
                    setIsRejectModalOpen(false);
                    setSelectedTransaction(null);
                }}
                onConfirm={handleReject}
                transaction={selectedTransaction}
            />
        </div>
    );
}
