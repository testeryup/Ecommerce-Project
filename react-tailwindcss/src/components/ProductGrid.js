import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCrown, faPlay, faDesktop, faMusic, faBolt, faGamepad,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';
import ProductGridSkeleton from './ProductGridSkeleton';
import ProductCard from './ProductCard';
import productService from '../services/productService';

const ProductGrid = ({ filters = {}, onProductClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cache để tránh fetch lại dữ liệu
  const [productCache, setProductCache] = useState({});

  // Categories based on subscription services - Clean design
  const categories = [
    { id: 'all', name: 'Tất cả', icon: faCrown, color: 'bg-blue-600' },
    { id: 'entertainment', name: 'Giải trí', icon: faPlay, color: 'bg-red-500' },
    { id: 'productivity', name: 'Năng suất', icon: faDesktop, color: 'bg-blue-500' },
    { id: 'music', name: 'Âm nhạc', icon: faMusic, color: 'bg-green-500' },
    { id: 'creative', name: 'Sáng tạo', icon: faBolt, color: 'bg-yellow-500' },
    { id: 'gaming', name: 'Trò chơi', icon: faGamepad, color: 'bg-purple-500' }
  ];

  // Fetch products from backend with caching and debouncing
  useEffect(() => {
    // Check cache first
    if (productCache[activeFilter]) {
      setProducts(productCache[activeFilter]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Debounce để tránh gọi API quá nhiều lần
    const timeoutId = setTimeout(async () => {
      try {
        let response;
        if (activeFilter === 'all') {
          response = await productService.getProducts();
        } else {
          response = await productService.getProductsByCategory(activeFilter);
        }
        
        // axios interceptor returns response.data, which should be {errCode, data}
        if (response && response.errCode === 0) {
          const productData = response.data || [];
          setProducts(productData);
          // Cache the result
          setProductCache(prev => ({
            ...prev,
            [activeFilter]: productData
          }));
        } else {
          setError(response?.message || 'Không thể tải sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    }, 300); // Tăng debounce time lên 300ms

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [activeFilter]); // Bỏ productCache khỏi dependency để tránh infinite loop

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (activeFilter === 'all') return true;
      return product.category === activeFilter;
    });
  }, [products, activeFilter]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const aPrice = a.skus && a.skus.length > 0 ? Math.min(...a.skus.map(sku => sku.price)) : 0;
          const bPrice = b.skus && b.skus.length > 0 ? Math.min(...b.skus.map(sku => sku.price)) : 0;
          return aPrice - bPrice;
        case 'price-high':
          const aPriceHigh = a.skus && a.skus.length > 0 ? Math.min(...a.skus.map(sku => sku.price)) : 0;
          const bPriceHigh = b.skus && b.skus.length > 0 ? Math.min(...b.skus.map(sku => sku.price)) : 0;
          return bPriceHigh - aPriceHigh;
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
  }, [filteredProducts, sortBy]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Khám phá các dịch vụ và tài khoản premium được yêu thích nhất
            </p>
          </div>
          
          {/* Show category filters */}
          <div className="mb-8">
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
          
          <ProductGridSkeleton count={8} />
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
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
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

export default memo(ProductGrid);
