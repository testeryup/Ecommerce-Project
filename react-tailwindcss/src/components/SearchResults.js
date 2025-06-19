import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faSort,
  faStar,
  faShoppingCart,
  faHeart,
  faEye,
  faPlay,
  faDesktop,
  faMusic,
  faShield,
  faGraduationCap,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Footer from './Footer';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const categories = [
    { id: 'all', name: 'Tất cả', icon: faSearch },
    { id: 'entertainment', name: 'Giải trí', icon: faPlay },
    { id: 'productivity', name: 'Năng suất', icon: faDesktop },
    { id: 'music', name: 'Âm nhạc', icon: faMusic },
    { id: 'security', name: 'Bảo mật', icon: faShield },
    { id: 'education', name: 'Giáo dục', icon: faGraduationCap },
    { id: 'gaming', name: 'Gaming', icon: faGamepad }
  ];

  // Sample search results
  const sampleResults = [
    {
      _id: "1",
      name: "Netflix Premium",
      description: "Xem phim 4K Ultra HD với 4 màn hình đồng thời",
      category: "entertainment",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 1250,
      price: 369000,
      originalPrice: 450000,
      discount: 18,
      featured: true
    },
    {
      _id: "2",
      name: "Spotify Premium",
      description: "Nghe nhạc không giới hạn, chất lượng cao",
      category: "music",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 2341,
      price: 239000,
      originalPrice: 299000,
      discount: 20
    },
    {
      _id: "3",
      name: "Microsoft Office 365",
      description: "Bộ ứng dụng văn phòng hoàn chỉnh",
      category: "productivity",
      image: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 1876,
      price: 1679000,
      originalPrice: 2099000,
      discount: 20
    }
  ];

  useEffect(() => {
    // Simulate search API call
    setLoading(true);
    setTimeout(() => {
      const filtered = sampleResults.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                           product.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesQuery && matchesCategory;
      });
      setResults(filtered);
      setLoading(false);
    }, 800);
  }, [query, filterCategory]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (productId) => {
    // Handle add to cart logic
    console.log('Add to cart:', productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tìm kiếm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Kết quả tìm kiếm cho "{query}"
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tìm thấy {results.length} sản phẩm
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Bộ lọc
              </h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Danh mục
                </h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setFilterCategory(category.id)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                        filterCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FontAwesomeIcon icon={category.icon} className="text-sm" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faSort} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="relevance">Liên quan nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <div key={product._id} className="group">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
                      {/* Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Discount Badge */}
                        {product.discount && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                              -{product.discount}%
                            </span>
                          </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <FontAwesomeIcon icon={faHeart} className="text-gray-600 dark:text-gray-400 text-sm" />
                          </button>
                          <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <FontAwesomeIcon icon={faEye} className="text-gray-600 dark:text-gray-400 text-sm" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            ({product.reviews} đánh giá)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => handleAddToCart(product._id)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
                          <span>Thêm vào giỏ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faSearch} className="text-6xl text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thử tìm kiếm với từ khóa khác hoặc xem các sản phẩm phổ biến
                </p>
                <button 
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
