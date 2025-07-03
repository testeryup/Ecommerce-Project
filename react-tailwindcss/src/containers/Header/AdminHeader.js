import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faSearch, 
  faBell, 
  faUser, 
  faSignOutAlt, 
  faCog, 
  faHome,
  faChartLine,
  faUsers,
  faBox,
  faMoneyBillWave,
  faFlag,
  faShieldAlt,
  faQuestionCircle,
  faEllipsisV,
  faPalette,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../features/auth/authSlice';
import { path } from '../../ultils';
import './AdminHeader.css';

const AdminHeader = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector(state => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'user', message: 'Người dùng mới đăng ký', time: '5 phút trước', unread: true },
    { id: 2, type: 'order', message: 'Đơn hàng mới được tạo', time: '10 phút trước', unread: true },
    { id: 3, type: 'system', message: 'Cập nhật hệ thống hoàn tất', time: '1 giờ trước', unread: false },
    { id: 4, type: 'revenue', message: 'Doanh thu tháng đạt mục tiêu', time: '2 giờ trước', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(path.HOME);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        {/* Sidebar Toggle */}
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <FontAwesomeIcon icon={isSidebarCollapsed ? faBars : faTimes} />
        </button>

        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo">
            <span className="logo-icon">🐙</span>
            <span className="logo-text">OCTOPUS</span>
            <span className="admin-badge">Admin</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng, sản phẩm, đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-btn" title="Trang chủ">
            <Link to="/">
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </button>
          
          <button 
            className="action-btn theme-toggle" 
            onClick={handleToggleDarkMode}
            title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>
        </div>

        {/* Notifications */}
        <div className="notifications-section">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Thông báo"
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h3>Thông báo</h3>
                <button className="mark-all-read">Đánh dấu đã đọc</button>
              </div>
              
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-icon">
                      <FontAwesomeIcon 
                        icon={
                          notification.type === 'user' ? faUsers :
                          notification.type === 'order' ? faBox :
                          notification.type === 'system' ? faCog :
                          faChartLine
                        } 
                      />
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {notification.unread && <div className="unread-indicator"></div>}
                  </div>
                ))}
              </div>
              
              <div className="dropdown-footer">
                <Link to="/admin/notifications" className="view-all-link">
                  Xem tất cả thông báo
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-section">
          <button 
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <img 
                src={profile?.avatar || '/default-avatar.png'} 
                alt="Avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="avatar-fallback">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
            <div className="user-info">
              <span className="user-name">{profile?.username || 'Admin'}</span>
              <span className="user-role">Quản trị viên</span>
            </div>
            <FontAwesomeIcon icon={faEllipsisV} className="dropdown-arrow" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-detail">
                  <div className="user-avatar-large">
                    <img 
                      src={profile?.avatar || '/default-avatar.png'} 
                      alt="Avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="avatar-fallback">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </div>
                  <div className="user-detail-info">
                    <h4>{profile?.username || 'Admin'}</h4>
                    <p>{profile?.email || 'admin@octopus.com'}</p>
                    <span className="role-badge">Quản trị viên</span>
                  </div>
                </div>
              </div>

              <div className="dropdown-menu">
                <Link to="/admin/profile" className="menu-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                
                <Link to="/admin/settings" className="menu-item">
                  <FontAwesomeIcon icon={faCog} />
                  <span>Cài đặt hệ thống</span>
                </Link>
                
                <Link to="/admin/security" className="menu-item">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>Bảo mật</span>
                </Link>
                
                <Link to="/admin/appearance" className="menu-item">
                  <FontAwesomeIcon icon={faPalette} />
                  <span>Giao diện</span>
                </Link>
                
                <hr className="menu-divider" />
                
                <Link to="/admin/help" className="menu-item">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                  <span>Trợ giúp</span>
                </Link>
                
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="dropdown-overlay"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default AdminHeader;
