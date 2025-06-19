import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faShoppingCart, 
  faHeart,
  faShare,
  faStar,
  faStarHalfAlt,
  faPlus,
  faMinus,
  faShieldAlt,
  faTruck,
  faUndo,
  faHeadset,
  faCheckCircle,
  faEye,
  faSearchPlus,
  faStore,
  faTag,
  faGift,
  faFire,
  faCrown,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular, 
  faBookmark as faBookmarkRegular 
} from '@fortawesome/free-regular-svg-icons';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import { addToCart } from '../features/cart/cartSlice';
import api from '../axios';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/product/${productId}`);
      if (response.errCode === 0) {
        setProduct(response.data);
        if (response.data.skus && response.data.skus.length > 0) {
          setSelectedSku(response.data.skus[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => Math.min(prev + 1, selectedSku?.stock || 1));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = () => {
    if (!selectedSku) {
      toast.error('Vui lòng chọn phiên bản sản phẩm');
      return;
    }
    
    dispatch(addToCart({
      product: product,
      sku: selectedSku,
      quantity: quantity
    }));
    
    toast.success('Đã thêm vào giỏ hàng');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-gray-300" />);
    }
    
    return stars;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'entertainment': '🎬',
      'productivity': '💼', 
      'music': '🎵',
      'security': '🔒',
      'education': '🎓',
      'gaming': '🎮'
    };
    return iconMap[category] || '📦';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Không tìm thấy sản phẩm
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Quay lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Sản phẩm
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Quay lại</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                  {product.images?.length > 0 || product.thumbnail ? (
                    <img
                      src={product.images?.[selectedImageIndex] || product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-contain cursor-zoom-in"
                      onClick={() => setIsImageZoomed(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faTag} className="text-6xl text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Image Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button
                    onClick={() => setIsImageZoomed(true)}
                    className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    title="Phóng to"
                  >
                    <FontAwesomeIcon icon={faSearchPlus} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                    title="Yêu thích"
                  >
                    <FontAwesomeIcon icon={isFavorite ? faHeart : faHeartRegular} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain bg-white dark:bg-gray-800"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                    {product.subcategory}
                  </span>
                  {product.featured && (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium flex items-center">
                      <FontAwesomeIcon icon={faCrown} className="mr-1 text-xs" />
                      Nổi bật
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderStars(product.rating || 4.5)}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.rating || 4.5}
                    </span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {product.reviews || 0} đánh giá
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Đã bán {product.sold || 0}
                  </span>
                </div>

                {/* Seller Info */}
                {product.seller && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FontAwesomeIcon icon={faStore} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bán bởi</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.seller.username || product.seller.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                {selectedSku ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(selectedSku.price)}
                      </span>
                      {selectedSku.originalPrice && selectedSku.originalPrice > selectedSku.price && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(selectedSku.originalPrice)}
                          </span>
                          <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                            -{Math.round(((selectedSku.originalPrice - selectedSku.price) / selectedSku.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Còn lại: {selectedSku.stock} sản phẩm
                    </p>
                  </div>
                ) : (
                  <p className="text-lg text-gray-600 dark:text-gray-400">Liên hệ để biết giá</p>
                )}
              </div>

              {/* SKU Selection */}
              {product.skus && product.skus.length > 1 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chọn phiên bản:
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.skus.map((sku) => (
                      <button
                        key={sku._id}
                        onClick={() => setSelectedSku(sku)}
                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                          selectedSku?._id === sku._id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {sku.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Còn lại: {sku.stock}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatPrice(sku.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Số lượng:
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="px-4 py-3 min-w-[4rem] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= (selectedSku?.stock || 1)}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSku?.stock || 0} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSku || selectedSku.stock === 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span>Thêm vào giỏ</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!selectedSku || selectedSku.stock === 0}
                    className="flex-1 bg-orange-500 text-white py-4 rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faBolt} />
                    <span>Mua ngay</span>
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faShare} />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 text-sm">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Bảo hành chính hãng</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FontAwesomeIcon icon={faTruck} className="text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Giao hàng nhanh</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FontAwesomeIcon icon={faUndo} className="text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">Đổi trả 7 ngày</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FontAwesomeIcon icon={faHeadset} className="text-orange-500" />
                  <span className="text-gray-600 dark:text-gray-400">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Tab Headers */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8 px-6">
                  {[
                    { id: 'description', label: 'Mô tả sản phẩm' },
                    { id: 'specifications', label: 'Thông số kỹ thuật' },
                    { id: 'reviews', label: 'Đánh giá' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                    </p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Thông số kỹ thuật sẽ được cập nhật sớm.
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <FontAwesomeIcon icon={faStar} className="text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Chưa có đánh giá nào cho sản phẩm này.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Zoom Modal */}
        {isImageZoomed && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setIsImageZoomed(false)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
              >
                ×
              </button>
              <img
                src={product.images?.[selectedImageIndex] || product.thumbnail}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
