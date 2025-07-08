import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Newsletter Section - Apple Style */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
            Luôn cập nhật
          </h3>
          <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
            Đăng ký nhận bản tin để cập nhật sản phẩm mới, ưu đãi độc quyền và các chương trình khuyến mãi đặc biệt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="flex-1 px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-gray-900 placeholder-gray-500"
            />
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 whitespace-nowrap">
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Octopus Store</h3>
              </div>
              <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                Điểm đến hàng đầu cho những sản phẩm chất lượng với giá cả hợp lý. 
                Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với dịch vụ giao hàng nhanh chóng và hỗ trợ khách hàng xuất sắc.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiFacebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiTwitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiInstagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiLinkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Liên kết nhanh</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Sản phẩm
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
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
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Hướng dẫn mua hàng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Vận chuyển
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Thanh toán
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
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
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiInstagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FiLinkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Service</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Track Order
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 ShopHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
