import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faShoppingCart, 
  faHeart, 
  faEye,
  faTag,
  faCrown,
  faFire,
  faShield
} from '@fortawesome/free-solid-svg-icons';

const ProductCard = memo(({ product, viewMode = 'grid' }) => {
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }, []);

  const getMinPrice = useCallback(() => {
    if (product.skus && product.skus.length > 0) {
      return Math.min(...product.skus.map(sku => sku.price));
    }
    return product.price || 0;
  }, [product.skus, product.price]);

  const getDiscountPercentage = useCallback(() => {
    const minPrice = getMinPrice();
    if (product.originalPrice && minPrice < product.originalPrice) {
      return Math.round(((product.originalPrice - minPrice) / product.originalPrice) * 100);
    }
    return 0;
  }, [product.originalPrice, getMinPrice]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Adding to cart:', product);
  }, [product]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle favorite:', product);
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

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
        <div className="flex items-center p-6 space-x-6">
          {/* Product Image */}
          <Link to={`/product/${product._id}`} className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl overflow-hidden">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faTag} className="text-2xl text-gray-400" />
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{getCategoryIcon(product.category)}</span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                {product.subcategory}
              </span>
              {product.featured && (
                <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full flex items-center">
                  <FontAwesomeIcon icon={faCrown} className="mr-1" />
                  Nổi bật
                </span>
              )}
            </div>
            
            <Link to={`/product/${product._id}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
                {product.name}
              </h3>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {product.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({product.reviews} đánh giá)
                </span>
              </div>
              {product.verified && (
                <div className="flex items-center space-x-1 text-green-600">
                  <FontAwesomeIcon icon={faShield} className="text-xs" />
                  <span className="text-xs font-medium">Đã xác minh</span>
                </div>
              )}
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex-shrink-0 text-right">
            <div className="mb-4">
              <div className="flex items-center justify-end space-x-2 mb-1">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(getMinPrice())}
                </span>
                {getDiscountPercentage() > 0 && (
                  <span className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full font-medium">
                    -{getDiscountPercentage()}%
                  </span>
                )}
              </div>
              {product.originalPrice && getDiscountPercentage() > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleFavorite}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                title="Thêm vào yêu thích"
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
                <span>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
               onClick={() => console.log('Clicking product image, navigating to:', `/product/${product._id}`)}>
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FontAwesomeIcon icon={faTag} className="text-4xl text-gray-400" />
              </div>
            )}
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {getDiscountPercentage() > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium shadow-lg">
              -{getDiscountPercentage()}%
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium shadow-lg flex items-center">
              <FontAwesomeIcon icon={faCrown} className="mr-1" />
              Nổi bật
            </span>
          )}
          {product.bestseller && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium shadow-lg flex items-center">
              <FontAwesomeIcon icon={faFire} className="mr-1" />
              Bán chạy
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleToggleFavorite}
            className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors duration-200"
            title="Thêm vào yêu thích"
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <Link
            to={`/product/${product._id}`}
            className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20 transition-colors duration-200"
            title="Xem chi tiết"
          >
            <FontAwesomeIcon icon={faEye} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Category and Verification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCategoryIcon(product.category)}</span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              {product.subcategory}
            </span>
          </div>
          {product.verified && (
            <div className="flex items-center space-x-1 text-green-600">
              <FontAwesomeIcon icon={faShield} className="text-xs" />
              <span className="text-xs font-medium">Xác minh</span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          {product.createdAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Ngày thêm: {formatDate(product.createdAt)}</p>
          )}
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews} đánh giá)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(getMinPrice())}
              </span>
              {getDiscountPercentage() > 0 && (
                <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full font-medium">
                  -{getDiscountPercentage()}%
                </span>
              )}
            </div>
            {product.originalPrice && getDiscountPercentage() > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg group/button"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="text-sm group-hover/button:scale-110 transition-transform duration-200" />
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
