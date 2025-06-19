import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSort, 
  faStar, 
  faHeart,
  faShoppingCart,
  faEye,
  faPlay,
  faDesktop,
  faMusic,
  faShield,
  faCrown,
  faBolt,
  faGamepad,
  faPercent,
  faCheckCircle,
  faFire,
  faStarHalfAlt
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';

const ProductGrid = ({ filters = {}, onProductClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories based on subscription services
  const categories = [
    { id: 'all', name: 'Tất cả danh mục', icon: faCrown, color: 'bg-gradient-to-r from-purple-500 to-blue-500' },
    { id: 'entertainment', name: 'Giải trí', icon: faPlay, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { id: 'productivity', name: 'Năng suất', icon: faDesktop, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'music', name: 'Âm nhạc', icon: faMusic, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'creative', name: 'Công cụ sáng tạo', icon: faBolt, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 'gaming', name: 'Trò chơi', icon: faGamepad, color: 'bg-gradient-to-r from-pink-500 to-purple-500' }
  ];

  // Updated sample products for subscription services
  const sampleProducts = [
    {
      _id: "1",
      name: "Netflix Premium",
      description: "Xem phim 4K Ultra HD với 4 màn hình đồng thời và tải xuống offline",
      category: "entertainment",
      subcategory: "Streaming",
      images: ["https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.8,
      reviews: 1250,
      featured: true,
      bestseller: true,
      skus: [
        {
          _id: "sku1",
          name: "1 Tháng",
          price: 369000,
          stock: 50,
          status: "available"
        },
        {
          _id: "sku2", 
          name: "3 Tháng",
          price: 959000,
          stock: 30,
          status: "available",
          discount: 15
        }
      ],
      features: ["4K Ultra HD", "4 Màn hình", "Tải xuống offline", "Không quảng cáo"],
      originalPrice: 479000
    },
    {
      _id: "2",
      name: "Microsoft Office 365",
      description: "Bộ ứng dụng văn phòng hoàn chỉnh với Word, Excel, PowerPoint và lưu trữ đám mây",
      category: "productivity",
      subcategory: "Microsoft",
      images: ["https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.9,
      reviews: 892,
      featured: true,
      bestseller: false,
      skus: [
        {
          _id: "sku3",
          name: "1 Năm - Cá nhân",
          price: 1679000,
          stock: 25,
          status: "available"
        },
        {
          _id: "sku4",
          name: "1 Năm - Gia đình",
          price: 2399000,
          stock: 15,
          status: "available"
        }
      ],
      features: ["Word, Excel, PowerPoint", "1TB OneDrive", "Nhiều thiết bị", "Cập nhật thường xuyên"],
      originalPrice: 3359000
    },
    {
      _id: "3",
      name: "Spotify Premium",
      description: "Nghe nhạc không giới hạn với chất lượng cao và không quảng cáo",
      category: "music",
      subcategory: "Streaming Âm nhạc",
      images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.7,
      reviews: 2341,
      featured: true,
      bestseller: true,
      skus: [
        {
          _id: "sku5",
          name: "1 Tháng",
          price: 239000,
          stock: 100,
          status: "available"
        },
        {
          _id: "sku6",
          name: "6 Tháng",
          price: 1199000,
          stock: 45,
          status: "available",
          discount: 17
        }
      ],
      features: ["Chất lượng cao", "Không quảng cáo", "Tải xuống offline", "Bỏ qua không giới hạn"],
      originalPrice: 311000
    },
    {
      _id: "4",
      name: "Adobe Creative Cloud",
      description: "Bộ công cụ sáng tạo hoàn chỉnh với Photoshop, Illustrator, Premiere Pro và nhiều hơn nữa",
      category: "creative",
      subcategory: "Phần mềm thiết kế",
      images: ["https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.8,
      reviews: 1876,
      featured: true,
      bestseller: false,
      skus: [
        {
          _id: "sku7",
          name: "1 Tháng - Tất cả ứng dụng",
          price: 1271000,
          stock: 20,
          status: "available"
        },
        {
          _id: "sku8",
          name: "1 Năm - Tất cả ứng dụng",
          price: 14397000,
          stock: 15,
          status: "available",
          discount: 5
        }
      ],
      features: ["20+ Ứng dụng sáng tạo", "100GB Lưu trữ đám mây", "Font chữ cao cấp", "Website portfolio"],
      originalPrice: 1918000
    },
    {
      _id: "5",
      name: "Xbox Game Pass Ultimate",
      description: "Truy cập 100+ trò chơi chất lượng cao cho console, PC và cloud gaming",
      category: "gaming",
      subcategory: "Đăng ký Gaming",
      images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.9,
      reviews: 3245,
      featured: true,
      bestseller: true,
      skus: [
        {
          _id: "sku9",
          name: "1 Tháng",
          price: 407000,
          stock: 30,
          status: "available"
        },
        {
          _id: "sku10",
          name: "3 Tháng",
          price: 1079000,
          stock: 20,
          status: "available",
          discount: 12
        }
      ],
      features: ["100+ Trò chơi", "Cloud Gaming", "EA Play bao gồm", "Ra mắt ngày đầu"],
      originalPrice: 479000
    },
    {
      _id: "6",
      name: "Disney+ Premium",
      description: "Xem phim Disney, Marvel, Star Wars và nội dung độc quyền với chất lượng 4K",
      category: "entertainment",
      subcategory: "Streaming",
      images: ["https://images.unsplash.com/photo-1489599112332-130ced5de90e?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.6,
      reviews: 1245,
      featured: false,
      bestseller: false,
      skus: [
        {
          _id: "sku11",
          name: "1 Tháng",
          price: 263000,
          stock: 75,
          status: "available"
        },
        {
          _id: "sku12",
          name: "1 Năm",
          price: 2639000,
          stock: 25,
          status: "available",
          discount: 17
        }
      ],
      features: ["4K Ultra HD", "Nội dung độc quyền", "Nhiều thiết bị", "Thân thiện gia đình"],
      originalPrice: 335000
    },
    {
      _id: "7",
      name: "ChatGPT Plus",
      description: "Truy cập GPT-4 và các tính năng nâng cao của ChatGPT với quyền ưu tiên",
      category: "productivity",
      subcategory: "Công cụ AI",
      images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.8,
      reviews: 834,
      featured: true,
      bestseller: true,
      skus: [
        {
          _id: "sku13",
          name: "1 Tháng",
          price: 479000,
          stock: 30,
          status: "available"
        }
      ],
      features: ["Truy cập GPT-4", "Phản hồi ưu tiên", "Tính năng mới nhất", "Sử dụng không giới hạn"],
      originalPrice: null
    },
    {
      _id: "8",
      name: "Canva Pro",
      description: "Công cụ thiết kế chuyên nghiệp với mẫu cao cấp và tài sản thiết kế",
      category: "creative",
      subcategory: "Công cụ thiết kế",
      images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&crop=center"],
      seller: { username: "OCTOPUS Store", _id: "seller1" },
      verified: true,
      rating: 4.7,
      reviews: 967,
      featured: false,
      bestseller: false,
      skus: [
        {
          _id: "sku14",
          name: "1 Tháng",
          price: 311000,
          stock: 40,
          status: "available"
        },
        {
          _id: "sku15",
          name: "1 Năm",
          price: 2879000,
          stock: 25,
          status: "available",
          discount: 23
        }
      ],
      features: ["Mẫu cao cấp", "Xóa phông nền", "Bộ kit thương hiệu", "Cộng tác nhóm"],
      originalPrice: 359000
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 800);
  }, []);

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true;
    return product.category === activeFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Math.min(...a.skus.map(s => s.price)) - Math.min(...b.skus.map(s => s.price));
      case 'price-high':
        return Math.min(...b.skus.map(s => s.price)) - Math.min(...a.skus.map(s => s.price));
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'bestseller':
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const getMinPrice = (skus) => {
    return Math.min(...skus.map(sku => sku.price));
  };

  const getDiscountPercentage = (currentPrice, originalPrice) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalStock = (skus) => {
    return skus.reduce((total, sku) => total + sku.stock, 0);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-xs" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-400 text-xs" />
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
            <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải các dịch vụ đăng ký tuyệt vời...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            🐙 OCTOPUS Store
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto animate-slide-in">
            Dịch vụ đăng ký cao cấp và tài khoản số với giá không thể cạnh tranh
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <FontAwesomeIcon icon={faShield} className="mr-2" />
              Tài khoản đã xác minh
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <FontAwesomeIcon icon={faBolt} className="mr-2" />
              Giao hàng tức thì
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Hỗ trợ 24/7
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Sort */}
        <div className="mb-8">
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Danh mục</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`group relative flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeFilter === category.id
                      ? `${category.color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={category.icon} 
                    className="mr-2 text-sm" 
                  />
                  {category.name}
                  {activeFilter === category.id && (
                    <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Tìm thấy {sortedProducts.length} dịch vụ
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
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            
            return (
              <div
                key={product._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
                onClick={() => onProductClick && onProductClick(product)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.bestseller && (
                      <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <FontAwesomeIcon icon={faFire} className="mr-1" />
                        BÁN CHẠY
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <FontAwesomeIcon icon={faCrown} className="mr-1" />
                        NỔI BẬT
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <FontAwesomeIcon icon={faPercent} className="mr-1" />
                        {discountPercentage}% GIẢM
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200">
                      <FontAwesomeIcon icon={faHeart} className="text-sm" />
                    </button>
                    <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200">
                      <FontAwesomeIcon icon={faEye} className="text-sm" />
                    </button>
                  </div>

                  {/* Verified Badge */}
                  {product.verified && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Đã xác minh
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-1">
                      {product.rating}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({product.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                          +{product.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(minPrice)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Giá khởi điểm
                      </span>
                    </div>
                    
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                      <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
                      Thêm vào giỏ
                    </button>
                  </div>

                  {/* Stock Status */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        {getTotalStock(product.skus)} có sẵn
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ✓ Giao hàng tức thì
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Không tìm thấy dịch vụ
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm điều khác
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Hiện tất cả dịch vụ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
