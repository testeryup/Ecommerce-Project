import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faKey, faCrown, faShield, faDesktop, faMusic, faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  const featuredServices = [
    {
      id: 1,
      title: "Netflix Premium",
      subtitle: "Ultra HD 4K + 4 profiles",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop",
      price: "149,000₫",
      originalPrice: "260,000₫",
      discount: "43%",
      category: "Entertainment",
      duration: "1 month",
      icon: faPlay,
      rating: 4.8,
      verified: true
    },
    {
      id: 2,
      title: "Microsoft Office 365",
      subtitle: "Full suite + 1TB OneDrive",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=250&fit=crop",
      price: "89,000₫",
      category: "Productivity",
      duration: "1 year",
      icon: faDesktop,
      rating: 4.9,
      verified: true
    },
    {
      id: 3,
      title: "Spotify Premium",
      subtitle: "Ad-free + Offline downloads",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      price: "59,000₫",
      originalPrice: "99,000₫",
      discount: "40%",
      category: "Music",
      duration: "1 month",
      icon: faMusic,
      rating: 4.7,
      verified: true
    }
  ];

  const stats = [
    { icon: faKey, value: "50,000+", label: "Accounts Delivered" },
    { icon: faCrown, value: "99.9%", label: "Success Rate" },
    { icon: faShield, value: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="relative bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Background */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        
        {/* Main Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Premium Subscriptions
                </span>
                <br />
                <span className="text-gray-800 dark:text-gray-200">Made Affordable</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Unlock premium entertainment, productivity tools, and creative software at unbeatable prices. 
                Join 50,000+ satisfied customers who trust OCTOPUS.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Browse Subscriptions
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Services Section */}
      <div className="relative bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Premium Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Top-rated subscriptions at incredible prices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredServices.map((service, index) => (
              <div
                key={service.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {service.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{service.discount} OFF
                    </div>
                  )}
                  {service.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                      <FontAwesomeIcon icon={faShield} className="text-sm" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={service.icon} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.category} • {service.duration}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {service.subtitle}
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400 mr-2">
                      <FontAwesomeIcon icon={faStar} className="text-sm" />
                      <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {service.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      (Verified Account)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {service.price}
                      </span>
                      {service.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {service.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find the perfect subscription for your needs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Entertainment", icon: faPlay, count: "25+ Services", color: "from-red-500 to-pink-500" },
              { name: "Productivity", icon: faDesktop, count: "15+ Tools", color: "from-blue-500 to-cyan-500" },
              { name: "Music & Audio", icon: faMusic, count: "10+ Platforms", color: "from-green-500 to-teal-500" },
              { name: "Creative", icon: faCrown, count: "20+ Software", color: "from-purple-500 to-indigo-500" }
            ].map((category, index) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="group bg-white dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <FontAwesomeIcon icon={category.icon} className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {category.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
