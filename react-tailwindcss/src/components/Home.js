import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiTruck, FiShield, FiHeadphones, FiRotateCcw, FiArrowRight, FiPlay } from 'react-icons/fi';
import ProductSection from '../containers/HomePage/ProductSection';
import Layout from './Layout';

const Home = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section - Apple Style */}
        <section className="relative bg-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-gray-900 mb-8 tracking-tight leading-none">
                Tài khoản
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chính hãng
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Cung cấp tài khoản subscription và key bản quyền chính hãng với giá tốt nhất thị trường.
                Uy tín - Chất lượng - Hỗ trợ 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => navigate('/products')}
                  className="group bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3 shadow-xl"
                >
                  Mua ngay
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group text-blue-600 hover:text-blue-700 px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3">
                  <FiPlay className="w-5 h-5" />
                  Xem demo
                </button>
              </div>
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Features Section - Apple minimalist style */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
                Tại sao chọn chúng tôi
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Đối tác tin cậy cung cấp tài khoản và key bản quyền chính hãng tại Việt Nam
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
                  <FiTruck className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Giao hàng tức thì</h3>
                <p className="text-gray-600 leading-relaxed">Nhận tài khoản và key ngay sau khi thanh toán thành công</p>
              </div>

              <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6 group-hover:bg-emerald-100 transition-colors">
                  <FiShield className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Bản quyền chính hãng</h3>
                <p className="text-gray-600 leading-relaxed">100% tài khoản và key được mua từ nhà phát hành chính thức</p>
              </div>

              <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-50 rounded-full mb-6 group-hover:bg-purple-100 transition-colors">
                  <FiHeadphones className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hỗ trợ 24/7</h3>
                <p className="text-gray-600 leading-relaxed">Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giải đáp</p>
              </div>

              <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-6 group-hover:bg-orange-100 transition-colors">
                  <FiRotateCcw className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Bảo hành đổi trả</h3>
                <p className="text-gray-600 leading-relaxed">Bảo hành tài khoản lỗi trong 7 ngày đầu sử dụng</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <ProductSection />

        {/* Stats Section - Apple numbers style */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
                Thống kê ấn tượng
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Hàng nghìn khách hàng đã tin tưởng và sử dụng dịch vụ của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="text-6xl md:text-7xl font-light text-blue-600 mb-4 tabular-nums tracking-tight">
                  50K+
                </div>
                <div className="text-xl text-gray-600 font-medium">Khách hàng tin tưởng</div>
              </div>
              <div className="text-center group">
                <div className="text-6xl md:text-7xl font-light text-emerald-600 mb-4 tabular-nums tracking-tight">
                  5K+
                </div>
                <div className="text-xl text-gray-600 font-medium">Tài khoản đã bán</div>
              </div>
              <div className="text-center group">
                <div className="text-6xl md:text-7xl font-light text-purple-600 mb-4 tabular-nums tracking-tight">
                  98%
                </div>
                <div className="text-xl text-gray-600 font-medium">Tỷ lệ hài lòng</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Apple style call to action */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
              Sẵn sàng sở hữu
              <span className="block">tài khoản premium?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              Khám phá hàng nghìn tài khoản subscription và key bản quyền với giá tốt nhất thị trường.
              Trải nghiệm dịch vụ premium chất lượng cao ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/products')}
                className="group bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3 shadow-xl"
              >
                Khám phá ngay
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/about"
                className="text-blue-600 hover:text-blue-700 px-10 py-4 rounded-full font-medium transition-all duration-300 text-lg"
              >
                Tư vấn miễn phí
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
