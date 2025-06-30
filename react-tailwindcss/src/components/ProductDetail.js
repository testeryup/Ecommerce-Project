import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  faStore,
  faTag,
  faGift,
  faFire,
  faCrown,
  faBolt,
  faUsers,
  faThumbsUp,
  faInfo,
  faListAlt
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular
} from '@fortawesome/free-regular-svg-icons';
import Header from './Header';
import Footer from './Footer';
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
  const [activeTab, setActiveTab] = useState('description');

  // Sample product data for demo
  const sampleProduct = {
    _id: productId,
    name: "Netflix Premium 4K",
    description: "Trải nghiệm giải trí tốt nhất với Netflix Premium - xem phim 4K Ultra HD không giới hạn trên 4 thiết bị cùng lúc",
    category: "entertainment",
    subcategory: "Streaming",
    images: [
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1489599112332-130ced5de90e?w=600&h=600&fit=crop&crop=center"
    ],
    thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=600&fit=crop&crop=center",
    seller: { username: "OCTOPUS Store", _id: "seller1" },
    verified: true,
    rating: 4.8,
    reviews: 1250,
    featured: true,
    bestseller: true,
    sold: 2500,
    skus: [
      {
        _id: "sku1",
        name: "1 Tháng",
        price: 369000,
        originalPrice: 479000,
        stock: 100,
        status: "available"
      },
      {
        _id: "sku2", 
        name: "3 Tháng",
        price: 999000,
        originalPrice: 1437000,
        stock: 50,
        status: "available"
      },
      {
        _id: "sku3",
        name: "6 Tháng", 
        price: 1899000,
        originalPrice: 2874000,
        stock: 25,
        status: "available"
      },
      {
        _id: "sku4",
        name: "12 Tháng",
        price: 3599000,
        originalPrice: 5748000,
        stock: 15,
        status: "available"
      }
    ],
    features: [
      "Xem 4K Ultra HD",
      "4 thiết bị đồng thời", 
      "Tải xuống offline",
      "Không quảng cáo",
      "Nội dung độc quyền",
      "Hỗ trợ mọi thiết bị"
    ],
    longDescription: `Netflix Premium mang đến trải nghiệm giải trí đỉnh cao với chất lượng 4K Ultra HD crystal clear. 
    
    Với gói Premium, bạn có thể:
    • Xem phim và chương trình TV yêu thích với chất lượng 4K Ultra HD
    • Sử dụng đồng thời trên 4 thiết bị khác nhau
    • Tải xuống nội dung để xem offline
    • Truy cập toàn bộ thư viện Netflix với hàng nghìn bộ phim, series độc quyền
    • Không bị gián đoạn bởi quảng cáo
    • Hỗ trợ HDR và Dolby Atmos cho trải nghiệm âm thanh sống động`,
    specifications: {
      "Loại tài khoản": "Premium 4K",
      "Thời gian bảo hành": "30 ngày",
      "Số thiết bị": "4 thiết bị đồng thời",
      "Chất lượng": "4K Ultra HD + HDR", 
      "Tải xuống": "Có hỗ trợ",
      "Vùng": "Toàn cầu"
    },
    reviews_data: [
      {
        id: 1,
        user: "Minh Tuấn",
        rating: 5,
        comment: "Tài khoản chất lượng, hoạt động ổn định. Đã dùng 3 tháng rồi, rất hài lòng!",
        date: "2024-12-15"
      },
      {
        id: 2, 
        user: "Thu Hương",
        rating: 5,
        comment: "Giao hàng nhanh, tài khoản work ngon. Netflix 4K xem rất sướng!",
        date: "2024-12-10"
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(sampleProduct);
      setSelectedSku(sampleProduct.skus[0]);
      setLoading(false);
    }, 500);
  }, [productId]);

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
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-gray-300 dark:text-gray-600" />);
    }
    
    return stars;
  };

  const getDiscountPercentage = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Không tìm thấy sản phẩm
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
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
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Sản phẩm
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-300 truncate">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Quay lại</span>
          </button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <img
                  src={product.images?.[selectedImageIndex] || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-bold shadow-lg">
                      <FontAwesomeIcon icon={faCrown} className="mr-1" />
                      HOT
                    </span>
                  )}
                  {selectedSku?.originalPrice && selectedSku?.originalPrice > selectedSku?.price && (
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold shadow-lg">
                      -{getDiscountPercentage(selectedSku.originalPrice, selectedSku.price)}%
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500'
                  }`}
                >
                  <FontAwesomeIcon icon={isFavorite ? faHeart : faHeartRegular} />
                </button>
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain bg-gray-50 dark:bg-gray-800"
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
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {product.subcategory}
                  </span>
                  {product.verified && (
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-sm" />
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4 py-4 border-y border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  ({product.reviews} đánh giá)
                </span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <FontAwesomeIcon icon={faFire} className="mr-1" />
                  Đã bán {product.sold}
                </span>
              </div>

              {/* SKU Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Chọn gói dịch vụ:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.skus.map((sku) => (
                    <button
                      key={sku._id}
                      onClick={() => setSelectedSku(sku)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedSku?._id === sku._id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {sku.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(sku.price)}
                        </span>
                        {sku.originalPrice && sku.originalPrice > sku.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(sku.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Còn {sku.stock} sản phẩm
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
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
                    <span className="px-4 py-3 min-w-[60px] text-center font-semibold">
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
                  <span className="text-gray-600 dark:text-gray-400">
                    Còn lại: {selectedSku?.stock || 0} sản phẩm
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span>Thêm vào giỏ</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Mua ngay
                  </button>
                </div>
                
                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={faShare} />
                  <span>Chia sẻ sản phẩm</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Bảo hành</div>
                    <div className="text-gray-600 dark:text-gray-400">30 ngày</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faTruck} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Giao hàng</div>
                    <div className="text-gray-600 dark:text-gray-400">Tức thì</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faHeadset} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Hỗ trợ</div>
                    <div className="text-gray-600 dark:text-gray-400">24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
                <div className="relative glass p-8 rounded-3xl shadow-xl hover-lift">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl animate-bounce">{getCategoryIcon(product.category)}</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg animate-shimmer">
                        {product.subcategory}
                      </span>
                      {product.featured && (
                        <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-bold flex items-center shadow-lg animate-glow">
                          <FontAwesomeIcon icon={faCrown} className="mr-2 text-xs animate-spin" />
                          Nổi bật
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h1 className="text-4xl font-bold gradient-text mb-6 leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating and Reviews */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-3 glass px-4 py-2 rounded-full hover-lift">
                      <div className="flex space-x-1">
                        {renderStars(product.rating || 4.5)}
                      </div>
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        {product.rating || 4.5}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer">
                        <FontAwesomeIcon icon={faEye} />
                        <span>{product.reviews || 0} đánh giá</span>
                      </span>
                      <span className="flex items-center space-x-1 hover:text-orange-500 transition-colors cursor-pointer">
                        <FontAwesomeIcon icon={faFire} className="animate-pulse" />
                        <span>Đã bán {product.sold || 0}</span>
                      </span>
                    </div>
                  </div>

                  {/* Seller Info */}
                  {product.seller && (
                    <div className="flex items-center space-x-4 p-4 glass rounded-2xl hover-lift">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse">
                        <FontAwesomeIcon icon={faStore} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bán bởi</p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {product.seller.username || product.seller.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative glass p-8 rounded-3xl shadow-2xl hover-lift price-highlight">
                  {selectedSku ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl font-black gradient-text animate-shimmer">
                          {formatPrice(selectedSku.price)}
                        </span>
                        {selectedSku.originalPrice && selectedSku.originalPrice > selectedSku.price && (
                          <>
                            <span className="text-xl text-gray-400 line-through opacity-75">
                              {formatPrice(selectedSku.originalPrice)}
                            </span>
                            <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-lg animate-glow">
                              -{Math.round(((selectedSku.originalPrice - selectedSku.price) / selectedSku.originalPrice) * 100)}%
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full stock-pulse ${selectedSku.stock > 10 ? 'bg-green-500' : selectedSku.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {selectedSku.stock > 10 ? 'Còn nhiều' : selectedSku.stock > 0 ? `Chỉ còn ${selectedSku.stock} sản phẩm` : 'Hết hàng'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg text-gray-600 dark:text-gray-400">Liên hệ để biết giá</p>
                  )}
                </div>
              </div>

              {/* SKU Selection */}
              {product.skus && product.skus.length > 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={faGift} className="mr-3 text-purple-500" />
                    Chọn phiên bản:
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {product.skus.map((sku) => (
                      <button
                        key={sku._id}
                        onClick={() => setSelectedSku(sku)}
                        className={`group relative p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:scale-105 ${
                          selectedSku?._id === sku._id
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-xl ring-4 ring-blue-200 dark:ring-blue-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                              {sku.name}
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${sku.stock > 10 ? 'bg-green-500' : sku.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {sku.stock > 10 ? 'Còn nhiều' : sku.stock > 0 ? `Còn ${sku.stock}` : 'Hết hàng'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                              {formatPrice(sku.price)}
                            </p>
                            {sku.originalPrice && sku.originalPrice > sku.price && (
                              <p className="text-sm text-gray-400 line-through">
                                {formatPrice(sku.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                        {selectedSku?._id === sku._id && (
                          <div className="absolute top-3 right-3">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-xl" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FontAwesomeIcon icon={faBolt} className="mr-3 text-yellow-500" />
                  Số lượng:
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-l-2xl group"
                    >
                      <FontAwesomeIcon icon={faMinus} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <span className="px-8 py-4 min-w-[5rem] text-center font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= (selectedSku?.stock || 1)}
                      className="p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-r-2xl group"
                    >
                      <FontAwesomeIcon icon={faPlus} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${(selectedSku?.stock || 0) > 10 ? 'bg-green-500' : (selectedSku?.stock || 0) > 0 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {(selectedSku?.stock || 0) > 10 ? 'Còn nhiều sản phẩm' : `${selectedSku?.stock || 0} sản phẩm có sẵn`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSku || selectedSku.stock === 0}
                    className="btn-ripple group flex-1 relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-5 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover-lift"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                    <FontAwesomeIcon icon={faShoppingCart} className="group-hover:animate-bounce" />
                    <span>Thêm vào giỏ</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!selectedSku || selectedSku.stock === 0}
                    className="btn-ripple group flex-1 relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-5 rounded-2xl hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover-lift"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                    <FontAwesomeIcon icon={faBolt} className="group-hover:animate-pulse" />
                    <span>Mua ngay</span>
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button className="btn-ripple group flex-1 relative overflow-hidden glass py-4 rounded-2xl text-gray-700 dark:text-gray-300 transition-all duration-300 font-medium flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 hover-lift">
                    <FontAwesomeIcon icon={faShare} className="group-hover:rotate-12 transition-transform" />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t-2 border-gray-200/50 dark:border-gray-700/50">
                <div className="group feature-item flex items-center space-x-4 p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-white group-hover:animate-pulse" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Bảo hành chính hãng</span>
                </div>
                <div className="group feature-item flex items-center space-x-4 p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                    <FontAwesomeIcon icon={faTruck} className="text-white group-hover:animate-bounce" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Giao hàng nhanh</span>
                </div>
                <div className="group feature-item flex items-center space-x-4 p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <FontAwesomeIcon icon={faUndo} className="text-white group-hover:animate-spin" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Đổi trả 7 ngày</span>
                </div>
                <div className="group feature-item flex items-center space-x-4 p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
                    <FontAwesomeIcon icon={faHeadset} className="text-white group-hover:animate-pulse" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                {/* Tab Headers */}
                <div className="relative border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/50"></div>
                  <div className="relative flex space-x-8 px-8">
                    {[
                      { id: 'description', label: 'Mô tả sản phẩm', icon: faTag },
                      { id: 'specifications', label: 'Thông số kỹ thuật', icon: faCheckCircle },
                      { id: 'reviews', label: 'Đánh giá', icon: faStar }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group flex items-center space-x-3 py-6 px-4 border-b-4 font-bold text-sm transition-all duration-300 hover:scale-105 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 rounded-t-2xl'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-t-2xl'
                        }`}
                      >
                        <FontAwesomeIcon 
                          icon={tab.icon} 
                          className={`${activeTab === tab.id ? 'animate-pulse' : 'group-hover:animate-bounce'} transition-all`}
                        />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {activeTab === 'description' && (
                    <div className="prose dark:prose-invert max-w-none tab-content">
                      <div className="glass p-6 rounded-2xl hover-lift">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specifications' && (
                    <div className="space-y-6 tab-content">
                      <div className="text-center py-12 glass rounded-2xl hover-lift">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-blue-400 mb-6 animate-pulse" />
                        <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                          Thông số kỹ thuật sẽ được cập nhật sớm.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-8 tab-content">
                      <div className="text-center py-16 glass rounded-2xl hover-lift">
                        <div className="flex justify-center space-x-2 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon 
                              key={i} 
                              icon={faStar} 
                              className="text-4xl text-yellow-400 animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                        <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                          Chưa có đánh giá nào cho sản phẩm này.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          Hãy là người đầu tiên đánh giá sản phẩm này!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Zoom Modal */}
        {isImageZoomed && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative max-w-6xl max-h-full">
              <button
                onClick={() => setIsImageZoomed(false)}
                className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                ×
              </button>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                <img
                  src={product.images?.[selectedImageIndex] || product.thumbnail}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
