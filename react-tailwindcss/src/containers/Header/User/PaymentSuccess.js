import { path } from "../../../ultils";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome, faReceipt, faBell } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../../components/Layout';

const PaymentSuccess = () => {
    const [url, setUrl] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if both location.state and location.state.detail exist
        if (!location.state || !location.state.detail) {
            navigate(path.HOME);
            return;
        }
        setUrl(`/orders/${location.state.detail.orderId}`);
    }, [location, navigate]);

    const handleViewOrder = () => {
        navigate(url);
    }

    const hasSubscriptionItems = location.state?.detail?.orderItems?.some(item => 
        item.sku?.subscriptionInfo
    );

    if (!location.state || !location.state.detail) {
        return null;
    }
    
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-3xl" />
                        </div>
                        
                        {/* Success Title */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Thanh toán thành công!
                        </h1>
                        
                        {/* Success Message */}
                        <p className="text-gray-600 mb-6">
                            Đơn hàng của bạn đã được xử lý thành công. Cảm ơn bạn đã tin tưởng và ủng hộ chúng tôi!
                        </p>
                        
                        {/* Subscription Info */}
                        {hasSubscriptionItems && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-center mb-2">
                                    <FontAwesomeIcon icon={faBell} className="text-blue-500 mr-2" />
                                    <span className="text-blue-700 font-semibold">Thông tin Subscription</span>
                                </div>
                                <p className="text-blue-600 text-sm">
                                    Bạn đã mua các tài khoản subscription. Vui lòng kiểm tra thông tin chi tiết 
                                    trong đơn hàng và quản lý subscription của bạn.
                                </p>
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleViewOrder}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faReceipt} className="mr-2" />
                                Xem thông tin đơn hàng
                            </button>
                            
                            {hasSubscriptionItems && (
                                <Link 
                                    to="/user/subscriptions"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faBell} className="mr-2" />
                                    Quản lý Subscriptions
                                </Link>
                            )}
                            
                            <Link
                                to={path.HOME}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faHome} className="mr-2" />
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PaymentSuccess

