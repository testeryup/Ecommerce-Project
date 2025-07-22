import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">

      {/* Main Footer Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200">
                  <span className="text-2xl">🐙</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Octopus Store</h3>
              </div>
              <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                Điểm đến hàng đầu cho những sản phẩm chất lượng với giá cả hợp lý.
                Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với dịch vụ giao hàng nhanh chóng và hỗ trợ khách hàng xuất sắc.
              </p>
              <div className="flex space-x-6">
                <a href="https://facebook.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiFacebook className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiTwitter className="w-6 h-6" />
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiInstagram className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiLinkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Liên kết nhanh</h4>
              <ul className="space-y-4">
                <li>
                  <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Sản phẩm
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Hỗ trợ khách hàng</h4>
              <ul className="space-y-4">
                <li>
                  <a href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Hướng dẫn mua hàng
                  </a>
                </li>
                <li>
                  <a href="/returns" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a href="/shipping" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Vận chuyển
                  </a>
                </li>
                <li>
                  <a href="/payment" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Thanh toán
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <FiMail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">support@octopusstore.vn</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <FiPhone className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Điện thoại</p>
                  <p className="text-gray-600">1900 1234</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Địa chỉ</p>
                  <p className="text-gray-600">Hà Nội, Việt Nam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © 2025 Octopus Store. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                Điều khoản dịch vụ
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">
                Cookie
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
