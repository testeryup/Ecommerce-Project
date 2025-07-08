import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../../features/cart/cartSlice';
import { formatCurrency } from '../../../../ultils';
import UserHeader from '../../UserHeader';
import Footer from '../../../../components/Footer';
import { path } from '../../../../ultils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart,
    faTrash,
    faMinus,
    faPlus,
    faArrowRight,
    faHeart,
    faTag
} from '@fortawesome/free-solid-svg-icons';

export default function CartPage() {
    const { items, total } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(new Set());

    const handleQuantityChange = (skuId, newQuantity) => {
        dispatch(updateQuantity({ skuId, quantity: parseInt(newQuantity) }));
    };

    const handleRemoveItem = (skuId) => {
        dispatch(removeFromCart(skuId));
    };

    const handleItemSelect = (skuId) => {
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(skuId)) {
                newSelected.delete(skuId);
            } else {
                newSelected.add(skuId);
            }
            return newSelected;
        });
    };

    // Handle select all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(new Set(items.map(item => item.skuId)));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleSubmitItemsToCheckout = () => {
        if(selectedItems.size > 0){
            const checkOutItems = items.filter(item => selectedItems.has(item.skuId));
            navigate(path.CHECKOUT, {state: {items: checkOutItems}});
        }
    }
    // Calculate selected items total
    const selectedTotal = items
        .filter(item => selectedItems.has(item.skuId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <UserHeader />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            
            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-3xl" />
                        <div>
                            <h1 className="text-4xl font-bold">Giỏ hàng của bạn</h1>
                            <p className="text-blue-100 text-lg mt-2">
                                {items.length} sản phẩm trong giỏ hàng
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {items.length === 0 ? (
                    /* Empty Cart */
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Giỏ hàng trống
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                            Hãy khám phá các sản phẩm tuyệt vời và thêm vào giỏ hàng
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                        >
                            Khám phá sản phẩm
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Select All Header */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.size === items.length}
                                        onChange={handleSelectAll}
                                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Chọn tất cả ({items.length} sản phẩm)
                                    </span>
                                </label>
                            </div>

                            {/* Cart Items List */}
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.skuId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                                        <div className="flex items-center space-x-4">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(item.skuId)}
                                                onChange={() => handleItemSelect(item.skuId)}
                                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />

                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faTag} className="text-2xl text-gray-400" />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {item.skuName}
                                                </p>
                                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                    {formatCurrency(item.price)}₫
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handleQuantityChange(item.skuId, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="text-xs" />
                                                </button>
                                                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.skuId, Math.min(10, item.quantity + 1))}
                                                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(item.price * item.quantity)}₫
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={() => handleRemoveItem(item.skuId)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                                    title="Xóa khỏi giỏ hàng"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                                    title="Thêm vào yêu thích"
                                                >
                                                    <FontAwesomeIcon icon={faHeart} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Thông tin đơn hàng
                                </h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Sản phẩm đã chọn:
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {selectedItems.size}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Tạm tính:
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(selectedTotal)}₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Phí xử lý:
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            Miễn phí
                                        </span>
                                    </div>
                                    <hr className="border-gray-200 dark:border-gray-600" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            Tổng cộng:
                                        </span>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatCurrency(selectedTotal)}₫
                                        </span>
                                    </div>
                                </div>

                                <button
                                    disabled={selectedItems.size === 0}
                                    onClick={handleSubmitItemsToCheckout}
                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                                        selectedItems.size === 0
                                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    <span>Thanh toán ({selectedItems.size})</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>

                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                                    >
                                        ← Tiếp tục mua sắm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
            <Footer />
        </>
    );
}