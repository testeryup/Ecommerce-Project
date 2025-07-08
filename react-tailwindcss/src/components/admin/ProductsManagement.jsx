import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
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
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { getAdminProducts, changeProductStatus, getProductStats } from '../../services/adminService';
import { formatCurrency } from '../../ultils';
import toast from 'react-hot-toast';

const ProductsManagement = () => {
  const [products, setProducts] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
    seller: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsResponse, statsResponse] = await Promise.all([
        getAdminProducts(filters),
        getProductStats()
      ]);

      if (productsResponse.errCode === 0) {
        setProducts(productsResponse.data);
      } else {
        toast.error('Không thể tải danh sách sản phẩm');
      }

      if (statsResponse.errCode === 0) {
        setStats(statsResponse.data);
      } else {
        toast.error('Không thể tải thống kê sản phẩm');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await changeProductStatus(productId, newStatus);
      if (response.errCode === 0) {
        toast.success('Cập nhật trạng thái thành công');
        fetchProducts();
      } else {
        toast.error(response.message || 'Không thể cập nhật trạng thái');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái');
    }
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-yellow-500';
      case 'deleted':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading || !products) {
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
          <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
          <p className="text-muted-foreground">
            Quản lý tất cả sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={fetchProducts} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.pagination?.totalItems || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.statusStats?.[0]?.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm ngưng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xóa</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Tạm ngưng</option>
                <option value="deleted">Đã xóa</option>
              </select>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
                className="px-3 py-2 border rounded-md"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Tên sản phẩm
                    {filters.sortBy === 'name' && (
                      filters.sortOrder === 'asc' ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    Giá
                    {filters.sortBy === 'price' && (
                      filters.sortOrder === 'asc' ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kho hàng</TableHead>
                <TableHead>Đã bán</TableHead>
                <TableHead>Người bán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.price || 0)}₫</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.totalSold}</TableCell>
                  <TableCell>{product.sellerInfo?.username}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status || 'active')}>
                      {product.status === 'active' ? 'Đang bán' :
                       product.status === 'inactive' ? 'Tạm ngưng' : 'Đã xóa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <select
                      value={product.status || 'active'}
                      onChange={(e) => handleStatusChange(product._id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="active">Đang bán</option>
                      <option value="inactive">Tạm ngưng</option>
                      <option value="deleted">Xóa</option>
                    </select>
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
            disabled={!products.pagination?.hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {products.pagination?.currentPage} / {products.pagination?.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('page', filters.page + 1)}
            disabled={!products.pagination?.hasNext}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;