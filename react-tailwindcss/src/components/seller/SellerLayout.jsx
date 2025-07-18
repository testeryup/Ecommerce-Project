import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
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
  HelpCircle,
  Home,
  Store
} from 'lucide-react';
import toast from 'react-hot-toast';

const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // Force light mode for seller panel
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  const handleViewShop = () => {
    navigate('/');
  };

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
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-full flex-col">
            {/* Sidebar Header with Logo */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Link to="/dashboard/seller" className="flex items-center space-x-3 group hover:opacity-90 transition-opacity">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                    Seller Center
                  </div>
                  <div className="text-xs text-blue-600 font-medium -mt-1">
                    Trung tâm bán hàng
                  </div>
                </div>
              </Link>
              
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden hover:bg-gray-100"
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
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.firstName || 'Seller'} />
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {user?.firstName?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Seller Account'}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Seller</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          {/* Mobile Menu Button */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
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
