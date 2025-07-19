import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../../features/cart/cartSlice';
import { formatCurrency } from '../../../../ultils';
import { throttle } from '../../../../ultils/raceConditionHelper';
import Layout from '../../../../components/Layout';
import { path } from '../../../../ultils';
import { 
    FiShoppingCart, 
    FiTrash2, 
    FiMinus, 
    FiPlus, 
    FiArrowRight, 
    FiHeart, 
    FiShield, 
    FiCreditCard,
    FiKey,
    FiMonitor,
    FiClock,
    FiCheckCircle,
    FiZap,
    FiDownload,
    FiStar,
    FiEdit3,
    FiSave
} from 'react-icons/fi';

export default function CartPage() {
    const { items } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [savedForLater, setSavedForLater] = useState(new Set());
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

    // Throttled quantity change to prevent rapid updates that could cause race conditions
    const throttledQuantityChange = throttle((skuId, newQuantity) => {
        dispatch(updateQuantity({ skuId, quantity: parseInt(newQuantity) }));
    }, 500); // Limit to once per 500ms

    const handleQuantityChange = (skuId, newQuantity) => {
        throttledQuantityChange(skuId, newQuantity);
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

    const handleSaveForLater = (skuId) => {
        setSavedForLater(prev => {
            const newSaved = new Set(prev);
            if (newSaved.has(skuId)) {
                newSaved.delete(skuId);
            } else {
                newSaved.add(skuId);
            }
            return newSaved;
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
        if (isProcessingCheckout) {
            return; // Prevent duplicate checkout submissions
        }
        
        if(selectedItems.size > 0){
            setIsProcessingCheckout(true);
            const checkOutItems = items.filter(item => selectedItems.has(item.skuId));
            navigate(path.CHECKOUT, {state: {items: checkOutItems}});
            // Reset processing state after navigation
            setTimeout(() => setIsProcessingCheckout(false), 1000);
        }
    }
    
    // Calculate selected items total
    const selectedTotal = items
        .filter(item => selectedItems.has(item.skuId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Get product type for better categorization
    const getProductType = (item) => {
        if (item.name?.toLowerCase().includes('office') || item.name?.toLowerCase().includes('microsoft')) {
            return { type: 'productivity', icon: FiEdit3, color: 'blue' };
        } else if (item.name?.toLowerCase().includes('adobe') || item.name?.toLowerCase().includes('design') || item.name?.toLowerCase().includes('canva')) {
            return { type: 'thiết kế', icon: FiMonitor, color: 'purple' };
        } else if (item.name?.toLowerCase().includes('antivirus') || item.name?.toLowerCase().includes('security')) {
            return { type: 'security', icon: FiShield, color: 'green' };
        } else if (item.name?.toLowerCase().includes('netflix') || item.name?.toLowerCase().includes('spotify') || item.name?.toLowerCase().includes('youtube')) {
            return { type: 'giải trí', icon: FiStar, color: 'red' };
        }
        return { type: 'software', icon: FiKey, color: 'gray' };
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            
            {/* Modern Header with Breadcrumb */}
            <section className="relative bg-white/80 backdrop-blur-sm pt-20 pb-8 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                        <button onClick={() => navigate('/')} className="hover:text-gray-900 transition-colors">Trang chủ</button>
                        <span>/</span>
                        <button onClick={() => navigate('/products')} className="hover:text-gray-900 transition-colors">Sản phẩm</button>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Giỏ hàng</span>
                    </nav>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                                <FiShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                                    Giỏ hàng của bạn
                                </h1>
                                <p className="text-gray-600 mt-1 font-light">
                                    {items.length} sản phẩm • {selectedItems.size} đã chọn
                                </p>
                            </div>
                        </div>
                        
                        {/* {items.length > 0 && (
                            <div className="hidden md:flex items-center space-x-4">
                                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                                    <FiShield className="w-4 h-4" />
                                    <span>100% Chính hãng</span>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                                    <FiZap className="w-4 h-4" />
                                    <span>Giao hàng tức thì</span>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {items.length === 0 ? (
                    /* Empty Cart - Modern Design */
                    <div className="text-center py-16">
                        <div className="w-48 h-48 mx-auto mb-8 relative">
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                                <div className="text-center">
                                    <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto"></div>
                                </div>
                            </div>
                            {/* Floating elements */}
                            <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-100 rounded-full animate-bounce delay-300"></div>
                            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-100 rounded-full animate-bounce delay-700"></div>
                        </div>
                        
                        <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Giỏ hàng chưa có sản phẩm nào
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto font-light">
                            Khám phá thư viện tài khoản và key bản quyền chính hãng với giá tốt nhất thị trường
                        </p>
                        
                        {/* Quick Categories */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
                            {[
                                { icon: FiEdit3, title: 'Office Suite', desc: 'Microsoft Office, Google Workspace', color: 'blue' },
                                { icon: FiMonitor, title: 'Design Tools', desc: 'Adobe Creative Suite, Sketch', color: 'purple' },
                                { icon: FiShield, title: 'Security', desc: 'Antivirus, VPN Premium', color: 'green' },
                                { icon: FiStar, title: 'Entertainment', desc: 'Netflix, Spotify, YouTube', color: 'red' }
                            ].map((category, index) => (
                                <div key={index} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-${category.color}-200 transition-all duration-300 cursor-pointer group`}>
                                    <div className={`w-12 h-12 bg-${category.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${category.color}-100 transition-colors`}>
                                        <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                                    <p className="text-sm text-gray-600">{category.desc}</p>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => navigate('/products')}
                            className="group bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-lg flex items-center gap-3 mx-auto shadow-xl transition-all duration-300"
                        >
                            Khám phá sản phẩm ngay
                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ) : (
                    /* Cart with Items - Modern Two Column Layout */
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Cart Items - Left Column */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Action Header */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                        <FiShoppingCart className="w-5 h-5" />
                                        Sản phẩm trong giỏ ({items.length})
                                    </h2>
                                    <div className="flex items-center space-x-3">
                                        {/* <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                            Sắp xếp theo giá
                                        </button> */}
                                    </div>
                                </div>
                                
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.size === items.length}
                                        onChange={handleSelectAll}
                                        className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                        Chọn tất cả sản phẩm
                                    </span>
                                </label>
                            </div>

                            {/* Product Cards */}
                            <div className="space-y-4">
                                {items.map(item => {
                                    const productType = getProductType(item);
                                    const isSelected = selectedItems.has(item.skuId);
                                    const isSaved = savedForLater.has(item.skuId);
                                    
                                    return (
                                        <div key={item.skuId} className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                                            isSelected ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'
                                        }`}>
                                            <div className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    {/* Checkbox */}
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleItemSelect(item.skuId)}
                                                        className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all mt-1"
                                                    />

                                                    {/* Product Icon */}
                                                    <div className={`w-16 h-16 bg-gradient-to-br from-${productType.color}-50 to-${productType.color}-100 rounded-xl flex items-center justify-center shadow-sm`}>
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                                                        ) : (
                                                            <productType.icon className={`w-8 h-8 text-${productType.color}-600`} />
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                                                    {item.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 mt-1 font-light">
                                                                    {item.skuName || `${productType.type === 'software' ? 'License Key' : 'Premium Account'}`}
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Product Type Badge */}
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${productType.color}-50 text-${productType.color}-700`}>
                                                                <productType.icon className="w-3 h-3" />
                                                                {productType.type}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Features */}
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
                                                                <FiShield className="w-3 h-3" />
                                                                Chính hãng
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                                                                <FiZap className="w-3 h-3" />
                                                                Tức thì
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium">
                                                                <FiClock className="w-3 h-3" />
                                                                Lifetime
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Price and Actions Row */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                {/* Quantity Controls */}
                                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item.skuId, Math.max(1, item.quantity - 1))}
                                                                        className="w-8 h-8 bg-white text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 flex items-center justify-center shadow-sm"
                                                                    >
                                                                        <FiMinus className="w-4 h-4" />
                                                                    </button>
                                                                    <span className="w-8 text-center font-semibold text-gray-900">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item.skuId, Math.min(10, item.quantity + 1))}
                                                                        className="w-8 h-8 bg-white text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 flex items-center justify-center shadow-sm"
                                                                    >
                                                                        <FiPlus className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                
                                                                {/* Price */}
                                                                <div>
                                                                    <p className="text-xl font-semibold text-gray-900">
                                                                        {formatCurrency(item.price * item.quantity)}₫
                                                                    </p>
                                                                    {item.quantity > 1 && (
                                                                        <p className="text-sm text-gray-500 font-light">
                                                                            {formatCurrency(item.price)}₫ / sản phẩm
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Action Buttons */}
                                                            <div className="flex items-center space-x-2">
                                                                {/* <button
                                                                    onClick={() => handleSaveForLater(item.skuId)}
                                                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                                                        isSaved 
                                                                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                                                                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                                                    }`}
                                                                    title="Lưu để mua sau"
                                                                >
                                                                    <FiSave className="w-4 h-4" />
                                                                </button> */}
                                                                <button
                                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                    title="Thêm vào yêu thích"
                                                                >
                                                                    <FiHeart className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveItem(item.skuId)}
                                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                    title="Xóa khỏi giỏ hàng"
                                                                >
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Summary - Modern Sidebar */}
                        <div className="xl:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Order Summary Card */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                                            <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Tóm tắt đơn hàng
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Sản phẩm ({selectedItems.size})</span>
                                            <span className="font-semibold text-gray-900">
                                                {formatCurrency(selectedTotal)}₫
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <FiZap className="w-4 h-4" />
                                                Phí xử lý
                                            </span>
                                            <span className="font-semibold text-green-600">Miễn phí</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <FiDownload className="w-4 h-4" />
                                                Giao hàng số
                                            </span>
                                            <span className="font-semibold text-green-600">Tức thì</span>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                                                <span className="text-2xl font-semibold text-gray-900">
                                                    {formatCurrency(selectedTotal)}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        disabled={selectedItems.size === 0}
                                        onClick={handleSubmitItemsToCheckout}
                                        className={`w-full py-4 rounded-full font-medium text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl ${
                                            selectedItems.size === 0
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-black hover:bg-gray-800 text-white'
                                        }`}
                                    >
                                        <FiCreditCard className="w-5 h-5" />
                                        <span>Thanh toán ngay</span>
                                        {selectedItems.size > 0 && (
                                            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                                                {selectedItems.size}
                                            </span>
                                        )}
                                    </button>

                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
                                        >
                                            ← Tiếp tục mua sắm
                                        </button>
                                    </div>
                                </div>

                                {/* Trust Signals */}
                                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                                    <h4 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                                        <FiShield className="w-5 h-5" />
                                        Cam kết chất lượng
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3 text-emerald-800">
                                            <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                                            <span>100% sản phẩm chính hãng</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-800">
                                            <FiZap className="w-4 h-4 text-emerald-600" />
                                            <span>Giao hàng tức thì sau thanh toán</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-800">
                                            <FiClock className="w-4 h-4 text-emerald-600" />
                                            <span>Hỗ trợ kỹ thuật 24/7</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </Layout>
    );
}