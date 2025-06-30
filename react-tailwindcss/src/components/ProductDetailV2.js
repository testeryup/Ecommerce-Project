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
import { userGetProductById } from '../services/userService';
import toast from 'react-hot-toast';

const ProductDetailV2 = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imageZoomed, setImageZoomed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching product with ID:', productId);
        const response = await userGetProductById(productId);
        console.log('Full API response:', response);
        
        // Kiểm tra cấu trúc response
        if (response && response.data) {
          console.log('Response data:', response.data);
          
          // Kiểm tra các cấu trúc response có thể có
          let productData = null;
          
          if (response.data.errCode === 0 && response.data.data) {
            // Cấu trúc: { errCode: 0, data: {...} }
            productData = response.data.data;
          } else if (response.data.data && response.data.data.data) {
            // Cấu trúc: { data: { data: {...} } }
            productData = response.data.data.data;
          } else if (response.data._id) {
            // Response trực tiếp là product data
            productData = response.data;
          }
          
          if (productData && productData._id) {
            console.log('Product data:', productData);
            setProduct(productData);
            
            // Set SKU mặc định nếu có
            if (productData.skus && productData.skus.length > 0) {
              setSelectedSku(productData.skus[0]);
            }
          } else {
            console.log('API response không có product data hợp lệ:', response.data);
            setError('Không thể tải thông tin sản phẩm - Dữ liệu không hợp lệ');
          }
        } else {
          console.log('Response không có data:', response);
          setError('Không thể tải thông tin sản phẩm - Response không hợp lệ');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        console.error('Error response:', err.response);
        
        if (err.response?.status === 404) {
          setError('Sản phẩm không tồn tại');
        } else if (err.response?.status === 500) {
          setError('Lỗi máy chủ, vui lòng thử lại sau');
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
          setError(`Lỗi khi tải sản phẩm: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
      toast.error('Vui lòng chọn gói dịch vụ');
      return;
    }
    
    dispatch(addToCart({
      product: product,
      sku: selectedSku,
      quantity: quantity
    }));
    
    setShowSuccessMessage(true);
    toast.success('Đã thêm vào giỏ hàng!');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
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

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Đang tải sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Lỗi tải sản phẩm
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {error}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Quay lại
              </button>
            </div>
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
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Sản phẩm
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
              <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg border border-green-400 animate-slide-down">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <p className="font-semibold">Thành công!</p>
                    <p className="text-sm opacity-90">Sản phẩm đã được thêm vào giỏ hàng</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors duration-200 group"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Quay lại</span>
          </button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200 group">
                <img
                  src={product.images?.[selectedImageIndex] || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                  onClick={() => setImageZoomed(true)}
                />
                
                {/* Image Navigation */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <FontAwesomeIcon icon={faChevronRight} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold shadow-lg">
                      HOT
                    </span>
                  )}
                </div>

                {/* Favorite & Zoom Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-10 h-10 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-200 ${
                      isFavorite 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:text-red-500'
                    }`}
                  >
                    <FontAwesomeIcon icon={isFavorite ? faHeart : faHeartRegular} />
                  </button>
                  <button
                    onClick={() => setImageZoomed(true)}
                    className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faExpand} />
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
                          ? 'border-blue-500 shadow-lg scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover bg-gray-50 dark:bg-gray-800"
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {product.subcategory}
                  </span>
                  {product.seller?.verified && (
                    <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Đã xác minh</span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rating & Stats */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  {product.rating ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        ({product.reviews || 0} đánh giá)
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Chưa có đánh giá
                    </span>
                  )}
                </div>
                {product.sold && (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <FontAwesomeIcon icon={faFire} />
                    <span className="text-sm font-medium">Đã bán {product.sold}</span>
                  </div>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faStore} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bán bởi</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {product.seller?.username}
                  </p>
                </div>
              </div>

              {/* Price Display */}
              {selectedSku ? (
                <div className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-indigo-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent dark:from-blue-600/20 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="relative">
                    <div className="flex items-baseline space-x-3 mb-3">
                      <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(selectedSku.price)}
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(selectedSku.price * 1.2)}
                      </span>
                      <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full font-medium">
                        -17%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedSku.stock > 10 ? 'bg-green-500' : 
                          selectedSku.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {selectedSku.stock > 10 ? 'Còn nhiều sản phẩm' : 
                           selectedSku.stock > 0 ? `Chỉ còn ${selectedSku.stock} sản phẩm` : 'Hết hàng'}
                        </span>
                      </div>
                      {selectedSku.stock > 0 && selectedSku.stock <= 5 && (
                        <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full font-medium animate-pulse">
                          Sắp hết hàng!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Vui lòng chọn gói dịch vụ để xem giá
                  </p>
                </div>
              )}

              {/* SKU Selection */}
              {product.skus && product.skus.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    </div>
                    Chọn gói dịch vụ:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.skus.map((sku, index) => (
                      <button
                        key={sku._id}
                        onClick={() => setSelectedSku(sku)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md relative ${
                          selectedSku?._id === sku._id
                            ? 'border-blue-500 bg-white dark:bg-gray-700 shadow-lg ring-2 ring-blue-200 dark:ring-blue-700'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                        } ${sku.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={sku.stock === 0}
                      >
                        {selectedSku?._id === sku._id && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {sku.name}
                          </span>
                          {index === 0 && (
                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
                              Phổ biến
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatPrice(sku.price)}
                          </span>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            sku.stock > 10 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                              : sku.stock > 0 
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {sku.stock > 10 ? `${sku.stock}+` : 
                             sku.stock > 0 ? `Còn ${sku.stock}` : 'Hết hàng'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart Section */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                {/* Quantity Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                    </div>
                    Số lượng:
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 shadow-sm">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        disabled={quantity <= 1}
                        className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-xl flex items-center justify-center text-gray-600 dark:text-gray-300"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="px-6 py-3 min-w-[100px] text-center font-bold text-lg border-x-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                        {quantity}
                      </div>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        disabled={quantity >= (selectedSku?.stock || 1)}
                        className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-xl flex items-center justify-center text-gray-600 dark:text-gray-300"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    {selectedSku && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Tối đa: {selectedSku.stock} sản phẩm
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Price Display */}
                {selectedSku && (
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(selectedSku.price * quantity)}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSku || selectedSku.stock === 0}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="group-hover:scale-110 transition-transform" />
                      <span>Thêm vào giỏ</span>
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={!selectedSku || selectedSku.stock === 0}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Mua ngay
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`flex-1 border-2 py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md ${
                        isFavorite 
                          ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FontAwesomeIcon icon={isFavorite ? faHeart : faHeartRegular} />
                      <span>{isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
                    </button>
                    <button className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md">
                      <FontAwesomeIcon icon={faShare} />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Features */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-purple-600 dark:text-purple-400 text-xs" />
                  </div>
                  Dịch vụ đi kèm
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 text-sm p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 dark:text-green-400 text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Bảo hành</div>
                      <div className="text-green-600 dark:text-green-400 font-medium">30 ngày</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faTruck} className="text-blue-600 dark:text-blue-400 text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Giao hàng</div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">Tức thì</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm p-3 bg-white dark:bg-gray-700 rounded-lg border border-yellow-200 dark:border-yellow-700 hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUndo} className="text-yellow-600 dark:text-yellow-400 text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Đổi trả</div>
                      <div className="text-yellow-600 dark:text-yellow-400 font-medium">7 ngày</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm p-3 bg-white dark:bg-gray-700 rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faHeadset} className="text-purple-600 dark:text-purple-400 text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Hỗ trợ</div>
                      <div className="text-purple-600 dark:text-purple-400 font-medium">24/7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                {[
                  { id: 'description', label: 'Mô tả sản phẩm' },
                  { id: 'specifications', label: 'Thông số kỹ thuật' },
                  { id: 'features', label: 'Tính năng' },
                  { id: 'reviews', label: 'Đánh giá' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {product.longDescription || product.description}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-4 px-5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow">
                          <span className="font-semibold text-gray-900 dark:text-white">{key}</span>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">Thông số kỹ thuật sẽ được cập nhật sớm</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-4">
                  {product.features && product.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all hover:scale-[1.01]">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FontAwesomeIcon icon={faStar} className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">Tính năng chi tiết sẽ được cập nhật sớm</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {product.reviews_data?.length > 0 ? (
                    product.reviews_data.map((review) => (
                      <div key={review.id} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {review.user.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{review.user}</p>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FontAwesomeIcon icon={faStar} className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">Chưa có đánh giá nào</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                        Hãy là người đầu tiên đánh giá sản phẩm này!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Zoom Modal */}
        {imageZoomed && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setImageZoomed(false)}>
            <div className="relative max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setImageZoomed(false)}
                className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors duration-200 bg-white/10 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
              <img
                src={product.images?.[selectedImageIndex] || product.thumbnail}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailV2;
