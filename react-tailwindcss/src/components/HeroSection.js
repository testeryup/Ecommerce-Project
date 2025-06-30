import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faDesktop, 
  faMusic, 
  faBolt, 
  faShield,
  faCheckCircle,
  faStar,
  faArrowRight,
  faFire,
  faCrown,
  faStore,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  const featuredServices = [
    {
      id: 1,
      name: "Netflix Premium",
      description: "Xem phim 4K Ultra HD không quảng cáo",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop&crop=center",
      price: "369.000₫",
      originalPrice: "479.000₫",
      discount: "23%",
      rating: 4.8,
      reviews: 1250,
      bestseller: true,
      features: ["4K Ultra HD", "4 Màn hình", "Tải xuống offline"]
    },
    {
      id: 2,
      name: "Spotify Premium",
      description: "Nghe nhạc không giới hạn chất lượng cao",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
      price: "239.000₫",
      originalPrice: "311.000₫",
      discount: "17%",
      rating: 4.7,
      reviews: 2341,
      bestseller: true,
      features: ["Chất lượng cao", "Không quảng cáo", "Tải xuống offline"]
    },
    {
      id: 3,
      name: "Microsoft Office 365",
      description: "Bộ ứng dụng văn phòng hoàn chỉnh",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop&crop=center",
      price: "1.679.000₫",
      originalPrice: "3.359.000₫",
      discount: "50%",
      rating: 4.9,
      reviews: 892,
      bestseller: false,
      features: ["Word, Excel, PowerPoint", "1TB OneDrive", "Nhiều thiết bị"]
    }
  ];

  const categories = [
    {
      id: 'entertainment',
      name: 'Giải trí',
      icon: faPlay,
      color: 'from-red-500 to-pink-500',
      description: 'Netflix, Disney+, HBO Max',
      count: '12+ dịch vụ'
    },
    {
      id: 'productivity',
      name: 'Năng suất',
      icon: faDesktop,
      color: 'from-blue-500 to-cyan-500',
      description: 'Office 365, Adobe, Notion',
      count: '8+ dịch vụ'
    },
    {
      id: 'music',
      name: 'Âm nhạc',
      icon: faMusic,
      color: 'from-green-500 to-emerald-500',
      description: 'Spotify, Apple Music, YouTube',
      count: '6+ dịch vụ'
    },
    {
      id: 'creative',
      name: 'Sáng tạo',
      icon: faBolt,
      color: 'from-yellow-500 to-orange-500',
      description: 'Canva Pro, Figma, Adobe CC',
      count: '10+ dịch vụ'
    }
  ];

  const stats = [
    { number: '50.000+', label: 'Tài khoản đã bán' },
    { number: '99.9%', label: 'Tỷ lệ thành công' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' },
    { number: '4.8/5', label: 'Đánh giá khách hàng' }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Main Hero Section - Clean White Design */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300"></div>
        <div className="absolute inset-0 opacity-30 dark:opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full text-sm font-semibold mb-8 animate-fade-in transition-colors duration-300">
              <span className="text-lg">🐙</span>
              <span>Chào mừng đến với OCTOPUS Store</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-gray-900 dark:text-gray-100 animate-fade-in transition-colors duration-300">
              Cửa hàng số
              <span className="block text-blue-600 dark:text-blue-400">hàng đầu Việt Nam</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-in transition-colors duration-300">
              Nền tảng uy tín cung cấp tài khoản premium và dịch vụ đăng ký chất lượng cao với giá tốt nhất thị trường
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-xl px-6 py-4 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faShield} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Bảo hành tài khoản</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Đổi trả trong 30 ngày</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-xl px-6 py-4 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faBolt} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Giao hàng tức thì</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Nhận tài khoản trong 5 phút</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-xl px-6 py-4 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Hỗ trợ 24/7</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Luôn sẵn sàng hỗ trợ bạn</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/products" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faStore} className="mr-3" />
                Khám phá sản phẩm
                <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-10 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements - Subtle */}
        <div className="absolute top-20 left-10 opacity-30 animate-bounce-subtle">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faPlay} className="text-2xl text-blue-600" />
          </div>
        </div>
        <div className="absolute top-32 right-20 opacity-30 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faMusic} className="text-xl text-green-600" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-30 animate-bounce-subtle" style={{ animationDelay: '2s' }}>
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faDesktop} className="text-xl text-purple-600" />
          </div>
        </div>
      </section>

      {/* Featured Services - Clean Card Design */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những tài khoản premium được khách hàng yêu thích và tin tưởng nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {service.bestseller && (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                        <FontAwesomeIcon icon={faFire} className="mr-1" />
                        BÁN CHẠY
                      </span>
                    )}
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      -{service.discount} GIẢM
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center shadow-sm">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      Đã xác minh
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={`text-xs ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 mr-1">
                      {service.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({service.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {service.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {service.originalPrice}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Giá khởi điểm
                      </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Clean White Design */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl lg:text-5xl font-bold mb-2 text-blue-600 group-hover:scale-110 transition-transform duration-200">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Clean Card Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Danh mục dịch vụ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá các sản phẩm và dịch vụ đăng ký theo từng lĩnh vực
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center transform hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                  <FontAwesomeIcon icon={category.icon} className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="text-blue-600 font-semibold text-sm">
                  {category.count}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Clean Design */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Icon */}
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCrown} className="text-3xl text-blue-600" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Sẵn sàng trải nghiệm dịch vụ 
              <span className="text-blue-600">premium?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tham gia cùng hàng nghìn khách hàng đã tin tưởng OCTOPUS Store - nền tảng cung cấp dịch vụ digital hàng đầu Việt Nam
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Sản phẩm chất lượng</div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Hỗ trợ tận tình</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/products" 
              className="group bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center min-w-[200px] hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faStore} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
              Khám phá ngay
              <FontAwesomeIcon icon={faArrowRight} className="ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link 
              to="/contact" 
              className="group border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center min-w-[200px]"
            >
              <FontAwesomeIcon icon={faHeadset} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
              Liên hệ hỗ trợ
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-6 py-3 rounded-full text-sm font-semibold border border-yellow-200">
              <span>🔥</span>
              <span>Đang có ưu đãi đặc biệt - Miễn phí 30 ngày đầu cho khách hàng mới</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;