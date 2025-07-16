import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faExclamationTriangle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import subscriptionService from '../services/subscriptionService';

export default function SubscriptionNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { profile } = useSelector(state => state.user);

    useEffect(() => {
        if (profile && profile.role === 'user') {
            fetchNotifications();
            // Set up periodic check for notifications
            const interval = setInterval(fetchNotifications, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [profile]);

    const fetchNotifications = async () => {
        try {
            const result = await subscriptionService.getExpiringNotifications();
            if (result.data.errCode === 0) {
                setNotifications(result.data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getDaysRemaining = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (!profile || profile.role !== 'user' || notifications.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors duration-200"
            >
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Thông báo Subscription
                        </h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification, index) => {
                            const daysRemaining = getDaysRemaining(notification.endDate);
                            const isUrgent = daysRemaining <= 1;
                            
                            return (
                                <div 
                                    key={notification._id || index}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                        isUrgent ? 'bg-red-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 mt-1 ${
                                            isUrgent ? 'text-red-500' : 'text-yellow-500'
                                        }`}>
                                            <FontAwesomeIcon 
                                                icon={isUrgent ? faExclamationCircle : faExclamationTriangle} 
                                                className="text-sm"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {notification.productName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {notification.skuName}
                                            </p>
                                            <p className={`text-xs mt-1 ${
                                                isUrgent ? 'text-red-600' : 'text-yellow-600'
                                            }`}>
                                                {daysRemaining <= 0 
                                                    ? 'Đã hết hạn' 
                                                    : daysRemaining === 1 
                                                    ? 'Hết hạn trong 1 ngày'
                                                    : `Hết hạn trong ${daysRemaining} ngày`
                                                }
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Ngày hết hạn: {formatDate(notification.endDate)}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    // Navigate to subscription management
                                                    window.location.href = '/user/subscriptions';
                                                }}
                                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                            >
                                                Gia hạn
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="p-3 border-t border-gray-200">
                        <button
                            onClick={() => {
                                window.location.href = '/user/subscriptions';
                                setShowNotifications(false);
                            }}
                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            Xem tất cả subscription
                        </button>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {showNotifications && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                />
            )}
        </div>
    );
}
