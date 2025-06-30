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
  faStore,
  faFire,
  faExpand,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular
} from '@fortawesome/free-regular-svg-icons';
import Header from './Header';
import Footer from './Footer';
import { addToCart } from '../features/cart/cartSlice';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const ProductDetailNew = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imageZoomed, setImageZoomed] = useState(false);

  // Sample product data
  const sampleProduct = {
    _id: productId,
    name: "Netflix Premium 4K Ultra HD",
    description: "Trải nghiệm giải trí đỉnh cao với Netflix Premium - xem phim 4K Ultra HD không giới hạn trên 4 thiết bị cùng lúc",
    category: "entertainment",
    subcategory: "Streaming Service",
    images: [
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1489599112332-130ced5de90e?w=800&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop&crop=center"
    ],
    thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=800&fit=crop&crop=center",
    seller: { username: "OCTOPUS Digital Store", verified: true },
    rating: 4.8,
    reviews: 1847,
    sold: 3250,
    featured: true,
    skus: [
      {
        _id: "sku1",
        name: "1 Tháng",
        price: 369000,
        originalPrice: 479000,
        stock: 50,
        status: "available"
      },
      {
        _id: "sku2", 
        name: "3 Tháng",
        price: 999000,
        originalPrice: 1437000,
        stock: 30,
        status: "available"
      },
      {
        _id: "sku3",
        name: "6 Tháng", 
        price: 1899000,
        originalPrice: 2874000,
        stock: 15,
        status: "available"
      },
      {
        _id: "sku4",
        name: "12 Tháng",
        price: 3599000,
        originalPrice: 5748000,
        stock: 8,
        status: "available"
      }
    ],
    features: [
      "Chất lượng 4K Ultra HD",
      "Xem trên 4 thiết bị cùng lúc", 
      "Tải xuống để xem offline",
      "Không có quảng cáo",
      "Nội dung độc quyền Netflix",
      "Hỗ trợ HDR & Dolby Atmos"
    ],
    longDescription: `Netflix Premium mang đến trải nghiệm giải trí đỉnh cao với chất lượng hình ảnh 4K Ultra HD crystal clear và âm thanh Dolby Atmos sống động.

Tính năng nổi bật:
• Xem phim và chương trình TV yêu thích với chất lượng 4K Ultra HD
• Sử dụng đồng thời trên 4 thiết bị khác nhau (TV, máy tính, điện thoại, tablet)
• Tải xuống nội dung để xem offline khi không có internet
• Truy cập toàn bộ thư viện Netflix với hàng nghìn bộ phim, series độc quyền
• Không bị gián đoạn bởi quảng cáo
• Hỗ trợ HDR và Dolby Atmos cho trải nghiệm âm thanh - hình ảnh tuyệt vời

Phù hợp cho gia đình hoặc nhóm bạn muốn chia sẻ tài khoản chất lượng cao.`,
    specifications: {
      "Loại tài khoản": "Premium 4K",
      "Chất lượng video": "4K Ultra HD + HDR", 
      "Số thiết bị đồng thời": "4 thiết bị",
      "Tải xuống": "Có hỗ trợ",
      "Âm thanh": "Dolby Atmos",
      "Vùng sử dụng": "Toàn cầu",
      "Bảo hành": "30 ngày đổi trả"
    },
    reviews_data: [
      {
        id: 1,
        user: "Minh Tuấn",
        rating: 5,
        comment: "Tài khoản Netflix Premium chất lượng tuyệt vời! Đã sử dụng được 6 tháng, xem 4K rất mượt mà và sắc nét. Giao hàng nhanh, hỗ trợ tận tình. Rất recommend!",
        date: "2024-12-20"
      },
      {
        id: 2, 
        user: "Thu Hương",
        rating: 5,
        comment: "Mình rất hài lòng với chất lượng dịch vụ. Netflix 4K xem trên TV 65 inch nhà mình cực đã! Âm thanh Dolby Atmos cũng rất hay. Sẽ mua tiếp gói dài hạn.",
        date: "2024-12-18"
      },
      {
        id: 3,
        user: "Đức Anh", 
        rating: 4,
        comment: "Tài khoản hoạt động ổn định, có thể xem đồng thời 4 thiết bị như mô tả. Chỉ có điều đôi khi load hơi chậm vào giờ cao điểm, nhưng nhìn chung rất ok.",
        date: "2024-12-15"
      }
    ]
  };
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

          {/* Product Details Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'description', label: 'Mô tả', icon: faInfo },
                { id: 'features', label: 'Tính năng', icon: faListAlt },
                { id: 'specifications', label: 'Thông số', icon: faTag },
                { id: 'reviews', label: 'Đánh giá', icon: faUsers }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Mô tả chi tiết
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tính năng nổi bật
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Thông số kỹ thuật
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <span className="font-medium text-gray-900 dark:text-white">{key}:</span>
                        <span className="text-gray-600 dark:text-gray-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Đánh giá khách hàng
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {product.rating}/5
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ({product.reviews} đánh giá)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {product.reviews_data.map((review) => (
                      <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {review.user.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {review.user}
                              </div>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
