import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../features/auth/authSlice';
import { path } from '../../ultils';
import { formatCurrency } from '../../ultils';
import './SellerHeader.scss';

const SellerHeader = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector(state => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(path.HOME);
  };

  return (
    <header className="seller-header">
      <div className="header-left">
        {/* Sidebar Toggle */}
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <FontAwesomeIcon icon={isSidebarCollapsed ? 'bars' : 'times'} />
        </button>

        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo">
            <span className="logo-icon">🐙</span>
            <span className="logo-text">OCTOPUS</span>
            <span className="seller-badge">Seller</span>
          </Link>
        </div>
      </div>

      <div className="header-right">
        {/* Balance Display */}
        <div className="balance-section">
          <div className="balance-info">
            <span className="balance-label">Số dư:</span>
            <span className="balance-amount">
              {profile?.balance >= 0 ? formatCurrency(profile.balance) : 'N/A'}
            </span>
          </div>
          <div className="balance-icon">
            <FontAwesomeIcon icon="wallet" />
          </div>
        </div>

        {/* User Menu */}
        <div className="user-section">
          <button 
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <img 
                src={profile?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEuWMibOckGDkh0VJYrJvkLEK-dxu3uusnfA&s'} 
                alt="Avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="avatar-fallback">
                <FontAwesomeIcon icon="user" />
              </div>
            </div>
            <div className="user-info">
              <span className="user-name">{profile?.username || 'Seller'}</span>
              <span className="user-role">Người bán</span>
            </div>
            <FontAwesomeIcon icon="ellipsis-v" className="dropdown-arrow" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-detail">
                <div className="user-avatar-large">
                  <img 
                    src={profile?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEuWMibOckGDkh0VJYrJvkLEK-dxu3uusnfA&s'} 
                    alt="Avatar"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="avatar-fallback">
                    <FontAwesomeIcon icon="user" />
                  </div>
                </div>
                <div className="user-detail-info">
                  <h4>{profile?.username || 'Seller'}</h4>
                  <p>{profile?.email || 'seller@octopus.com'}</p>
                  <span className="role-badge">Người bán</span>
                </div>
              </div>

              <div className="dropdown-menu">
                <Link to="/seller/profile" className="menu-item">
                  <FontAwesomeIcon icon="user" />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                
                <Link to="/seller/settings" className="menu-item">
                  <FontAwesomeIcon icon="cog" />
                  <span>Cài đặt cửa hàng</span>
                </Link>
                
                <Link to="/support" className="menu-item">
                  <FontAwesomeIcon icon="headset" />
                  <span>Trung tâm hỗ trợ</span>
                </Link>
                
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  <FontAwesomeIcon icon="sign-out-alt" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {showUserMenu && (
        <div 
          className="dropdown-overlay"
          onClick={() => {
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default SellerHeader; 