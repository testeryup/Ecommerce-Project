import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { logout } from '../../features/auth/authSlice';
import { path } from '../../ultils';
import './AdminHeader.scss';

const AdminHeader = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector(state => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(path.HOME);
  };



  return (
    <header className="admin-header">
      <div className="header-left">
        {/* Logo */}
        <div className="logo-section">
          <Link to="/dashboard/admin" className="logo">
            <span className="logo-icon">🐙</span>
            <span className="logo-text">OCTOPUS</span>
            <span className="admin-badge">Admin</span>
          </Link>
        </div>
      </div>

      <div className="header-right">

        {/* User Menu */}
        <div className="user-section">
          <button 
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <img 
                src={profile?.avatar || 'https://www.shutterstock.com/image-vector/man-inscription-admin-icon-outline-600nw-1730974153.jpg'} 
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
              <span className="user-name">{profile?.username || 'Admin'}</span>
              <span className="user-role">Quản trị viên</span>
            </div>
            <FontAwesomeIcon icon="ellipsis-v" className="dropdown-arrow" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
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
                    <FontAwesomeIcon icon="user" />
                  </div>
                </div>
                <div className="user-detail-info">
                  <h4>{profile?.username || 'Admin'}</h4>
                  <p>{profile?.email || 'admin@octopus.com'}</p>
                  <span className="role-badge">Quản trị viên</span>
                </div>
              </div>

              <div className="dropdown-menu">
                {/* <Link to="/admin/profile" className="menu-item">
                  <FontAwesomeIcon icon="user" />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                
                <Link to="/admin/settings" className="menu-item">
                  <FontAwesomeIcon icon="cog" />
                  <span>Cài đặt hệ thống</span>
                </Link>
                
                <Link to="/admin/security" className="menu-item">
                  <FontAwesomeIcon icon="shield-alt" />
                  <span>Bảo mật</span>
                </Link>
                
                <Link to="/admin/appearance" className="menu-item">
                  <FontAwesomeIcon icon="palette" />
                  <span>Giao diện</span>
                </Link> */}
                
                {/* <hr className="menu-divider" /> */}
              
                
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

export default AdminHeader;
