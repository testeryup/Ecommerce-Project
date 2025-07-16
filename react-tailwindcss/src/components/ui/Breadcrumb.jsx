import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumb items based on current path if not provided
  const generateBreadcrumbItems = () => {
    if (items.length > 0) return items;
    
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbItems = [
      { label: 'Trang chủ', href: '/', icon: Home }
    ];
    
    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      let label = name;
      // Convert common paths to Vietnamese
      switch (name) {
        case 'profile':
          label = 'Thông tin cá nhân';
          break;
        case 'orders':
          label = 'Đơn hàng của tôi';
          break;
        case 'products':
          label = 'Sản phẩm';
          break;
        case 'cart':
          label = 'Giỏ hàng';
          break;
        case 'checkout':
          label = 'Thanh toán';
          break;
        default:
          label = name.charAt(0).toUpperCase() + name.slice(1);
      }
      
      breadcrumbItems.push({
        label,
        href: currentPath,
        isLast: index === pathnames.length - 1
      });
    });
    
    return breadcrumbItems;
  };
  
  const breadcrumbItems = generateBreadcrumbItems();
  
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {item.isLast ? (
            <span className="text-gray-900 font-medium">
              {item.icon && <item.icon className="h-4 w-4 inline mr-1" />}
              {item.label}
            </span>
          ) : (
            <Link 
              to={item.href} 
              className="hover:text-gray-900 transition-colors flex items-center"
            >
              {item.icon && <item.icon className="h-4 w-4 mr-1" />}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
