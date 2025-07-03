import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '../ui/dialog';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Edit,
  Ban,
  Shield,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  getUserStats, 
  changeUserRole, 
  changeUserStatus,
  updateUser 
} from '../../services/adminService';
import { formatCurrency } from '../../ultils';
import toast from 'react-hot-toast';

const UsersManagement = () => {
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
        toast.error('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách người dùng');
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'seller':
        return 'bg-blue-500';
      case 'user':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'suspended':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading || !usersData) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin và phân quyền người dùng
          </p>
        </div>
        <Button onClick={fetchUsers} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Tất cả vai trò ({usersData.filters?.role?.available?.all || 0})</option>
                <option value="user">Người dùng ({usersData.filters?.role?.available?.user || 0})</option>
                <option value="seller">Người bán ({usersData.filters?.role?.available?.seller || 0})</option>
                <option value="admin">Admin ({usersData.filters?.role?.available?.admin || 0})</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Tất cả trạng thái ({usersData.filters?.status?.available?.all || 0})</option>
                <option value="active">Hoạt động ({usersData.filters?.status?.available?.active || 0})</option>
                <option value="suspended">Đã khóa ({usersData.filters?.status?.available?.suspended || 0})</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số dư</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead>Số đơn hàng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role === 'admin' ? 'Admin' :
                         user.role === 'seller' ? 'Seller' : 'User'}
                      </Badge>
                      {user.role !== 'admin' && (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                        </select>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(user.balance || 0)}₫</TableCell>
                  <TableCell>{formatCurrency(user.totalSpent || 0)}₫</TableCell>
                  <TableCell>{user.orderCount || 0}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(user)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(user._id, user.status)}
                        disabled={user.role === 'admin'}
                        className="h-8 w-8"
                      >
                        {user.status === 'active' ? 
                          <Ban className="h-4 w-4 text-red-500" /> : 
                          <UserCheck className="h-4 w-4 text-green-500" />
                        }
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('page', filters.page - 1)}
            disabled={!usersData.pagination?.hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {usersData.pagination?.currentPage} / {usersData.pagination?.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('page', filters.page + 1)}
            disabled={!usersData.pagination?.hasNext}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Hiển thị:</span>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-muted-foreground">/ trang</span>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết của người dùng
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm 
              user={selectedUser} 
              onSave={handleSaveUser}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Edit User Form Component
const EditUserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    firstName: user.firstName || '',
    lastName: user.lastName || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Họ</label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Nhập họ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Nhập tên"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <Input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Nhập username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Địa chỉ</label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

export default UsersManagement;
