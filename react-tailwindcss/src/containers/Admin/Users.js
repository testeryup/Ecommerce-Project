import React, { useState, useEffect } from 'react';
import { 
    getUserStats, 
    changeUserRole, 
    changeUserStatus,
    updateUser 
} from '../../services/adminService';
import { 
    Search, 
    RotateCcw, 
    Edit, 
    Ban, 
    Unlock, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';
import { formatCurrency } from '../../ultils';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import EditUserModal from './EditUserModal';

export default function Users() {
    const [usersData, setUsersData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        role: 'all',
        status: 'all',
        search: ''
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUserStats(
                filters.page,
                filters.limit,
                filters.role,
                filters.status,
                filters.search
            );
            if (response.errCode === 0) {
                setUsersData(response.data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('An error occurred while fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await changeUserRole(newRole, userId);
            if (response.errCode === 0) {
                toast.success('Đã cập nhật vai trò người dùng');
                fetchUsers();
            } else {
                toast.error(response.message || 'Không thể cập nhật vai trò');
            }
        } catch (error) {
            console.error('Error changing user role:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật vai trò');
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            const response = await changeUserStatus(newStatus, userId);
            if (response.errCode === 0) {
                toast.success(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản`);
                fetchUsers();
            } else {
                toast.error(response.message || 'Không thể cập nhật trạng thái');
            }
        } catch (error) {
            console.error('Error changing user status:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái');
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key === 'page' ? value : 1
        }));
    };
    const handleSaveUser = async (userData) => {
        try {
            const response = await updateUser(selectedUser._id, userData);
            if (response.errCode === 0) {
                toast.success('Cập nhật thông tin thành công');
                setIsEditModalOpen(false);
                setSelectedUser(null);
                fetchUsers();
            } else {
                toast.error(response.message || 'Không thể cập nhật thông tin');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật thông tin');
        }
    };
    const handleRefresh = () => {
        setFilters({
            page: 1,
            limit: 10,
            role: 'all',
            status: 'all',
            search: ''
        });
        fetchUsers();
    };

    if (loading || !usersData) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                <button 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4 sm:mt-0"
                    onClick={handleRefresh}
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Tìm kiếm người dùng..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                    >
                        <option value="all">Tất cả vai trò ({usersData.filters.role.available.all})</option>
                        <option value="user">Người dùng ({usersData.filters.role.available.user})</option>
                        <option value="seller">Người bán ({usersData.filters.role.available.seller})</option>
                        <option value="admin">Admin ({usersData.filters.role.available.admin})</option>
                    </select>

                    <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái ({usersData.filters.status.available.all})</option>
                        <option value="active">Hoạt động ({usersData.filters.status.available.active})</option>
                        <option value="suspended">Đã khóa ({usersData.filters.status.available.suspended || 0})</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow overflow-hidden rounded-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số dư</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng chi tiêu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usersData.users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.role === 'admin' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : user.role === 'seller' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.role === 'admin' ? 'Admin' :
                                                    user.role === 'seller' ? 'Seller' : 'User'}
                                            </span>
                                            {user.role !== 'admin' && (
                                                <select
                                                    className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="seller">Seller</option>
                                                </select>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.balance)}₫</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.totalSpent)}₫</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.orderCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                                                title="Chỉnh sửa"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className={`p-1 rounded-md ${
                                                    user.status === 'active' 
                                                        ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                                        : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                                }`}
                                                title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                                                onClick={() => handleStatusChange(user._id, user.status)}
                                                disabled={user.role === 'admin'}
                                            >
                                                {user.status === 'active' ? 
                                                    <Ban className="h-4 w-4" /> : 
                                                    <Unlock className="h-4 w-4" />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!usersData.pagination.hasPrev}
                        onClick={() => handleFilterChange('page', filters.page - 1)}
                    >
                        Trước
                    </button>
                    <button
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!usersData.pagination.hasNext}
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                    >
                        Sau
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-700">
                            Trang {usersData.pagination.currentPage} / {usersData.pagination.totalPages}
                        </p>
                        <select
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
                        >
                            <option value={10}>10 / trang</option>
                            <option value={20}>20 / trang</option>
                            <option value={50}>50 / trang</option>
                        </select>
                    </div>
                    <div className="flex space-x-1">
                        <button
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!usersData.pagination.hasPrev}
                            onClick={() => handleFilterChange('page', filters.page - 1)}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!usersData.pagination.hasNext}
                            onClick={() => handleFilterChange('page', filters.page + 1)}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
}
