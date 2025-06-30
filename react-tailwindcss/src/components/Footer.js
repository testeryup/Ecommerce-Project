import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faHeart,
  faStore,
  faShieldAlt,
  faQuestionCircle,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faLinkedin,
  faGithub
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Sản phẩm",
      links: [
        { name: "Ứng dụng", href: "/apps", icon: faStore },
        { name: "Subscriptions", href: "/subscriptions", icon: faHeadset },
        { name: "Gaming", href: "/gaming", icon: faShieldAlt },
        { name: "Năng suất", href: "/productivity", icon: faQuestionCircle },
        { name: "Sáng tạo", href: "/creative", icon: faHeart }
      ]
    },
    {
      title: "Hỗ trợ",
      links: [
        { name: "Trung tâm trợ giúp", href: "/help" },
        { name: "Liên hệ", href: "/contact" },
        { name: "Hướng dẫn", href: "/guide" },
        { name: "FAQ", href: "/faq" },
        { name: "Báo cáo lỗi", href: "/bug-report" }
      ]
    },
    {
      title: "Công ty",
      links: [
        { name: "Về OCTOPUS", href: "/about" },
        { name: "Tin tức", href: "/news" },
        { name: "Tuyển dụng", href: "/careers" },
        { name: "Đối tác", href: "/partners" },
        { name: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Pháp lý",
      links: [
        { name: "Điều khoản", href: "/terms" },
        { name: "Bảo mật", href: "/privacy" },
        { name: "Hoàn tiền", href: "/refund" },
        { name: "Giao hàng", href: "/shipping" },
        { name: "Bảo mật", href: "/security" }
      ]
    }
  ];

  const socialLinks = [
    { icon: faFacebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-500" },
    { icon: faTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-blue-400" },
    { icon: faInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-500" },
    { icon: faYoutube, href: "https://youtube.com", label: "YouTube", color: "hover:text-red-500" },
    { icon: faLinkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-600" },
    { icon: faGithub, href: "https://github.com", label: "GitHub", color: "hover:text-gray-800 dark:hover:text-gray-200" }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-200">
      {/* Newsletter Section */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Đăng ký nhận thông tin ưu đãi
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Nhận thông báo về các sản phẩm mới, ưu đãi đặc biệt và các tin tức hot nhất từ OCTOPUS Store
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md">
                <span className="text-white text-xl font-bold">🐙</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">OCTOPUS</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Nền tảng cung cấp dịch vụ digital hàng đầu Việt Nam. Khám phá hàng ngàn sản phẩm chất lượng cao cho mọi nhu cầu của bạn.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} className="text-blue-600 dark:text-blue-400 text-sm" />
                </div>
                <span>1900 1234</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 dark:text-blue-400 text-sm" />
                </div>
                <span>support@octopus.vn</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 dark:text-blue-400 text-sm" />
                </div>
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                    >
                      {link.icon && (
                        <FontAwesomeIcon 
                          icon={link.icon} 
                          className="text-sm group-hover:scale-110 transition-transform duration-200" 
                        />
                      )}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <span>© {currentYear} OCTOPUS Store. Made with</span>
              <FontAwesomeIcon icon={faHeart} className="text-red-500 animate-pulse" />
              <span>in Vietnam</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300 mr-2">Theo dõi:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-200 transform hover:scale-110 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md`}
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;