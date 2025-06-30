import React, { useState } from 'react';
import AdminHeader from '../Header/AdminHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine,
    faUsers,
    faBox,
    faMoneyBillWave,
    faFlag,
    faCog,
    faAngleLeft,
    faAngleRight
} from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.scss';

const AdminMenu = {
    Overview: React.lazy(() => import('../Admin/Overview')),
    Users: React.lazy(() => import('../Admin/Users')),
    Products: React.lazy(() => import('../Admin/Products')),
    Transactions: React.lazy(() => import('../Admin/Transactions')),
    Reports: React.lazy(() => import('../Admin/Reports')),
    Settings: React.lazy(() => import('../Admin/Settings'))
};

export default function AdminDashboard() {
    const [selectedMenu, setSelectedMenu] = useState('overview');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems = [
        { id: 'overview', label: 'Tổng quan', icon: faChartLine },
        { id: 'users', label: 'Người dùng', icon: faUsers },
        { id: 'products', label: 'Sản phẩm', icon: faBox },
        { id: 'transactions', label: 'Giao dịch', icon: faMoneyBillWave },
        { id: 'reports', label: 'Báo cáo', icon: faFlag },
        { id: 'settings', label: 'Cài đặt', icon: faCog }
    ];

    const handleMenuClick = (menuId) => {
        setSelectedMenu(menuId);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const SelectedComponent = AdminMenu[selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)] || AdminMenu.Overview;

    return (
        <div className="admin-dashboard">
            <AdminHeader 
                onToggleSidebar={toggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
            />
            <div className="dashboard-container">
                <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-header">
                        <h2>{isSidebarCollapsed ? 'A' : 'Admin Panel'}</h2>
                        <button className="toggle-btn" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={isSidebarCollapsed ? faAngleRight : faAngleLeft} />
                        </button>
                    </div>
                    <nav className="sidebar-nav">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${selectedMenu === item.id ? 'active' : ''}`}
                                onClick={() => handleMenuClick(item.id)}
                            >
                                <FontAwesomeIcon icon={item.icon} />
                                {!isSidebarCollapsed && <span>{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="dashboard-main">
                    <React.Suspense fallback={
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Đang tải...</p>
                        </div>
                    }>
                        <SelectedComponent />
                    </React.Suspense>
                </main>
            </div>
        </div>
    );
}