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
import Header from '../../components/Header';

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
                    image: product.images[0]
                }]
            }
        });
    };

    if (loading) return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loading />
            </div>
        </>
    );

    if (error) return (
        <>
            <Header />
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
        </>
    );

    if (!product) return (
        <>
            <Header />
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
        </>
    );

    const maxQuantity = Math.min(selectedSku.stock || 0, 10);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                <span>Quay lại</span>
                            </button>
                            <span>/</span>
                            <span className="text-gray-400">{product.category}</span>
                            <span>/</span>
                            <span className="text-gray-800 font-medium truncate">{product.name}</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Product Gallery */}
                        <div className="space-y-4">
                            <div className="relative">
                                <div 
                                    className={`relative overflow-hidden rounded-lg bg-white shadow-lg cursor-zoom-in transition-transform duration-300 ${isImageZoomed ? 'scale-105' : ''}`}
                                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                                >
                                    <img 
                                        src={product.images[selectedImage]} 
                                        alt={product.name}
                                        className="w-full h-96 sm:h-[500px] object-cover"
                                    />
                                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faSearchPlus} />
                                        <span>Phóng to</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Thumbnails */}
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImage === index 
                                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <FontAwesomeIcon icon={faStore} className="text-blue-600" />
                                    <span>Cung cấp bởi</span>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        {product.seller.username}
                                    </button>
                                </div>
                            </div>

                            {/* Rating & Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesomeIcon 
                                            key={i} 
                                            icon={faStar} 
                                            className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-2">(4.2) • 89 đánh giá</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-2 rounded-full transition-colors ${
                                            isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faHeart} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                                        <FontAwesomeIcon icon={faShare} />
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {formatCurrency(selectedSku.price)}
                                    </span>
                                    <span className="text-xl text-blue-600">₫</span>
                                    {selectedSku.originalPrice > selectedSku.price && (
                                        <>
                                            <span className="text-lg text-gray-500 line-through">
                                                {formatCurrency(selectedSku.originalPrice)}₫
                                            </span>
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                -{Math.round((1 - selectedSku.price/selectedSku.originalPrice) * 100)}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                {/* SKU Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chọn gói:
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {product.skus.map(sku => (
                                            <button
                                                key={sku._id}
                                                onClick={() => setSelectedSku(sku)}
                                                className={`p-3 rounded-lg border text-left transition-colors ${
                                                    selectedSku._id === sku._id
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{sku.name}</span>
                                                    <span className="font-semibold text-blue-600">
                                                        {formatCurrency(sku.price)}₫
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số lượng:
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                            disabled={selectedQuantity === 1}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <input
                                            type="number"
                                            value={selectedQuantity}
                                            onChange={(e) => setSelectedQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                                            className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            min="1"
                                            max={maxQuantity}
                                        />
                                        <button 
                                            onClick={() => setSelectedQuantity(Math.min(maxQuantity, selectedQuantity + 1))}
                                            disabled={selectedQuantity === maxQuantity}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            (Tối đa {maxQuantity})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center space-x-2">
                                <FontAwesomeIcon 
                                    icon={selectedSku.stock > 0 ? faCheckCircle : faTimesCircle}
                                    className={selectedSku.stock > 0 ? 'text-green-500' : 'text-red-500'}
                                />
                                <span className={`font-medium ${selectedSku.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedSku.stock > 0 ? `Còn ${selectedSku.stock} sản phẩm` : 'Hết hàng'}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={selectedSku.stock === 0}
                                    className="flex items-center justify-center space-x-2 py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                    <span>Thêm vào giỏ</span>
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={selectedSku.stock === 0}
                                    className="flex items-center justify-center space-x-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    <FontAwesomeIcon icon={faBolt} />
                                    <span>Mua ngay</span>
                                </button>
                            </div>

                            {/* Features */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Ưu điểm nổi bật</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 text-sm" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800 text-sm">Bảo mật thanh toán</h4>
                                            <p className="text-gray-600 text-xs">An toàn tuyệt đối</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faBolt} className="text-green-600 text-sm" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800 text-sm">Giao dịch tức thì</h4>
                                            <p className="text-gray-600 text-xs">Nhận hàng ngay lập tức</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faHeadset} className="text-purple-600 text-sm" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800 text-sm">Hỗ trợ 24/7</h4>
                                            <p className="text-gray-600 text-xs">Luôn sẵn sàng hỗ trợ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mt-12">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h2>
                            <div className="prose prose-blue max-w-none">
                                {product.description.split('\n').map((paragraph, index) => (
                                    <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}