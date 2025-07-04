import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import { formatCurrency, path } from '../../../../ultils';
import toast from 'react-hot-toast';
import { removeFromCart } from '../../../../features/cart/cartSlice';
import { initOrder, createOrder } from '../../../../services/userService';

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
                console.log('Validating items:', location.state.items);
                console.log('User profile:', profile);
                console.log('User authenticated:', !!profile);
                
                const result = await initOrder(location.state.items);
                console.log('InitOrder result:', result);
                
                if (result.errCode !== 0) {
                    console.error('InitOrder failed:', result);
                    toast.error(result.message || 'Mặt hàng bạn đang yêu cầu không tồn tại hoặc đã hết');
                    // navigate(path.CART);
                } else {
                    console.log('Order validation successful!');
                }
            } catch (error) {
                console.error('Validation error details:', error);
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
                
                let errorMessage = 'Có lỗi xảy ra khi kiểm tra đơn hàng';
                
                if (error.response?.status === 401) {
                    errorMessage = 'Bạn cần đăng nhập để thực hiện đặt hàng';
                } else if (error.response?.status === 400) {
                    errorMessage = error.response?.data?.message || 'Dữ liệu đơn hàng không hợp lệ';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
                
                toast.error(errorMessage);
                // Temporarily comment out navigation to debug
                // navigate(path.CART);
            } finally {
                // Removed setIsLoading call
            }
        };

        validateItems();
        console.log("check var location state:", location?.state?.items || undefined);
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
            console.log("order result:", result);
            for(const item of items){
                dispatch(removeFromCart(item.skuId));
            }
            navigate(path.CHECKOUT_SUCCESS, {state: {
                detail: result.data
            }});
        } catch (error) {
            toast.error('Đặt hàng thất bại');
            console.error('Order placement failed:', error);
        }
        
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold">Xác nhận đơn hàng</h1>
                        <p className="text-blue-100 text-lg mt-2">
                            Kiểm tra lại thông tin và hoàn tất đặt hàng
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        {/* Order Summary */}
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Chi tiết đơn hàng
                            </h2>
                            
                            <div className="space-y-6">
                                {items.map(item => (
                                    <div key={item.skuId} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = '/default-product.jpg';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {item.skuName}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                                                Số lượng: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(item.price)}₫
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Tổng: {formatCurrency(item.price * item.quantity)}₫
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Summary */}
                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            Số dư hiện tại:
                                        </span>
                                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                            {formatCurrency(profile?.balance || 0)}₫
                                        </span>
                                    </div>
                                    <hr className="border-gray-200 dark:border-gray-600" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            Tổng thanh toán:
                                        </span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatCurrency(total)}₫
                                        </span>
                                    </div>
                                    
                                    {profile?.balance < total && (
                                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                            <p className="text-red-700 dark:text-red-400 text-sm">
                                                ⚠️ Số dư không đủ để thanh toán. Vui lòng nạp thêm tiền.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex space-x-4">
                                <button
                                    onClick={() => navigate(path.CART)}
                                    className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                                >
                                    Quay lại giỏ hàng
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={profile?.balance < total}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                                        profile?.balance < total
                                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {profile?.balance < total ? 'Số dư không đủ' : 'Xác nhận đặt hàng'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}