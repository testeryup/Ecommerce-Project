import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../../../components/Layout';
import { formatCurrency, path } from '../../../../ultils';
import toast from 'react-hot-toast';
import { removeFromCart } from '../../../../features/cart/cartSlice';
import { initOrder, createOrder, validatePromo } from '../../../../services/userService';
import { createOrderWithProtection, initOrderWithProtection } from '../../../../services/orderService';
import { parseRaceConditionError } from '../../../../ultils/raceConditionHelper';
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
    FiZap,
    FiPercent,
    FiX
} from 'react-icons/fi';

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile } = useSelector(state => state.user);
    
    // State for better UX during race condition protection
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderAttempts, setOrderAttempts] = useState(0);
    const [lastError, setLastError] = useState(null);
    
    // Promo code states
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);
    const [promoError, setPromoError] = useState('');

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
                const result = await initOrderWithProtection(location.state.items);
                
                if (result.errCode !== 0) {
                    toast.error(result.message || 'Mặt hàng bạn đang yêu cầu không tồn tại hoặc đã hết');
                }
            } catch (error) {
                let errorMessage = 'Có lỗi xảy ra khi kiểm tra đơn hàng';
                
                if (error.userMessage) {
                    errorMessage = error.userMessage;
                } else if (error.response?.status === 401) {
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
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Tính toán discount amount từ percentage
    const discountAmount = appliedPromo ? Math.round(subtotal * (appliedPromo.discount / 100)) : 0;
    const total = subtotal - discountAmount;

    // Handle promo code validation
    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            setPromoError('Vui lòng nhập mã promo');
            return;
        }

        setIsValidatingPromo(true);
        setPromoError('');

        try {
            const response = await validatePromo(promoCode.trim(), subtotal);
            
            if (response.errCode === 0) {
                // Tính toán discountAmount từ discount percentage
                const calculatedDiscountAmount = Math.round(subtotal * (response.data.discount / 100));
                
                setAppliedPromo({
                    ...response.data,
                    discountAmount: calculatedDiscountAmount,
                    finalAmount: subtotal - calculatedDiscountAmount
                });
                toast.success(`Áp dụng thành công! Giảm ${response.data.discount}%`);
                setPromoCode('');
            } else {
                setPromoError(response.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Không thể áp dụng mã promo';
            setPromoError(errorMessage);
        } finally {
            setIsValidatingPromo(false);
        }
    };

    // Handle remove promo
    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoError('');
        toast.success('Đã hủy mã giảm giá');
    };

    const handlePlaceOrder = async () => {
        if (isPlacingOrder) {
            toast.error('Đơn hàng đang được xử lý, vui lòng chờ...');
            return;
        }

        setIsPlacingOrder(true);
        setLastError(null);
        const currentAttempt = orderAttempts + 1;
        setOrderAttempts(currentAttempt);

        try {
            if (profile.balance < total) {
                toast.error('Số dư không đủ');
                return;
            }

            // Show processing message for better UX
            const toastId = toast.loading('Đang xử lý đơn hàng...');

            const result = await createOrderWithProtection(items, appliedPromo?.code, {});
            
            toast.dismiss(toastId);
            
            if(result.errCode !== 0){
                throw new Error(result.message || 'Đặt hàng thất bại');
            }

            toast.success('Đặt hàng thành công');
            for(const item of items){
                dispatch(removeFromCart(item.skuId));
            }
            navigate(path.CHECKOUT_SUCCESS, {state: {
                detail: result.data
            }});
        } catch (error) {
            setLastError(error.message || 'Đặt hàng thất bại');
            
            // Enhanced error handling for race condition scenarios
            if (error.userMessage) {
                toast.error(error.userMessage);
            } else if (error.response?.status === 429) {
                toast.error('Có quá nhiều yêu cầu đặt hàng. Vui lòng thử lại sau ít phút.');
            } else if (error.response?.status === 409) {
                toast.error('Sản phẩm đã được mua bởi người khác. Vui lòng thử lại.');
            } else if (error.response?.status === 400 && error.response?.data?.message?.includes('stock')) {
                toast.error('Số lượng sản phẩm không đủ. Vui lòng kiểm tra lại giỏ hàng.');
            } else if (error.response?.status === 503) {
                toast.error('Hệ thống đang bận. Vui lòng thử lại sau ít giây.');
            } else {
                toast.error(error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsPlacingOrder(false);
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Order Items - 2/3 width */}
                        <div className="lg:col-span-3">
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
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                                    
                                    {/* Promo Code Section */}
                                    <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FiPercent className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-blue-900">Mã giảm giá</span>
                                        </div>
                                        
                                        {!appliedPromo ? (
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={promoCode}
                                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                        placeholder="Nhập mã giảm giá"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                                                    />
                                                    <button
                                                        onClick={handleApplyPromo}
                                                        disabled={isValidatingPromo || !promoCode.trim()}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isValidatingPromo ? 'Đang kiểm tra...' : 'Áp dụng'}
                                                    </button>
                                                </div>
                                                {promoError && (
                                                    <p className="text-red-600 text-sm">{promoError}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-green-900">{appliedPromo.code}</span>
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                                -{appliedPromo.discount}%
                                                            </span>
                                                        </div>
                                                        <p className="text-green-700 text-sm">
                                                            Giảm {formatCurrency(discountAmount)}₫
                                                        </p>
                                                        <p className="text-green-600 text-xs">
                                                            Còn lại {appliedPromo.remainingUsage} lượt sử dụng
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={handleRemovePromo}
                                                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Balance Info */}
                                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                        <div className="mb-2">
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
                                            <span>{formatCurrency(subtotal)}₫</span>
                                        </div>
                                        {appliedPromo && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá ({appliedPromo.discount}%):</span>
                                                <span>-{formatCurrency(discountAmount)}₫</span>
                                            </div>
                                        )}
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
                                        disabled={profile?.balance < total || isPlacingOrder}
                                        className={`w-full py-4 px-6 rounded-full font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                                            profile?.balance < total || isPlacingOrder
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        {isPlacingOrder ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Đang xử lý...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiCheckCircle className="w-5 h-5" />
                                                <span>
                                                    {profile?.balance < total ? 'Số dư không đủ' : 'Xác nhận đặt hàng'}
                                                </span>
                                            </>
                                        )}
                                    </button>

                                    {/* Error message display */}
                                    {lastError && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600 text-center">{lastError}</p>
                                        </div>
                                    )}

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