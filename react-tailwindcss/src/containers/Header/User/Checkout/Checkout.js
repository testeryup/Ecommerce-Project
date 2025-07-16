import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../../../components/Layout';
import { formatCurrency, path } from '../../../../ultils';
import toast from 'react-hot-toast';
import { removeFromCart } from '../../../../features/cart/cartSlice';
import { initOrder, createOrder } from '../../../../services/userService';
import { 
    FiShoppingCart, 
    FiShield, 
    FiCreditCard, 
    FiCheckCircle, 
    FiArrowLeft, 
    FiKey,
    FiPackage,
    FiStar,
    FiGift,
    FiZap
} from 'react-icons/fi';

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile } = useSelector(state => state.user);

    useEffect(() => {
        // Check for items in location state
        if (!location?.state?.items) {
            toast.error('Không tìm thấy thông tin đơn hàng');
            navigate(path.CART);
            return;
        }

        // Validate items
        const validateItems = async () => {
            try {
                const result = await initOrder(location.state.items);
                
                if (result.errCode !== 0) {
                    toast.error(result.message || 'Mặt hàng bạn đang yêu cầu không tồn tại hoặc đã hết');
                }
            } catch (error) {
                let errorMessage = 'Có lỗi xảy ra khi kiểm tra đơn hàng';
                
                if (error.response?.status === 401) {
                    errorMessage = 'Bạn cần đăng nhập để thực hiện đặt hàng';
                } else if (error.response?.status === 400) {
                    errorMessage = error.response?.data?.message || 'Dữ liệu đơn hàng không hợp lệ';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
                
                toast.error(errorMessage);
            }
        };

        validateItems();
    }, [location, navigate]);

    // If no items in state, return early
    if (!location?.state?.items) {
        return null;
    }
    const items = location.state.items;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        try {
            if (profile.balance < total) {
                toast.error('Số dư không đủ');
                return;
            }

            const result = await createOrder(items);
            if(result.errCode !== 0){
                throw new Error(result);
            }

            toast.success('Đặt hàng thành công');
            for(const item of items){
                dispatch(removeFromCart(item.skuId));
            }
            navigate(path.CHECKOUT_SUCCESS, {state: {
                detail: result.data
            }});
        } catch (error) {
            toast.error('Đặt hàng thất bại');
        }
    };

    // Get product type for better visualization
    const getProductType = (item) => {
        if (item.name?.toLowerCase().includes('office') || item.name?.toLowerCase().includes('microsoft')) {
            return { icon: FiPackage, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
        } else if (item.name?.toLowerCase().includes('adobe') || item.name?.toLowerCase().includes('design')) {
            return { icon: FiStar, color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-600' };
        } else if (item.name?.toLowerCase().includes('antivirus') || item.name?.toLowerCase().includes('security')) {
            return { icon: FiShield, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600' };
        } else if (item.name?.toLowerCase().includes('netflix') || item.name?.toLowerCase().includes('spotify')) {
            return { icon: FiGift, color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-600' };
        }
        return { icon: FiKey, color: 'gray', bgColor: 'bg-gray-50', textColor: 'text-gray-600' };
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(path.CART)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Quay lại giỏ hàng</span>
                            </button>
                        </div>
                        <div className="mt-4">
                            <h1 className="text-3xl font-semibold text-gray-900">Xác nhận đơn hàng</h1>
                            <p className="text-gray-600 mt-1">Kiểm tra lại thông tin và hoàn tất đặt hàng</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Items - 2/3 width */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <FiShoppingCart className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900">Chi tiết đơn hàng</h2>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                                            {items.length} sản phẩm
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="divide-y divide-gray-100">
                                    {items.map(item => {
                                        const productType = getProductType(item);
                                        const ProductIcon = productType.icon;
                                        
                                        return (
                                            <div key={item.skuId} className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    {/* Product Image */}
                                                    <div className="relative">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-xl"
                                                            onError={(e) => {
                                                                e.target.src = '/default-product.jpg';
                                                            }}
                                                        />
                                                        <div className={`absolute -top-1 -right-1 p-1 ${productType.bgColor} rounded-full`}>
                                                            <ProductIcon className={`w-3 h-3 ${productType.textColor}`} />
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mb-2">
                                                            {item.skuName}
                                                        </p>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <span className="flex items-center space-x-1">
                                                                <FiPackage className="w-4 h-4" />
                                                                <span>Số lượng: {item.quantity}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(item.price)}₫
                                                        </p>
                                                        {item.quantity > 1 && (
                                                            <p className="text-sm text-gray-600">
                                                                Tổng: {formatCurrency(item.price * item.quantity)}₫
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            
                        </div>

                        {/* Order Summary - 1/3 width */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                                    
                                    {/* Balance Info */}
                                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Số dư hiện tại:</span>
                                            <div className="flex items-center space-x-2">
                                                <FiCreditCard className="w-4 h-4 text-gray-500" />
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(profile?.balance || 0)}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Total */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tạm tính:</span>
                                            <span>{formatCurrency(total)}₫</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Phí xử lý:</span>
                                            <span>Miễn phí</span>
                                        </div>
                                        <hr className="border-gray-200" />
                                        <div className="flex justify-between text-xl font-semibold text-gray-900">
                                            <span>Tổng cộng:</span>
                                            <span>{formatCurrency(total)}₫</span>
                                        </div>
                                    </div>
                                    
                                    {/* Warning for insufficient balance */}
                                    {profile?.balance < total && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                            <div className="flex items-start space-x-3">
                                                <div className="p-1 bg-red-100 rounded-full">
                                                    <FiCreditCard className="w-4 h-4 text-red-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-red-900 mb-1">Số dư không đủ</h4>
                                                    <p className="text-red-700 text-sm">
                                                        Vui lòng nạp thêm {formatCurrency(total - profile.balance)}₫ để hoàn tất đơn hàng.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Place Order Button */}
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={profile?.balance < total}
                                        className={`w-full py-4 px-6 rounded-full font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                                            profile?.balance < total
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        <FiCheckCircle className="w-5 h-5" />
                                        <span>
                                            {profile?.balance < total ? 'Số dư không đủ' : 'Xác nhận đặt hàng'}
                                        </span>
                                    </button>

                                    {/* Additional Info */}
                                    <div className="mt-4 text-center">
                                        <p className="text-xs text-gray-500">
                                            Bằng việc đặt hàng, bạn đồng ý với{' '}
                                            <span className="text-gray-700 hover:underline cursor-pointer">
                                                Điều khoản dịch vụ
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}