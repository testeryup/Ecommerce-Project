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
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                🐙 OCTOPUS Store
              </Link>
              <Link to="/subscriptions" className="hover:text-blue-200 transition-colors duration-200">
                Subscriptions
              </Link>
              <Link to="/apps" className="hover:text-blue-200 transition-colors duration-200">
                Apps
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-blue-100">Xin chào, {user?.firstName}</span>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-blue-200 transition-colors duration-200 font-medium"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-200 transition-colors duration-200">
                    Đăng nhập
                  </Link>
                  <Link to="/signup" className="hover:text-blue-200 transition-colors duration-200">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <FontAwesomeIcon icon={faStore} className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">🐙 OCTOPUS</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm Netflix, Spotify, Office và nhiều hơn nữa..."
                className="w-full px-4 py-3 pl-12 pr-20 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
              >
                Tìm
              </button>
            </form>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="text-xl group-hover:scale-110 transition-transform duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-subtle">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group">
                  <FontAwesomeIcon icon={faUser} className="text-xl group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
              >
                <FontAwesomeIcon icon={faHome} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Trang chủ</span>
              </Link>
              <Link 
                to="/entertainment" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
              >
                <FontAwesomeIcon icon={faGamepad} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Giải trí</span>
              </Link>
              <Link 
                to="/productivity" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
              >
                <FontAwesomeIcon icon={faDownload} className="text-sm group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Năng suất</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={faHeart} className="text-sm" />
                <span>Giải trí</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <span>Hỗ trợ khách hàng</span>
              <span>|</span>
              <span>Tải xuống</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link 
              to="/games" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Trò chơi
            </Link>
            <Link 
              to="/apps" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Ứng dụng
            </Link>
            <Link 
              to="/entertainment" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Giải trí
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
