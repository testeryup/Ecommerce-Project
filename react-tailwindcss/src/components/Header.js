import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faShoppingCart, 
  faUser, 
  faBars, 
  faChevronDown,
  faSignOutAlt,
  faReceipt,
  faHeart,
  faHeadset,
  faTimes,
  faCog,
  faStore
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../features/auth/authSlice';
import { path } from '../ultils';
import { fetchUserProfile } from '../features/user/userSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  
  // Add safe selectors with default values
  const auth = useSelector(state => state.auth || {});
  const cart = useSelector(state => state.cart || {});
  const user = useSelector(state => state.user || {});
  
  const { isAuthenticated = false } = auth;
  const { items = [] } = cart;
  const { role } = user;
  
  // Debug: Log role value
  // console.log('Header Debug - Role:', role, 'User:', user, 'Auth:', auth);
  
  // Fallback: Check role from both sources
  const userRole = role || auth.user?.role;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search after submitting
      setShowSuggestions(false); // Hide suggestions
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Show suggestions when typing
    if (value.trim()) {
      // Mock search suggestions - in real app, you'd fetch from API
      const mockSuggestions = [
        'Key Windows 11 Pro',
        'Tài khoản Zoom Pro',
        'Spotify',
        'iQIYI',
        'iQIYI',
        'ChatGpt Plus',
        'Youtube Premium',
        'Netflix Premium',
        'Microsoft Office 2021'
      ].filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      
      setSearchSuggestions(mockSuggestions);
      setShowSuggestions(mockSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleForceFetchProfile = () => {
    dispatch(fetchUserProfile());
  };

  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      {/* Main Navigation - Apple Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200">
              <span className="text-2xl">🐙</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              Octopus Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Sản phẩm
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Giới thiệu
            </Link>
            <Link to="/support" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Hỗ trợ
            </Link>
          </nav>

          {/* Search Bar - Apple style */}
          <div className="hidden lg:flex items-center">
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch}>
                <div className={`flex items-center bg-gray-100 rounded-full transition-all duration-300 ${
                  isSearchFocused ? 'bg-white shadow-md ring-2 ring-blue-500/20' : 'hover:bg-gray-200'
                }`}>
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="w-4 h-4 text-gray-500 ml-4"
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      if (searchQuery.trim()) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      setIsSearchFocused(false);
                      // Delay hiding suggestions to allow click
                      setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    className="bg-transparent px-4 py-3 w-64 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="p-2 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                    >
                      <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{suggestion}</span>
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => handleSuggestionClick(searchQuery)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                    >
                      <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600 font-medium">
                        Tìm kiếm "{searchQuery}"
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:block font-medium">{user?.firstName}</span>
                  <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3" />
                        Thông tin cá nhân
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <FontAwesomeIcon icon={faReceipt} className="w-4 h-4 mr-3" />
                        Đơn hàng của tôi
                      </Link>
                      <Link to="/wishlist" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <FontAwesomeIcon icon={faHeart} className="w-4 h-4 mr-3" />
                        Yêu thích
                      </Link>
                      <Link to="/support" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <FontAwesomeIcon icon={faHeadset} className="w-4 h-4 mr-3" />
                        Hỗ trợ
                      </Link>
                      
                      {/* Admin Dashboard Link */}
                      {userRole === 'admin' && (
                        <Link to={path.ADMIN_DASHBOARD} className="flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors">
                          <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-3" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      {/* Seller Dashboard Link */}
                      {userRole === 'seller' && (
                        <Link to={path.SELLER_DASHBOARD} className="flex items-center px-4 py-3 text-green-600 hover:bg-green-50 transition-colors">
                          <FontAwesomeIcon icon={faStore} className="w-4 h-4 mr-3" />
                          Seller Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-100 rounded-full">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="w-4 h-4 text-gray-500 ml-4"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="bg-transparent px-4 py-3 w-full text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-2 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </button>
                )}
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                to="/products" 
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link 
                to="/about" 
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link 
                to="/support" 
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hỗ trợ
              </Link>
            </nav>

            {/* Mobile Auth */}
            {!isAuthenticated ? (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full text-center py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full text-center bg-black text-white py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link 
                  to="/profile" 
                  className="block w-full text-center py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>
                <Link 
                  to="/orders" 
                  className="block w-full text-center py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đơn hàng của tôi
                </Link>
                
                {/* Admin Dashboard Link - Mobile */}
                {userRole === 'admin' && (
                  <Link 
                    to={path.ADMIN_DASHBOARD} 
                    className="block w-full text-center py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                {/* Seller Dashboard Link - Mobile */}
                {userRole === 'seller' && (
                  <Link 
                    to={path.SELLER_DASHBOARD} 
                    className="block w-full text-center py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Seller Dashboard
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
