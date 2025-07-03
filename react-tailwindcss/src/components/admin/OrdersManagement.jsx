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
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Package, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react';
import { getAdminOrders, updateOrderStatus } from '../../services/adminService';
import { formatCurrency } from '../../ultils';
import toast from 'react-hot-toast';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAdminOrders({
        page: currentPage,
        limit: pageSize,
        status: statusFilter === 'all' ? '' : statusFilter,
        search: searchTerm
      });

      if (response.errCode === 0) {
        setOrders(response.data?.orders || []);
        setTotalOrders(response.data?.total || 0);
      } else {
        toast.error('Không thể tải danh sách đơn hàng');
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách đơn hàng');
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, statusFilter]);

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchOrders();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
    shipped: { label: 'Đã gửi', color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const paymentMethodConfig = {
    credit_card: 'Thẻ tín dụng',
    bank_transfer: 'Chuyển khoản',
    cod: 'COD',
    e_wallet: 'Ví điện tử'
  };

  const shippingMethodConfig = {
    standard: 'Tiêu chuẩn',
    express: 'Nhanh',
    same_day: 'Trong ngày'
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.errCode === 0) {
        toast.success('Cập nhật trạng thái đơn hàng thành công');
        fetchOrders(); // Refresh the orders list
      } else {
        toast.error(response.errMessage || 'Không thể cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusIcon = (status) => {
    const config = statusConfig[status];
    const Icon = config?.icon || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const totalPages = Math.ceil(totalOrders / pageSize);

  if (loading) {
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
          <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả đơn hàng
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Tạo đơn hàng mới
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý ({orders.filter(o => o.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý ({orders.filter(o => o.status === 'processing').length})</TabsTrigger>
          <TabsTrigger value="shipped">Đã gửi ({orders.filter(o => o.status === 'shipped').length})</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao ({orders.filter(o => o.status === 'delivered').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đơn hàng</CardTitle>
              <CardDescription>
                Tổng cộng {totalOrders} đơn hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Tất cả trạng thái</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                <Button
                  onClick={fetchOrders}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Làm mới
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead className="w-[100px]">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Đang tải...
                            </div>
                          ) : (
                            'Không có đơn hàng nào'
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id || order.orderId}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customerName || order.user?.username}</div>
                              <div className="text-sm text-muted-foreground">{order.customerEmail || order.user?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(order.orderDate || order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${statusConfig[order.status]?.color} flex items-center gap-1`}
                            >
                              {getStatusIcon(order.status)}
                              {statusConfig[order.status]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(order.total || order.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {paymentMethodConfig[order.paymentMethod] || order.paymentMethod}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id || order.orderId, 'processing')}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Xử lý
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id || order.orderId, 'shipped')}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Gửi hàng
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id || order.orderId, 'delivered')}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Hoàn thành
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} (Tổng: {totalOrders} đơn hàng)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Các tab khác sẽ hiển thị đơn hàng theo trạng thái */}
        {Object.keys(statusConfig).map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  Đơn hàng {statusConfig[status].label}
                </CardTitle>
                <CardDescription>
                  {orders.filter(o => o.status === status).length} đơn hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Hiển thị danh sách đơn hàng theo trạng thái: {statusConfig[status].label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Detail Dialog */}
      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng và khách hàng
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Thông tin khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOrder.customerName || selectedOrder.user?.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOrder.customerEmail || selectedOrder.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOrder.customerPhone || selectedOrder.user?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOrder.customerAddress || selectedOrder.shippingAddress || 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Thông tin đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ngày đặt: {new Date(selectedOrder.orderDate || selectedOrder.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span>Trạng thái: {statusConfig[selectedOrder.status]?.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Thanh toán: {paymentMethodConfig[selectedOrder.paymentMethod] || selectedOrder.paymentMethod || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>Giao hàng: {shippingMethodConfig[selectedOrder.shippingMethod] || selectedOrder.shippingMethod || 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm đã đặt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(selectedOrder.items || selectedOrder.orderItems || []).map((item, index) => (
                      <div key={item.id || index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{item.name || item.product?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.price || item.unitPrice)}</div>
                          <div className="text-sm text-muted-foreground">
                            Thành tiền: {formatCurrency((item.price || item.unitPrice) * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(selectedOrder.total || selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(selectedOrder.notes || selectedOrder.description) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ghi chú</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedOrder.notes || selectedOrder.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
