import React, { useState, useEffect } from 'react';
import { getOrders, refundOrder, reportOrder, getOrderDetail } from '../../services/sellerService';
import Loading from '../../components/Loading';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../ultils';
import { 
    Eye, 
    RotateCw, 
    Undo, 
    Flag, 
    Check, 
    Clock, 
    List,
    ChevronLeft,
    ChevronRight,
    Package,
    User,
    Calendar
} from 'lucide-react';

const RefundModal = ({ order, isOpen, onClose, onConfirm }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận hoàn tiền</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc chắn muốn hoàn tiền cho đơn hàng #{order.orderId}?
                </p>
                <div className="flex space-x-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onConfirm(order)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Xác nhận hoàn tiền
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReportModal = ({ order, isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');

    if (!isOpen || !order) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error('Vui lòng nhập lý do báo cáo');
            return;
        }
        onConfirm(order, reason);
        setReason('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Báo cáo đơn hàng</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Đơn hàng #{order.orderId}
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do báo cáo..."
                    className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="flex space-x-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Gửi báo cáo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNext: false,
        hasPrev: false
    });
    const [activeFilter, setActiveFilter] = useState('all');

    const filterOptions = [
        { value: 'all', label: 'Tất cả', icon: List, color: 'bg-gray-100 text-gray-800' },
        { value: 'completed', label: 'Hoàn thành', icon: Check, color: 'bg-green-100 text-green-800' },
        { value: 'processing', label: 'Đang xử lý', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
        { value: 'refunded', label: 'Đã hoàn tiền', icon: Undo, color: 'bg-blue-100 text-blue-800' },
        { value: 'reported', label: 'Đã báo cáo', icon: Flag, color: 'bg-red-100 text-red-800' }
    ];

    const getStatusInfo = (status) => {
        const statusMap = {
            completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: Check },
            refunded: { label: 'Đã hoàn tiền', color: 'bg-blue-100 text-blue-800', icon: Undo },
            processing: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            reported: { label: 'Đã báo cáo', color: 'bg-red-100 text-red-800', icon: Flag }
        };
        return statusMap[status] || { label: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: Package };
    };

    useEffect(() => {
        fetchOrders(pagination.currentPage, activeFilter);
    }, [pagination.currentPage, activeFilter]);

    const fetchOrders = async (page, status = activeFilter) => {
        try {
            setLoading(true);
            const response = await getOrders({
                page,
                limit: pagination.itemsPerPage,
                status: status !== 'all' ? status : undefined
            });

            if (response.errCode === 0) {
                setOrders(response.data.orders);
                setPagination(response.data.pagination);
            } else {
                toast.error('Không thể tải danh sách đơn hàng');
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchOrders(pagination.currentPage, activeFilter);
        toast.success('Đã cập nhật danh sách đơn hàng');
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleFilterChange = (filterValue) => {
        setActiveFilter(filterValue);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleRefund = async (order) => {
        try {
            const response = await refundOrder(order.orderId);
            if (response.errCode === 0) {
                toast.success('Đã hoàn tiền thành công');
                setIsRefundModalOpen(false);
                setSelectedOrder(null);
                fetchOrders(pagination.currentPage, activeFilter);
            } else {
                toast.error('Không thể hoàn tiền');
            }
        } catch (error) {
            console.error('Failed to refund order:', error);
            toast.error('Đã có lỗi xảy ra');
        }
    };

    const handleReport = async (order, reason) => {
        try {
            const response = await reportOrder(order.orderId, reason);
            if (response.errCode === 0) {
                toast.success('Đã gửi báo cáo thành công');
                setIsReportModalOpen(false);
                setSelectedOrder(null);
                fetchOrders(pagination.currentPage, activeFilter);
            } else {
                toast.error('Không thể gửi báo cáo');
            }
        } catch (error) {
            console.error('Failed to report order:', error);
            toast.error('Đã có lỗi xảy ra');
        }
    };

    if (loading && orders.length === 0) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4 sm:mt-0"
                >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Làm mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-wrap gap-3">
                    {filterOptions.map((filter) => {
                        const Icon = filter.icon;
                        return (
                            <button
                                key={filter.value}
                                onClick={() => handleFilterChange(filter.value)}
                                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeFilter === filter.value
                                        ? filter.color
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow overflow-hidden rounded-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đơn hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => {
                                const statusInfo = getStatusInfo(order.status);
                                const StatusIcon = statusInfo.icon;
                                
                                return (
                                    <tr key={order.orderId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Package className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{order.orderId}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.itemCount || 1} sản phẩm
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.buyerName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.buyerEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(order.total)}₫
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                {order.status === 'completed' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsRefundModalOpen(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                                                        title="Hoàn tiền"
                                                    >
                                                        <Undo className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {order.status !== 'reported' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsReportModalOpen(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                                        title="Báo cáo"
                                                    >
                                                        <Flag className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!pagination.hasPrev}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                        Trước
                    </button>
                    <button
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!pagination.hasNext}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                        Sau
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)}</span> đến{' '}
                            <span className="font-medium">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> trong{' '}
                            <span className="font-medium">{pagination.totalItems}</span> kết quả
                        </p>
                    </div>
                    <div className="flex space-x-1">
                        <button
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!pagination.hasPrev}
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!pagination.hasNext}
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <RefundModal
                order={selectedOrder}
                isOpen={isRefundModalOpen}
                onClose={() => {
                    setIsRefundModalOpen(false);
                    setSelectedOrder(null);
                }}
                onConfirm={handleRefund}
            />

            <ReportModal
                order={selectedOrder}
                isOpen={isReportModalOpen}
                onClose={() => {
                    setIsReportModalOpen(false);
                    setSelectedOrder(null);
                }}
                onConfirm={handleReport}
            />
        </div>
    );
}
