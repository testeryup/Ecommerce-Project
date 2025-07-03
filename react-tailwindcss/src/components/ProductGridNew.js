import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCrown, faPlay, faDesktop, faMusic, faBolt, faGamepad,
  faSort, faStar, faStarHalfAlt, faEye, faShoppingCart, 
  faHeart, faShield, faCheckCircle, faFire
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';
import productService from '../services/productService';

const ProductGrid = ({ filters = {}, onProductClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories based on subscription services - Clean design
  const categories = [
    { id: 'all', name: 'Tất cả', icon: faCrown, color: 'bg-blue-600' },
    { id: 'entertainment', name: 'Giải trí', icon: faPlay, color: 'bg-red-500' },
    { id: 'productivity', name: 'Năng suất', icon: faDesktop, color: 'bg-blue-500' },
    { id: 'music', name: 'Âm nhạc', icon: faMusic, color: 'bg-green-500' },
    { id: 'creative', name: 'Sáng tạo', icon: faBolt, color: 'bg-yellow-500' },
    { id: 'gaming', name: 'Trò chơi', icon: faGamepad, color: 'bg-purple-500' }
  ];

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (activeFilter === 'all') {
          response = await productService.getProducts();
        } else {
          response = await productService.getProductsByCategory(activeFilter);
        }
        
        if (response.errCode === 0) {
          setProducts(response.data || []);
        } else {
          setError(response.message || 'Không thể tải sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilter]);

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true;
    return product.category === activeFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.minPrice || 0) - (b.minPrice || 0);
      case 'price-high':
        return (b.minPrice || 0) - (a.minPrice || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'bestseller':
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
      default: // featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const getMinPrice = (skus) => {
    if (!skus || skus.length === 0) return 0;
    return Math.min(...skus.map(sku => sku.price));
  };

  const getDiscountPercentage = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalStock = (skus) => {
    if (!skus || skus.length === 0) return 0;
    return skus.reduce((total, sku) => total + sku.stock, 0);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-400" />
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 dark:text-gray-300 mt-4">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá các dịch vụ và tài khoản premium được yêu thích nhất
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8">
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`group relative flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeFilter === category.id
                      ? `${category.color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105 hover:shadow-md hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={category.icon} 
                    className="mr-2 text-sm" 
                  />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Tìm thấy {sortedProducts.length} sản phẩm
              </span>
              {activeFilter !== 'all' && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  trong {categories.find(c => c.id === activeFilter)?.name}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faSort} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="featured">Nổi bật</option>
                <option value="bestseller">Bán chạy nhất</option>
                <option value="price-low">Giá: Thấp đến cao</option>
                <option value="price-high">Giá: Cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => {
            const minPrice = getMinPrice(product.skus);
            const discountPercentage = getDiscountPercentage(minPrice, product.originalPrice);
            const totalStock = getTotalStock(product.skus);
            const seller = Array.isArray(product.seller) ? product.seller[0] : product.seller;

            return (
              <div key={product._id} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-2 overflow-hidden">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img 
                    src={product.thumbnail || product.images?.[0] || '/api/placeholder/400/300'} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <FontAwesomeIcon icon={faCrown} className="mr-1 text-xs" />
                        Nổi bật
                      </span>
                    )}
                    {product.bestseller && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <FontAwesomeIcon icon={faFire} className="mr-1 text-xs" />
                        Hot
                      </span>
                    )}
                  </div>

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full font-bold">
                        -{discountPercentage}%
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Seller Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FontAwesomeIcon icon={faShield} className="mr-1 text-green-500" />
                      <span>{seller?.username || 'OCTOPUS Store'}</span>
                    </div>
                    {product.verified && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-sm" />
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Product Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating || 4.5)}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {product.rating || 4.5}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({product.reviews || 0} đánh giá)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(minPrice)}
                      </span>
                      {product.originalPrice && discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    {product.skus && product.skus.length > 1 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Từ {product.skus.length} gói khác nhau
                      </p>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {totalStock > 0 ? (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ Còn {totalStock} sản phẩm
                      </span>
                    ) : (
                      <span className="text-sm text-red-500 font-medium">
                        ✗ Hết hàng
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/products/${product._id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-center transition-all duration-200 flex items-center justify-center group/btn"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    Xem chi tiết
                    <FontAwesomeIcon 
                      icon={faEye} 
                      className="ml-2 group-hover/btn:translate-x-1 transition-transform" 
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm điều khác
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Hiện tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
