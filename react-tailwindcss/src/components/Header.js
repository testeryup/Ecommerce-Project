import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faShoppingCart, 
  faUser, 
  faBars, 
  faHome,
  faStore,
  faGamepad,
  faDownload,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../features/auth/authSlice';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add safe selectors with default values
  const auth = useSelector(state => state.auth || {});
  const cart = useSelector(state => state.cart || {});
  
  const { user, isAuthenticated = false } = auth;
  const { items = [] } = cart;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300">
      {/* Top Navigation - Clean White Design */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium flex items-center space-x-2">
                <span className="text-lg">🐙</span>
                <span>OCTOPUS Store</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/subscriptions" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                  Gói dịch vụ
                </Link>
                <Link to="/apps" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                  Ứng dụng
                </Link>
                <Link to="/support" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                  Hỗ trợ
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Xin chào, {user?.firstName}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 font-medium text-sm"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    Đăng nhập
                  </Link>
                  <Link to="/signup" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Modern Clean Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Enhanced */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <span className="text-white text-lg font-bold">🐙</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">OCTOPUS</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Digital Store</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Enhanced Clean Design */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, dịch vụ..."
                  className="w-full px-6 py-4 pl-14 pr-24 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 text-lg shadow-sm hover:shadow-md"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg active:scale-95"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>

          {/* Right Menu - Clean Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* Cart - Enhanced */}
            <Link 
              to="/cart" 
              className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="text-xl group-hover:scale-110 transition-transform duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold animate-pulse shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Link 
                  to="/profile"
                  className="flex items-center space-x-2 p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl group-hover:scale-110 transition-transform duration-200" />
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Clean White Design */}
      <nav className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              >
                <FontAwesomeIcon icon={faHome} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Trang chủ</span>
              </Link>
              <Link 
                to="/products" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              >
                <FontAwesomeIcon icon={faStore} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Sản phẩm</span>
              </Link>
              <Link 
                to="/entertainment" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              >
                <FontAwesomeIcon icon={faGamepad} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Giải trí</span>
              </Link>
              <Link 
                to="/productivity" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              >
                <FontAwesomeIcon icon={faDownload} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Năng suất</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              >
                <FontAwesomeIcon icon={faHeart} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Về chúng tôi</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/support" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                Hỗ trợ
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/download" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                Tải xuống
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Clean Design */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg transition-colors duration-300">
          <div className="px-4 py-4 space-y-2">
            <Link 
              to="/" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faHome} className="text-sm" />
              <span className="font-medium">Trang chủ</span>
            </Link>
            <Link 
              to="/products" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faStore} className="text-sm" />
              <span className="font-medium">Sản phẩm</span>
            </Link>
            <Link 
              to="/entertainment" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faGamepad} className="text-sm" />
              <span className="font-medium">Giải trí</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faHeart} className="text-sm" />
              <span className="font-medium">Về chúng tôi</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
