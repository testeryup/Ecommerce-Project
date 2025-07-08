import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { userGetProductById } from '../../services/userService';
import { formatCurrency, path } from '../../ultils';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faStore, 
    faSearchPlus,
    faShoppingCart,
    faBolt,
    faShieldAlt,
    faHeadset,
    faMinus,
    faPlus,
    faCheckCircle,
    faTimesCircle,
    faStar,
    faHeart,
    faShare
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/Layout';

export default function ProductDetail() {
    const [selectedImage, setSelectedImage] = useState(0);
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSku, setSelectedSku] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const result = await userGetProductById(productId);
                if (result.errCode === 0) {
                    const sortedSkus = [...result.data.skus].sort((a, b) => a.price - b.price);
                    setProduct({ ...result.data, skus: sortedSkus });
                    setSelectedSku(sortedSkus[0]);
                }
            } catch (error) {
                setError(error.message);
                toast.error('Không thể tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) {
            toast.error('Không tìm thấy thông tin sản phẩm');
            return;
        }
        if (!selectedSku) {
            toast.error('Vui lòng chọn phiên bản sản phẩm');
            return;
        }
        
        dispatch(addToCart({
            product,
            sku: selectedSku,
            quantity: selectedQuantity
        }));
        toast.success('Thêm vào giỏ hàng thành công');
    };

    const handleBuyNow = () => {
        if (!product) {
            toast.error('Không tìm thấy thông tin sản phẩm');
            return;
        }
        if (!selectedSku) {
            toast.error('Vui lòng chọn phiên bản sản phẩm');
            return;
        }
        
        dispatch(addToCart({
            product,
            sku: selectedSku,
            quantity: selectedQuantity
        }));

        navigate(path.CHECKOUT, {
            state: {
                items: [{
                    productId: product._id,
                    skuId: selectedSku._id,
                    name: product.name,
                    skuName: selectedSku.name,
                    price: selectedSku.price,
                    quantity: selectedQuantity,
                    image: (product.images && product.images[0]) || product.thumbnail || product.imageUrl || ''
                }]
            }
        });
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loading />
            </div>
        </Layout>
    );

    if (error) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-6xl mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </Layout>
    );

    if (!product) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <FontAwesomeIcon icon={faStore} className="text-gray-400 text-6xl mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
                    <p className="text-gray-600 mb-6">Sản phẩm này có thể đã bị xóa hoặc không tồn tại</p>
                    <button 
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Xem sản phẩm khác
                    </button>
                </div>
            </div>
        </Layout>
    );

    const maxQuantity = Math.min(selectedSku.stock || 0, 10);

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Header Navigation */}
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <button 
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                                <span className="font-medium">Quay lại</span>
                            </button>
                            
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-2 rounded-full transition-all duration-200 ${
                                        isFavorite 
                                            ? 'text-red-500 bg-red-50' 
                                            : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200">
                                    <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Product Gallery */}
                        <div className="space-y-8">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden group">
                                <img 
                                    src={
                                        (product.images && product.images[selectedImage]) || 
                                        product.thumbnail || 
                                        product.imageUrl || 
                                        'https://via.placeholder.com/600x600/f9fafb/9ca3af?text=Hình+ảnh'
                                    } 
                                    alt={product.name}
                                    className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                                />
                                
                                {/* Zoom Button */}
                                <button 
                                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                                    className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faSearchPlus} className="w-4 h-4 mr-2" />
                                    Phóng to
                                </button>
                            </div>
                            
                            {/* Thumbnail Navigation */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex space-x-4 justify-center overflow-x-auto pb-2">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === index 
                                                    ? 'border-gray-900 ring-4 ring-gray-100' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-contain bg-gray-50"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                    {product.category}
                                </div>
                                
                                <h1 className="text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
                                    {product.name}
                                </h1>
                                
                                {/* Rating */}
                                <div className="flex items-center space-x-3 pt-2">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FontAwesomeIcon 
                                                key={i} 
                                                icon={faStar} 
                                                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-200'}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">4.2 (89 đánh giá)</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-semibold text-gray-900">
                                        {formatCurrency(selectedSku.price)}₫
                                    </span>
                                    {selectedSku.originalPrice > selectedSku.price && (
                                        <span className="text-xl text-gray-400 line-through">
                                            {formatCurrency(selectedSku.originalPrice)}₫
                                        </span>
                                    )}
                                </div>
                                
                                {selectedSku.originalPrice > selectedSku.price && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                                        Tiết kiệm {Math.round((1 - selectedSku.price/selectedSku.originalPrice) * 100)}%
                                    </div>
                                )}
                            </div>

                            {/* SKU Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Chọn phiên bản</h3>
                                <div className="space-y-3">
                                    {product.skus.map(sku => (
                                        <button
                                            key={sku._id}
                                            onClick={() => setSelectedSku(sku)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                                                selectedSku._id === sku._id
                                                    ? 'border-gray-900 bg-gray-50'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-gray-900">{sku.name}</div>
                                                    <div className="text-sm text-gray-500">Còn {sku.stock} sản phẩm</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">
                                                        {formatCurrency(sku.price)}₫
                                                    </div>
                                                    {sku.originalPrice > sku.price && (
                                                        <div className="text-sm text-gray-400 line-through">
                                                            {formatCurrency(sku.originalPrice)}₫
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Số lượng</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-200 rounded-xl">
                                        <button 
                                            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                            disabled={selectedQuantity === 1}
                                            className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-xl"
                                        >
                                            <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            value={selectedQuantity}
                                            onChange={(e) => setSelectedQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                                            className="w-16 text-center border-0 focus:ring-0 font-medium"
                                            min="1"
                                            max={maxQuantity}
                                        />
                                        <button 
                                            onClick={() => setSelectedQuantity(Math.min(maxQuantity, selectedQuantity + 1))}
                                            disabled={selectedQuantity === maxQuantity}
                                            className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-xl"
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">Tối đa {maxQuantity}</span>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    selectedSku.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <span className={`text-sm font-medium ${
                                    selectedSku.stock > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {selectedSku.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4 pt-4">
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={selectedSku.stock === 0}
                                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
                                >
                                    <FontAwesomeIcon icon={faBolt} className="w-5 h-5" />
                                    <span>Mua ngay</span>
                                </button>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={selectedSku.stock === 0}
                                    className="w-full border-2 border-gray-900 text-gray-900 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
                                    <span>Thêm vào giỏ</span>
                                </button>
                            </div>

                            {/* Features */}
                            <div className="pt-8 space-y-6">
                                <div className="flex items-center space-x-4 py-4 border-b border-gray-100">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Bảo mật thanh toán</div>
                                        <div className="text-sm text-gray-500">Mã hóa SSL 256-bit</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 py-4 border-b border-gray-100">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Giao hàng tức thì</div>
                                        <div className="text-sm text-gray-500">Nhận ngay sau thanh toán</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 py-4">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faHeadset} className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Hỗ trợ 24/7</div>
                                        <div className="text-sm text-gray-500">Tư vấn miễn phí</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
                                Thông tin sản phẩm
                            </h2>
                            
                            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                                {product.description ? product.description.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-6 last:mb-0">
                                        {paragraph}
                                    </p>
                                )) : (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FontAwesomeIcon icon={faStore} className="text-gray-400 text-xl" />
                                        </div>
                                        <p className="text-gray-500">Thông tin chi tiết sẽ được cập nhật sớm</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}