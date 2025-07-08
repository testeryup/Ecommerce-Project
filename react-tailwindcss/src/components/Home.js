import React from 'react';
import { FiTruck, FiShield, FiHeadphones, FiRotateCcw, FiArrowRight, FiPlay } from 'react-icons/fi';
import ProductSection from '../containers/HomePage/ProductSection';
import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
      {/* Hero Section - Apple Style */}
      <section className="relative bg-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-gray-900 mb-8 tracking-tight leading-none">
              Mua sắm
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thông minh
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Khám phá bộ sưu tập sản phẩm chất lượng cao với thiết kế tinh tế. 
              Trải nghiệm mua sắm hoàn hảo chỉ có tại đây.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3 shadow-xl">
                Mua ngay
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group text-blue-600 hover:text-blue-700 px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3">
                <FiPlay className="w-5 h-5" />
                Xem giới thiệu
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
              Tại sao chọn chúng tôi
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
              Cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất với dịch vụ chất lượng cao
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
                <FiTruck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Miễn phí vận chuyển</h3>
              <p className="text-gray-600 leading-relaxed">Giao hàng miễn phí cho đơn hàng từ 500.000đ</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6 group-hover:bg-emerald-100 transition-colors">
                <FiShield className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Thanh toán an toàn</h3>
              <p className="text-gray-600 leading-relaxed">Bảo mật 100% thông tin thanh toán</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-50 rounded-full mb-6 group-hover:bg-purple-100 transition-colors">
                <FiHeadphones className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hỗ trợ 24/7</h3>
              <p className="text-gray-600 leading-relaxed">Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-6 group-hover:bg-orange-100 transition-colors">
                <FiRotateCcw className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Đổi trả dễ dàng</h3>
              <p className="text-gray-600 leading-relaxed">Chính sách đổi trả linh hoạt trong 30 ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Apple numbers style */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
              Con số ấn tượng
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
              Hàng nghìn khách hàng đã tin tưởng và lựa chọn chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-light text-blue-600 mb-4 tabular-nums tracking-tight">
                50K+
              </div>
              <div className="text-xl text-gray-600 font-medium">Khách hàng hài lòng</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-light text-emerald-600 mb-4 tabular-nums tracking-tight">
                10K+
              </div>
              <div className="text-xl text-gray-600 font-medium">Sản phẩm đã bán</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-light text-purple-600 mb-4 tabular-nums tracking-tight">
                99%
              </div>
              <div className="text-xl text-gray-600 font-medium">Tỷ lệ hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <ProductSection />

      {/* CTA Section - Apple style call to action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
            Sẵn sàng bắt đầu
            <span className="block">mua sắm thông minh?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
            Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất. 
            Trải nghiệm mua sắm hoàn toàn mới đang chờ đón bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3 shadow-xl">
              Khám phá ngay
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-blue-600 hover:text-blue-700 px-10 py-4 rounded-full font-medium transition-all duration-300 text-lg">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default Home;
