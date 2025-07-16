import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Menu, 
  X, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Gift, 
  CreditCard, 
  Bell, 
  Search,
  ChevronDown,
  User,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';

const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Force light mode for seller panel
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const menuItems = [
    { 
      icon: BarChart3, 
      label: 'Tổng quan', 
      path: '/dashboard/seller/monitor',
      description: 'Thống kê doanh thu'
    },
    { 
      icon: Package, 
      label: 'Quản lý gian hàng', 
      path: '/dashboard/seller/products',
      description: 'Sản phẩm của bạn'
    },
    { 
      icon: ShoppingCart, 
      label: 'Đơn hàng', 
      path: '/dashboard/seller/orders',
      description: 'Quản lý đơn hàng'
    },
    { 
      icon: MessageSquare, 
      label: 'Tin nhắn', 
      path: '/dashboard/seller/messages',
      description: 'Chat với khách hàng'
    },
    { 
      icon: Gift, 
      label: 'Khuyến mãi', 
      path: '/dashboard/seller/coupons',
      description: 'Mã giảm giá'
    },
    { 
      icon: CreditCard, 
      label: 'Thanh toán', 
      path: '/dashboard/seller/payments',
      description: 'Quản lý thu nhập'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <Link to="/dashboard/seller" className="flex items-center space-x-3 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <Package className="h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <div className="font-semibold text-lg text-gray-900">Seller Center</div>
                </div>
              </Link>
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tìm kiếm sản phẩm, đơn hàng..."
                  type="search"
                />
              </div>
            </div>

            {/* Right Section - Actions & User */}
            <div className="flex items-center space-x-3">
              {/* Quick Stats (Mobile Hidden) */}
              <div className="hidden xl:flex items-center space-x-3 mr-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Doanh thu</div>
                  <div className="text-sm font-semibold text-blue-600">₫2.5M</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Đơn mới</div>
                  <div className="text-sm font-semibold text-green-600">12</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Sản phẩm</div>
                  <div className="text-sm font-semibold text-gray-900">156</div>
                </div>
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-red-500 text-white">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-64 overflow-y-auto">
                    <DropdownMenuItem className="flex items-start space-x-3 p-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Đơn hàng mới #12345</p>
                        <p className="text-xs text-gray-500">Khách hàng vừa đặt mua sản phẩm</p>
                        <p className="text-xs text-gray-400">5 phút trước</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start space-x-3 p-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Thanh toán thành công</p>
                        <p className="text-xs text-gray-500">₫250,000 đã được chuyển</p>
                        <p className="text-xs text-gray-400">1 giờ trước</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-blue-600">
                    Xem tất cả
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Seller" />
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        SC
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium">Cửa hàng ABC</div>
                      <div className="text-xs text-gray-500">Pro Seller</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white">SC</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Cửa hàng ABC</div>
                        <div className="text-xs text-gray-500">seller123@example.com</div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ cửa hàng
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Thu nhập
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Trợ giúp
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-full flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 lg:hidden border-b border-gray-200">            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Package className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">Seller Center</span>
            </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "group flex items-center space-x-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-gray-100 group-hover:bg-blue-100"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-medium",
                        isActive ? "text-white" : "text-gray-900 group-hover:text-blue-600"
                      )}>
                        {item.label}
                      </div>
                      <div className={cn(
                        "text-xs mt-0.5 truncate",
                        isActive ? "text-white/80" : "text-gray-500 group-hover:text-blue-500"
                      )}>
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-1 h-8 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Seller" />
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">Cửa hàng ABC</div>
                  <div className="text-xs text-gray-500 truncate">Pro Seller</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerLayout;
