import React, { useState } from 'react';
import SellerHeader from '../Header/SellerHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SellerDashboard.scss';
import Menu from '../Seller';



export default function SellerDashboard() {
    const [selectedMenu, setSelectedMenu] = useState('monitor');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems = [
        { id: 'monitor', label: 'Tổng quan', icon: 'chart-line', component: Menu.SellerMonitor },
        { id: 'products', label: 'Quản lý gian hàng', icon: 'box', component: Menu.SellerProducts },
        { id: 'orders', label: 'Đơn hàng', icon: 'shopping-bag', component: Menu.SellerOrders },
        // { id: 'message', label: 'Tin nhắn', icon: 'envelope', component: Menu.SellerMessage },
        // { id: 'coupon', label: 'Khuyến mãi', icon: 'gift', component: Menu.SellerCoupon },
        { id: 'payment', label: 'Thanh toán', icon: 'credit-card', component: Menu.SellerPayment }
    ];

    const handleMenuClick = (menuId) => {
        setSelectedMenu(menuId);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const SelectedComponent = menuItems.find(item => item.id === selectedMenu)?.component || Menu.SellerMonitor;

    return (
        <div className="seller-dashboard">
            <SellerHeader onToggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
            <div className="dashboard-container">
                <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-header">
                        <h2>{isSidebarCollapsed ? 'S' : 'Người bán hàng'}</h2>
                        <button className="toggle-btn" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={isSidebarCollapsed ? 'angle-right' : 'angle-left'} />
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
                    <React.Suspense fallback={<div className="loading">Loading...</div>}>
                        <SelectedComponent />
                    </React.Suspense>
                </main>
            </div>
        </div>
    );
}