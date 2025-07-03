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
  faHeadset,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
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
    { number: '4.9/5', label: 'Đánh giá khách hàng' }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <FontAwesomeIcon icon={faCrown} className="mr-2" />
              Cửa hàng tài khoản premium #1 Việt Nam
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Tài khoản <span className="text-blue-600 dark:text-blue-400">Premium</span>
              <br />
              <span className="text-gray-600 dark:text-gray-300">Chất lượng cao</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Khám phá hàng nghìn tài khoản premium chính hãng với giá cả hợp lý. 
              Uy tín - An toàn - Bảo hành 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/products" 
                className="group bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Khám phá ngay
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/about" 
                className="group bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center"
              >
                <FontAwesomeIcon icon={faShield} className="mr-2" />
                Tìm hiểu thêm
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faShield} className="text-green-500 mr-2" />
                <span>Bảo hành trọn đời</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                <span>Tài khoản chính hãng</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faHeadset} className="text-green-500 mr-2" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Danh mục sản phẩm
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tìm kiếm tài khoản premium theo danh mục yêu thích
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={category.icon} className="text-2xl text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {category.count}
                  </span>
                  <FontAwesomeIcon 
                    icon={faArrowRight} 
                    className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" 
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;