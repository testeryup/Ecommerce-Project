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
  TableRow 
} from '../ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  MoreHorizontal, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  User,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { getTransactionStats, approveWithdraw, rejectWithdraw } from '../../services/adminService';
import { formatCurrency } from '../../ultils';
import toast from 'react-hot-toast';

const TransactionsManagement = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getTransactionStats();
      if (response.errCode === 0) {
        setStats(response.data);
        setTransactions(response.data.recentTransactions || []);
      } else {
        toast.error('Không thể tải thống kê giao dịch');
      }
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      toast.error('Đã xảy ra lỗi khi tải thống kê giao dịch');
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
        toast.success('Duyệt giao dịch thành công');
        fetchStats(); // Refresh data
      } else {
        toast.error(response.errMessage || 'Không thể duyệt giao dịch');
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast.error('Đã xảy ra lỗi khi duyệt giao dịch');
    }
  };

  const handleReject = async (transactionId, reason) => {
    try {
      const response = await rejectWithdraw(transactionId, reason);
      if (response.errCode === 0) {
        toast.success('Từ chối giao dịch thành công');
        fetchStats(); // Refresh data
        setRejectModalOpen(false);
        setRejectReason('');
      } else {
        toast.error(response.errMessage || 'Không thể từ chối giao dịch');
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast.error('Đã xảy ra lỗi khi từ chối giao dịch');
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const handleRejectClick = (transaction) => {
    setSelectedTransaction(transaction);
    setRejectModalOpen(true);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'deposit': return 'bg-green-100 text-green-800';
      case 'withdrawal': return 'bg-blue-100 text-blue-800';
      case 'refund': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading || !stats) {
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
          <h2 className="text-3xl font-bold tracking-tight">Quản lý giao dịch</h2>
          <p className="text-muted-foreground">
            Giám sát và quản lý tất cả giao dịch trong hệ thống
          </p>
        </div>
        <Button 
          onClick={fetchStats} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng nạp tiền
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.summary?.deposit?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.summary?.deposit?.count || 0} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng rút tiền
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.summary?.withdrawal?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.summary?.withdrawal?.count || 0} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chờ duyệt
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary?.withdrawal?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Rút tiền chờ duyệt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hoàn thành
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary?.deposit?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Giao dịch thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {stats.chartData && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê giao dịch theo thời gian</CardTitle>
            <CardDescription>
              Biểu đồ thống kê các giao dịch trong 7 ngày qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
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
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Rút tiền"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
          <CardDescription>
            Danh sách các giao dịch mới nhất trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="completed">Hoàn thành</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không có giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium font-mono text-xs">
                        {transaction.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{transaction.username}</div>
                            <div className="text-sm text-muted-foreground">{transaction.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getTypeBadgeClass(transaction.type)}>
                          {transaction.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusBadgeClass(transaction.status)}>
                          {transaction.status === 'pending' ? 'Chờ duyệt' : 
                           transaction.status === 'completed' ? 'Hoàn thành' : 'Thất bại'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(transaction.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {transaction.status === 'pending' && transaction.type === 'withdrawal' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(transaction.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRejectClick(transaction)}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Từ chối
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về giao dịch
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mã giao dịch</label>
                  <p className="text-sm font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Người dùng</label>
                  <p className="text-sm">{selectedTransaction.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Loại giao dịch</label>
                  <Badge variant="secondary" className={getTypeBadgeClass(selectedTransaction.type)}>
                    {selectedTransaction.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <Badge variant="secondary" className={getStatusBadgeClass(selectedTransaction.status)}>
                    {selectedTransaction.status === 'pending' ? 'Chờ duyệt' : 
                     selectedTransaction.status === 'completed' ? 'Hoàn thành' : 'Thất bại'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số tiền</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
                  <p className="text-sm">{formatDateTime(selectedTransaction.createdAt)}</p>
                </div>
              </div>
              
              {selectedTransaction.status === 'pending' && selectedTransaction.type === 'withdrawal' && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleRejectClick(selectedTransaction);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button 
                    onClick={() => {
                      handleApprove(selectedTransaction.id);
                      setDetailModalOpen(false);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Duyệt
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối giao dịch</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối giao dịch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lý do từ chối</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
                rows={3}
                placeholder="Nhập lý do từ chối..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectReason('');
                }}
              >
                Hủy
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReject(selectedTransaction?.id, rejectReason)}
                disabled={!rejectReason.trim()}
              >
                Từ chối
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsManagement;
