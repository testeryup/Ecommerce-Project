import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiShield, 
  FiUsers, 
  FiAward, 
  FiTrendingUp, 
  FiHeart, 
  FiTarget, 
  FiGlobe, 
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiZap
} from 'react-icons/fi';
import Layout from './Layout';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: FiUsers, value: "50K+", label: "Khách hàng tin tưởng", color: "text-blue-600" },
    { icon: FiShield, value: "5K+", label: "Tài khoản đã bán", color: "text-emerald-600" },
    { icon: FiStar, value: "98%", label: "Tỷ lệ hài lòng", color: "text-purple-600" },
    { icon: FiZap, value: "24/7", label: "Hỗ trợ không ngừng", color: "text-orange-600" }
  ];

  const values = [
    {
      icon: FiShield,
      title: "An toàn & Bảo mật",
      description: "Cam kết bảo vệ thông tin và giao dịch của khách hàng với công nghệ bảo mật tiên tiến nhất.",
      features: ["Mã hóa SSL 256-bit", "Thanh toán an toàn", "Bảo mật thông tin", "Tuân thủ GDPR"]
    },
    {
      icon: FiAward,
      title: "Chất lượng Premium",
      description: "Cung cấp các tài khoản premium chính hãng với trải nghiệm tốt nhất và chất lượng được đảm bảo.",
      features: ["Tài khoản chính hãng", "Chất lượng cao", "Bảo hành dài hạn", "Kiểm tra chất lượng"]
    },
    {
      icon: FiZap,
      title: "Tốc độ & Hiệu quả",
      description: "Kích hoạt tài khoản tức thì, hỗ trợ khách hàng nhanh chóng với quy trình tự động hoàn toàn.",
      features: ["Giao hàng tức thì", "Hỗ trợ 24/7", "Quy trình tự động", "Xử lý nhanh chóng"]
    }
  ];

  const milestones = [
    { year: "2020", title: "Thành lập", description: "Khởi đầu với tầm nhìn cung cấp tài khoản subscription chính hãng" },
    { year: "2021", title: "Mở rộng", description: "Phát triển mạnh mẽ với hơn 10.000 khách hàng tin tưởng" },
    { year: "2022", title: "Đổi mới", description: "Ra mắt hệ thống tự động hoàn toàn và ứng dụng mobile" },
    { year: "2023", title: "Dẫn đầu", description: "Trở thành nền tảng hàng đầu tại Việt Nam với 50K+ khách hàng" }
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      description: "10+ năm kinh nghiệm trong ngành công nghệ và thương mại điện tử",
      avatar: "🚀"
    },
    {
      name: "Trần Thị B",
      role: "CTO",
      description: "Chuyên gia về bảo mật và hệ thống, đảm bảo vận hành ổn định 24/7",
      avatar: "💻"
    },
    {
      name: "Lê Văn C",
      role: "Head of Customer Success",
      description: "Đảm bảo trải nghiệm khách hàng luôn hoàn hảo và hỗ trợ tận tâm",
      avatar: "🎯"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 tracking-tight leading-none">
                Về chúng tôi
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Hành trình xây dựng nền tảng cung cấp tài khoản subscription và key bản quyền 
                chính hãng hàng đầu tại Việt Nam.
              </p>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 tracking-tight">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light mb-8">
              Democratizing access to premium digital services by providing authentic subscription accounts 
              and software licenses at affordable prices, while maintaining the highest standards of 
              security and customer service.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed font-light">
              "Dân chủ hóa việc tiếp cận các dịch vụ số premium bằng cách cung cấp tài khoản subscription 
              và key bản quyền chính hãng với giá cả phải chăng, đồng thời duy trì tiêu chuẩn bảo mật 
              và dịch vụ khách hàng cao nhất."
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                Con số ấn tượng
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Những thành tựu chúng tôi đạt được nhờ sự tin tưởng của khách hàng
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className={`text-4xl md:text-5xl font-light mb-3 tabular-nums tracking-tight ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-lg text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                Giá trị cốt lõi
              </h2>
              <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
                Những nguyên tắc định hướng mọi hoạt động và quyết định của chúng tôi
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="group bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 border border-gray-100">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
                    <value.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{value.description}</p>
                  <div className="space-y-2">
                    {value.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                Hành trình phát triển
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Từ khởi đầu khiêm tốn đến vị thế hàng đầu
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="text-2xl font-light text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                Đội ngũ lãnh đạo
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Những con người tạo nên sự khác biệt
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="group text-center bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 border border-gray-100">
                  <div className="text-6xl mb-6">{member.avatar}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-blue-600 font-medium mb-4">{member.role}</div>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Gia nhập cộng đồng của chúng tôi
            </h2>
            <p className="text-lg text-gray-600 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
              Trở thành một phần trong hành trình số hóa dịch vụ premium. Khám phá ngay 
              hàng nghìn tài khoản subscription chính hãng với giá tốt nhất thị trường.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => navigate('/products')}
                className="group bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center gap-3 shadow-xl"
              >
                Khám phá sản phẩm
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/support')}
                className="text-blue-600 hover:text-blue-700 px-10 py-4 rounded-full font-medium transition-all duration-300 text-lg"
              >
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;