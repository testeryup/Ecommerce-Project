import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiSearch, FiRefreshCw } from 'react-icons/fi';
import Layout from './Layout';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* 404 Hero Section - Apple Style */}
        <section className="relative bg-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Large 404 Number */}
              <div className="relative mb-12">
                <h1 className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-light text-gray-100 leading-none select-none">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl animate-bounce">🔍</div>
                </div>
              </div>

              {/* Main Message */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 tracking-tight leading-tight">
                Trang không
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  tồn tại
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
                Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                Có thể URL đã thay đổi hoặc trang đã bị di chuyển.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                <Link
                  to="/"
                  className="group bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3 shadow-xl"
                >
                  <FiHome className="w-5 h-5" />
                  Về trang chủ
                </Link>

                <button
                  onClick={handleGoBack}
                  className="group text-blue-600 hover:text-blue-700 px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3 border-2 border-blue-600 hover:border-blue-700"
                >
                  <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Quay lại
                </button>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <Link
                  to="/products"
                  className="group p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
                    <FiSearch className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Tìm sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed">Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi</p>
                </Link>

                <Link
                  to="/about"
                  className="group p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-6 group-hover:bg-emerald-100 transition-colors">
                    <div className="text-2xl">ℹ️</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Giới thiệu</h3>
                  <p className="text-gray-600 leading-relaxed">Tìm hiểu thêm về câu chuyện và sứ mệnh của chúng tôi</p>
                </Link>

                <Link
                  to="/support"
                  className="group p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-6 group-hover:bg-purple-100 transition-colors">
                    <div className="text-2xl">💬</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Hỗ trợ</h3>
                  <p className="text-gray-600 leading-relaxed">Liên hệ với đội ngũ hỗ trợ khách hàng 24/7</p>
                </Link>
              </div>
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-emerald-100 rounded-full blur-lg opacity-50 animate-pulse delay-500"></div>
          </div>
        </section>

        {/* Additional Help Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Cần thêm trợ giúp?
            </h3>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              Nếu bạn tin rằng đây là một lỗi hoặc cần hỗ trợ thêm,
              đừng ngần ngại liên hệ với chúng tôi.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => window.location.reload()}
                className="group bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3"
              >
                <FiRefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Tải lại trang
              </button>

              <Link
                to="/support"
                className="text-blue-600 hover:text-blue-700 px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3"
              >
                Báo cáo lỗi
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Links */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h4 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Có thể bạn đang tìm kiếm
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/"
                className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                <div className="text-3xl mb-2">🏠</div>
                <div className="font-medium">Trang chủ</div>
              </Link>

              <Link
                to="/products"
                className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                <div className="text-3xl mb-2">🛍️</div>
                <div className="font-medium">Sản phẩm</div>
              </Link>

              <Link
                to="/cart"
                className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                <div className="text-3xl mb-2">🛒</div>
                <div className="font-medium">Giỏ hàng</div>
              </Link>

              <Link
                to="/login"
                className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-medium">Đăng nhập</div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default NotFound;
