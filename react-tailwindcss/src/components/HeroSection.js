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
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Main Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 animate-fade-in">
              🐙 OCTOPUS Store
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-in">
              Nền tảng uy tín số 1 Việt Nam cung cấp tài khoản premium và dịch vụ đăng ký chất lượng cao
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                Khám phá ngay
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce-subtle">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <FontAwesomeIcon icon={faPlay} className="text-2xl" />
          </div>
        </div>
        <div className="absolute top-32 right-20 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <FontAwesomeIcon icon={faMusic} className="text-xl" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce-subtle" style={{ animationDelay: '2s' }}>
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <FontAwesomeIcon icon={faDesktop} className="text-xl" />
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Dịch vụ nổi bật
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Những tài khoản premium được yêu thích nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {service.bestseller && (
                      <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <FontAwesomeIcon icon={faFire} className="mr-1" />
                        BÁN CHẠY
                      </span>
                    )}
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{service.discount} GIẢM
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      Đã xác minh
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
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
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-1">
                      {service.rating}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({service.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
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
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {service.price}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {service.originalPrice}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Giá khởi điểm
                      </span>
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-200">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Danh mục dịch vụ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Khám phá các dịch vụ đăng ký theo từng lĩnh vực
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <FontAwesomeIcon icon={category.icon} className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {category.description}
                </p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  {category.count}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Icon */}
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <FontAwesomeIcon icon={faCrown} className="text-3xl text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Sẵn sàng trải nghiệm dịch vụ premium?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tham gia cùng hàng nghìn khách hàng đã tin tưởng OCTOPUS Store - nền tảng ứng dụng và dịch vụ digital hàng đầu Việt Nam
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-100">Ứng dụng chất lượng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Hỗ trợ tận tình</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/products" 
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center min-w-[200px] hover:bg-blue-50"
            >
              <FontAwesomeIcon icon={faStore} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
              Khám phá ngay
              <FontAwesomeIcon icon={faArrowRight} className="ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link 
              to="/contact" 
              className="group border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center min-w-[200px] backdrop-blur-sm hover:border-white/50"
            >
              <FontAwesomeIcon icon={faHeadset} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
              Liên hệ hỗ trợ
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-blue-100 text-sm">
              🔥 Đang có ưu đãi đặc biệt - Miễn phí 30 ngày đầu cho khách hàng mới
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;