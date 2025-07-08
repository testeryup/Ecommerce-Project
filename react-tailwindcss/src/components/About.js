import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faShoppingCart, 
  faStar, 
  faHeadset,
  faShieldAlt,
  faGem,
  faBolt,
  faCheckCircle,
  faQuoteLeft,
  faAward,
  faGlobe,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
  const stats = [
    { icon: faUsers, value: "50.000+", label: "Khách hàng tin tưởng" },
    { icon: faShoppingCart, value: "100.000+", label: "Tài khoản đã bán" },
    { icon: faStar, value: "4.8/5", label: "Đánh giá khách hàng" },
    { icon: faHeadset, value: "24/7", label: "Hỗ trợ không ngừng" }
  ];

  const values = [
    {
      icon: faShieldAlt,
      title: "An toàn & Bảo mật",
      description: "Cam kết bảo vệ thông tin và giao dịch của khách hàng với công nghệ bảo mật tiên tiến và mã hóa SSL 256-bit.",
      features: ["Mã hóa SSL 256-bit", "Thanh toán an toàn", "Bảo mật thông tin"]
    },
    {
      icon: faGem,
      title: "Chất lượng Premium", 
      description: "Cung cấp các tài khoản premium chính hãng với trải nghiệm tốt nhất và đảm bảo hoạt động ổn định.",
      features: ["Tài khoản chính hãng", "Chất lượng cao", "Bảo hành dài hạn"]
    },
    {
      icon: faBolt,
      title: "Tốc độ & Hiệu quả",
      description: "Kích hoạt tài khoản tức thì, hỗ trợ khách hàng nhanh chóng với đội ngũ chuyên nghiệp 24/7.",
      features: ["Giao hàng tức thì", "Hỗ trợ nhanh", "Quy trình tự động"]
    }
  ];

  const achievements = [
    {
      icon: faAward,
      title: "Top 1 Marketplace",
      description: "Nền tảng số 1 Việt Nam cho dịch vụ premium"
    },
    {
      icon: faGlobe,
      title: "Phục vụ toàn cầu",
      description: "Hỗ trợ khách hàng trên 50+ quốc gia"
    },
    {
      icon: faClock,
      title: "5+ năm kinh nghiệm",
      description: "Đồng hành cùng khách hàng từ 2019"
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Khách hàng VIP",
      content: "OCTOPUS Store là nơi tôi tin tưởng mua tài khoản premium. Chất lượng dịch vụ tuyệt vời, hỗ trợ nhanh chóng và giá cả hợp lý.",
      rating: 5
    },
    {
      name: "Trần Thị B", 
      role: "Designer",
      content: "Đã mua Adobe Creative Cloud từ OCTOPUS và rất hài lòng. Tài khoản hoạt động ổn định, team support rất nhiệt tình.",
      rating: 5
    },
    {
      name: "Lê Minh C",
      role: "Developer",
      content: "Giao dịch nhanh chóng, tài khoản chất lượng cao. Đặc biệt ấn tượng với dịch vụ hỗ trợ 24/7 của OCTOPUS Store.",
      rating: 5
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">🐙 Về OCTOPUS Store</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Đối tác tin cậy trong chuyển đổi số, mang đến trải nghiệm premium từ các nền tảng hàng đầu thế giới
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={stat.icon} className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Câu chuyện của chúng tôi</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              OCTOPUS Store được thành lập với sứ mệnh mang đến cho người dùng Việt Nam những trải nghiệm premium tốt nhất từ các nền tảng số hàng đầu thế giới. Chúng tôi không ngừng nỗ lực để trở thành đối tác tin cậy trong hành trình chuyển đổi số của mọi người.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sứ mệnh của chúng tôi</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Mang đến các giải pháp số toàn diện và đáng tin cậy cho người dùng Việt Nam, giúp các dịch vụ premium trở nên dễ tiếp cận với mọi người.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tầm nhìn của chúng tôi</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Trở thành thị trường số hàng đầu tại Việt Nam, kết nối người dùng với các dịch vụ premium toàn cầu một cách dễ dàng và an toàn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Giá trị cốt lõi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={value.icon} className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                <div className="mt-4 space-y-2">
                  {value.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Thành tựu nổi bật</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={achievement.icon} className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{achievement.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của OCTOPUS Store
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl text-blue-500 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Tại sao chọn OCTOPUS Store?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bảo mật tuyệt đối</h3>
              <p className="text-blue-100 text-sm">Công nghệ mã hóa SSL 256-bit</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faBolt} className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Giao hàng tức thì</h3>
              <p className="text-blue-100 text-sm">Kích hoạt tài khoản trong 5 phút</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeadset} className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-blue-100 text-sm">Đội ngũ chuyên nghiệp luôn sẵn sàng</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faGem} className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chất lượng Premium</h3>
              <p className="text-blue-100 text-sm">Tài khoản chính hãng 100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Đội ngũ chuyên nghiệp</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Những con người tận tâm và chuyên nghiệp, luôn đặt khách hàng lên hàng đầu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-6xl text-white" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Đội ngũ Kinh doanh</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Chuyên gia tư vấn</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Hỗ trợ khách hàng chọn lựa dịch vụ phù hợp nhất</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faHeadset} className="text-6xl text-white" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Đội ngũ Hỗ trợ</h3>
                <p className="text-green-600 dark:text-green-400 font-medium">Chăm sóc khách hàng</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Giải đáp mọi thắc mắc 24/7</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-6xl text-white" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Đội ngũ Kỹ thuật</h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium">Chuyên gia bảo mật</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Đảm bảo an toàn và ổn định hệ thống</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;