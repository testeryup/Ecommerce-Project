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
    </footer>
  );
};

export default Footer;