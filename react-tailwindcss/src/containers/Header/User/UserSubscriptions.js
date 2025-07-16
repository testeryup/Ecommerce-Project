import { useState, useEffect } from 'react';
import subscriptionService from '../../../services/subscriptionService';
import toast from 'react-hot-toast';

export default function UserSubscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchUserSubscriptions();
        fetchNotifications();
    }, []);

    const fetchUserSubscriptions = async () => {
        try {
            const result = await subscriptionService.getUserSubscriptions();
            if (result.data.errCode === 0) {
                setSubscriptions(result.data.data);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            toast.error('Lỗi khi tải danh sách subscription');
        } finally {
            setLoading(false);
        }
    };

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
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysRemaining = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusBadge = (subscription) => {
        const daysRemaining = getDaysRemaining(subscription.endDate);
        
        if (!subscription.isActive) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Hết hạn</span>;
        } else if (daysRemaining <= 3) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Sắp hết hạn</span>;
        } else if (daysRemaining <= 7) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Cảnh báo</span>;
        } else {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Hoạt động</span>;
        }
    };

    const handleRenewSubscription = async (accountId) => {
        // Redirect to renewal page or show renewal modal
        toast.info('Chức năng gia hạn sẽ được triển khai trong phiên bản tiếp theo');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Subscription của tôi</h1>
                <p className="mt-2 text-gray-600">Quản lý các tài khoản subscription bạn đã mua</p>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="mb-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="material-symbols-outlined text-yellow-400">warning</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Thông báo quan trọng
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        {notifications.map((notification, index) => (
                                            <li key={index}>{notification.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscriptions List */}
            {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-gray-400 text-6xl">inbox</span>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có subscription nào</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Bạn chưa mua subscription nào. Hãy khám phá cửa hàng để tìm sản phẩm phù hợp.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => window.location.href = '/products'}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <span className="material-symbols-outlined mr-2">shopping_cart</span>
                            Khám phá sản phẩm
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {subscriptions.map((subscription) => (
                        <div key={subscription._id} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="material-symbols-outlined text-blue-500">account_circle</span>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {subscription.productName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {subscription.skuName}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(subscription)}
                                </div>

                                <div className="mt-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Tài khoản</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <div className="font-mono bg-gray-50 p-2 rounded">
                                                    <div><strong>Username:</strong> {subscription.credentials.username}</div>
                                                    <div><strong>Password:</strong> {subscription.credentials.password}</div>
                                                    {subscription.credentials.email && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Email: {subscription.credentials.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Thời hạn</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <div>Bắt đầu: {formatDate(subscription.startDate)}</div>
                                                <div>Kết thúc: {formatDate(subscription.endDate)}</div>
                                                {subscription.isActive && (
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        Còn lại: {getDaysRemaining(subscription.endDate)} ngày
                                                    </div>
                                                )}
                                            </dd>
                                        </div>

                                        {subscription.usage && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Sử dụng</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <div>Thời gian: {subscription.usage.duration} ngày</div>
                                                    <div>Reset: {subscription.usage.resetCount} lần</div>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                <div className="mt-6 flex space-x-3">
                                    {subscription.isActive && getDaysRemaining(subscription.endDate) <= 7 && (
                                        <button
                                            onClick={() => handleRenewSubscription(subscription._id)}
                                            className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <span className="material-symbols-outlined mr-1 text-sm">schedule</span>
                                            Gia hạn
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `Username: ${subscription.credentials.username}\\nPassword: ${subscription.credentials.password}`
                                            );
                                            toast.success('Đã copy thông tin tài khoản');
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        <span className="material-symbols-outlined mr-1 text-sm">content_copy</span>
                                        Copy
                                    </button>
                                </div>

                                {subscription.notes && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                        <p className="text-xs text-blue-800">
                                            <strong>Ghi chú:</strong> {subscription.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tips Section */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4">
                    💡 Mẹo sử dụng Subscription
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Thay đổi mật khẩu ngay sau khi nhận tài khoản để bảo mật</li>
                    <li>• Không chia sẻ thông tin tài khoản với người khác</li>
                    <li>• Gia hạn trước khi hết hạn để tránh gián đoạn dịch vụ</li>
                    <li>• Liên hệ hỗ trợ nếu gặp vấn đề với tài khoản</li>
                </ul>
            </div>
        </div>
    );
}
