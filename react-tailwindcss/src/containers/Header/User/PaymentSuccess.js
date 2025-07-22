import { path } from "../../../ultils";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatCurrency } from '../../../ultils';
import Layout from '../../../components/Layout';
import Button from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/badge";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { CheckCircle, ArrowRight, Package, Eye, Home, ShoppingBag, Clock, CreditCard, User, Calendar } from 'lucide-react';

const PaymentSuccess = () => {
    const [url, setUrl] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Check if both location.state and location.state.detail exist
        if (!location.state || !location.state.detail) {
            navigate(path.HOME);
            return;
        }
        setOrderDetails(location.state.detail);
        setUrl(`/orders/${location.state.detail.orderId}`);
    }, [location, navigate]);

    const handleViewOrder = () => {
        navigate(url);
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    if (!location.state || !location.state.detail) {
        return null;
    }
    console.log("check orderDetails:", orderDetails);
    return (
        <Layout>
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* <Breadcrumb /> */}
                    
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                    Thanh toán thành công
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Đơn hàng của bạn đã được xử lý thành công!
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Đơn hàng của bạn đã được xử lý thành công và bạn sẽ nhận được thông tin chi tiết qua email.
                        </p>
                    </div>

                    {/* Order Details */}
                    {orderDetails && (
                        <div className="bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden mb-8">
                            <div className="p-8">
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                                    <div className="mb-4 sm:mb-0">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            Đơn hàng #{orderDetails.orderId?.slice(-8)}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : 'Vừa xong'}
                                            </div>
                                            {/* <div className="flex items-center gap-1">
                                                <Package className="h-4 w-4" />
                                                {orderDetails.items?.length || 0} sản phẩm
                                            </div> */}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-medium bg-green-50 text-green-700 border-green-200">
                                            <CheckCircle className="h-4 w-4" />
                                            Đã thanh toán
                                        </div>
                                        <button
                                            onClick={handleViewOrder}
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-medium"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                {orderDetails.items && orderDetails.items.length > 0 && (
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {orderDetails.items.slice(0, 3).map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">
                                                                {(item.productName || item.name)?.length > 30 ? 
                                                                    `${(item.productName || item.name).substring(0, 30)}...` : 
                                                                    (item.productName || item.name)
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Số lượng: {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {orderDetails.items.length > 3 && (
                                                    <div className="text-sm text-gray-500">
                                                        +{orderDetails.items.length - 3} sản phẩm khác
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Order Total */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>Tổng tiền:</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {orderDetails.total ? formatCurrency(orderDetails.total) : 'N/A'}₫
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Secondary Actions */}
                    <div className="text-center mb-8">
                        <Link to={path.HOME}>
                            <Button variant="outline" className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50">
                                <Home className="w-4 h-4 mr-2" />
                                Về trang chủ
                            </Button>
                        </Link>
                    </div>

                    {/* Thank You Message */}
                    <div className="text-center bg-gray-50 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Cảm ơn bạn đã tin tưởng chúng tôi!
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Chúng tôi cam kết mang đến những sản phẩm chất lượng và dịch vụ tốt nhất. 
                            Sự hài lòng của bạn là động lực để chúng tôi không ngừng phát triển.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentSuccess;

