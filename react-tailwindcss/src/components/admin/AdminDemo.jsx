import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Shield, Users, Package, CreditCard, BarChart3, Settings } from 'lucide-react';

const AdminDemo = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Tổng quan',
      description: 'Thống kê tổng quan với biểu đồ thời gian thực, metrics hiệu suất và báo cáo chi tiết.',
      path: '/admin/dashboard',
      color: 'bg-blue-500',
      status: 'Hoàn thành'
    },
    {
      icon: Users,
      title: 'Quản lý Người dùng',
      description: 'Quản lý người dùng, phân quyền, thay đổi trạng thái và chỉnh sửa thông tin.',
      path: '/admin/users',
      color: 'bg-green-500',
      status: 'Hoàn thành'
    },
    {
      icon: Package,
      title: 'Quản lý Sản phẩm',
      description: 'Theo dõi kho hàng, cập nhật trạng thái sản phẩm và quản lý danh mục.',
      path: '/admin/products',
      color: 'bg-purple-500',
      status: 'Hoàn thành'
    },
    {
      icon: CreditCard,
      title: 'Quản lý Giao dịch',
      description: 'Xử lý các giao dịch nạp/rút tiền, hoàn tiền với phê duyệt tự động.',
      path: '/admin/transactions',
      color: 'bg-orange-500',
      status: 'Hoàn thành'
    },
    {
      icon: BarChart3,
      title: 'Quản lý Đơn hàng',
      description: 'Theo dõi đơn hàng, cập nhật trạng thái giao hàng và xử lý khiếu nại.',
      path: '/admin/orders',
      color: 'bg-red-500',
      status: 'Đang phát triển'
    },
    {
      icon: Settings,
      title: 'Báo cáo & Cài đặt',
      description: 'Báo cáo chi tiết, cấu hình hệ thống và quản lý cài đặt tổng quát.',
      path: '/admin/reports',
      color: 'bg-gray-500',
      status: 'Đang phát triển'
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'Hoàn thành') {
      return <Badge className="bg-green-100 text-green-800">✅ {status}</Badge>;
    }
    return <Badge variant="secondary">🚧 {status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Giao diện Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thiết kế mới với <span className="font-semibold text-blue-600">Shadcn/UI</span> - 
            Giao diện hiện đại, responsive và thân thiện với người dùng
          </p>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <Badge className="bg-blue-100 text-blue-800">✨ Modern Design</Badge>
            <Badge className="bg-green-100 text-green-800">📱 Responsive</Badge>
            <Badge className="bg-purple-100 text-purple-800">🎨 Shadcn/UI</Badge>
            <Badge className="bg-orange-100 text-orange-800">⚡ Fast Performance</Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isComplete = feature.status === 'Hoàn thành';
            
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`absolute top-0 left-0 w-full h-1 ${feature.color}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                      <Icon className={`h-6 w-6 text-white`} style={{ color: feature.color.replace('bg-', '').replace('-500', '') }} />
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  {isComplete ? (
                    <Link to={feature.path}>
                      <Button className="w-full group-hover:bg-blue-700 transition-colors">
                        Xem Demo
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Sắp ra mắt
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Features */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">✨ Tính năng nổi bật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold mb-2">Modern UI</h3>
                <p className="text-sm text-gray-600">Thiết kế hiện đại với Shadcn/UI components</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Real-time Charts</h3>
                <p className="text-sm text-gray-600">Biểu đồ thời gian thực với Recharts</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold mb-2">Responsive</h3>
                <p className="text-sm text-gray-600">Tối ưu cho mọi thiết bị và kích thước màn hình</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Fast Performance</h3>
                <p className="text-sm text-gray-600">Hiệu suất cao với React 19 và Tailwind CSS</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🚀 Truy cập nhanh</CardTitle>
            <CardDescription className="text-center">
              Chọn tính năng để xem demo ngay bây giờ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/admin/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  📊 Dashboard
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button className="bg-green-600 hover:bg-green-700">
                  👥 Người dùng
                </Button>
              </Link>
              <Link to="/admin/products">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  📦 Sản phẩm
                </Button>
              </Link>
              <Link to="/admin/transactions">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  💳 Giao dịch
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Phiên bản Demo - Giao diện Admin Dashboard với Shadcn/UI</p>
          <p className="text-sm mt-2">Thiết kế và phát triển bởi Team Development</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDemo;
