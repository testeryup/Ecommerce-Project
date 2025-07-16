import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMessageCircle, 
  FiMail, 
  FiPhone, 
  FiClock, 
  FiHelpCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiUser,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiSettings,
  FiCreditCard,
  FiDownload
} from 'react-icons/fi';
import Layout from './Layout';

const Support = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const supportChannels = [
    {
      icon: FiMessageCircle,
      title: "Live Chat",
      description: "Trò chuyện trực tiếp với đội hỗ trợ",
      status: "Đang hoạt động",
      action: "Bắt đầu chat",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: FiMail,
      title: "Email Support",
      description: "Gửi email chi tiết về vấn đề của bạn",
      status: "Phản hồi trong 2 giờ",
      action: "Gửi email",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: FiPhone,
      title: "Hotline",
      description: "Gọi điện trực tiếp để được hỗ trợ",
      status: "24/7 hỗ trợ",
      action: "1900-xxx-xxx",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const faqCategories = [
    {
      id: 'general',
      title: 'Thông tin chung',
      icon: FiInfo,
      faqs: [
        {
          question: "Làm thế nào để mua tài khoản trên website?",
          answer: "Bạn có thể duyệt qua danh sách sản phẩm, chọn tài khoản phù hợp, thêm vào giỏ hàng và tiến hành thanh toán. Sau khi thanh toán thành công, thông tin tài khoản sẽ được gửi về email của bạn ngay lập tức."
        },
        {
          question: "Tài khoản có phải chính hãng không?",
          answer: "Tất cả tài khoản được bán trên website đều là chính hãng 100%, được mua trực tiếp từ nhà phát hành hoặc đối tác ủy quyền chính thức. Chúng tôi cam kết không bán tài khoản giả mạo hay vi phạm bản quyền."
        },
        {
          question: "Tôi có thể sử dụng tài khoản ngay sau khi mua không?",
          answer: "Có, sau khi thanh toán thành công, thông tin đăng nhập sẽ được gửi về email của bạn trong vòng 5-10 phút. Bạn có thể đăng nhập và sử dụng ngay lập tức."
        }
      ]
    },
    {
      id: 'account',
      title: 'Tài khoản & Đăng nhập',
      icon: FiUser,
      faqs: [
        {
          question: "Tôi quên mật khẩu tài khoản website, làm sao để lấy lại?",
          answer: "Bạn có thể nhấn vào 'Quên mật khẩu' tại trang đăng nhập, nhập email đã đăng ký và làm theo hướng dẫn để đặt lại mật khẩu mới."
        },
        {
          question: "Làm thế nào để cập nhật thông tin cá nhân?",
          answer: "Sau khi đăng nhập, vào mục 'Tài khoản của tôi' > 'Thông tin cá nhân' để cập nhật tên, số điện thoại, địa chỉ và các thông tin khác."
        },
        {
          question: "Tôi không thể đăng nhập vào tài khoản, phải làm gì?",
          answer: "Vui lòng kiểm tra email và mật khẩu đã nhập đúng chưa. Nếu vẫn không được, hãy thử đặt lại mật khẩu hoặc liên hệ bộ phận hỗ trợ để được giúp đỡ."
        }
      ]
    },
    {
      id: 'payment',
      title: 'Thanh toán & Đơn hàng',
      icon: FiCreditCard,
      faqs: [
        {
          question: "Website hỗ trợ những phương thức thanh toán nào?",
          answer: "Chúng tôi hỗ trợ thanh toán qua thẻ ATM nội địa, thẻ Visa/Mastercard, ví điện tử (MoMo, ZaloPay, ViettelPay), chuyển khoản ngân hàng và thanh toán COD."
        },
        {
          question: "Tôi đã thanh toán nhưng chưa nhận được tài khoản?",
          answer: "Thông thường tài khoản sẽ được gửi trong 5-10 phút sau thanh toán. Nếu quá thời gian này, vui lòng kiểm tra hộp thư spam hoặc liên hệ bộ phận hỗ trợ với mã đơn hàng."
        },
        {
          question: "Làm thế nào để xem lịch sử đơn hàng?",
          answer: "Đăng nhập vào tài khoản, vào mục 'Đơn hàng của tôi' để xem tất cả các đơn hàng đã mua, trạng thái và thông tin chi tiết."
        }
      ]
    },
    {
      id: 'technical',
      title: 'Kỹ thuật & Sử dụng',
      icon: FiSettings,
      faqs: [
        {
          question: "Tài khoản bị lỗi không đăng nhập được, tôi phải làm gì?",
          answer: "Nếu tài khoản bị lỗi trong 7 ngày đầu sử dụng, chúng tôi sẽ đổi tài khoản mới miễn phí. Vui lòng liên hệ hỗ trợ với thông tin tài khoản lỗi và mô tả chi tiết vấn đề."
        },
        {
          question: "Tôi có thể chia sẻ tài khoản cho người khác không?",
          answer: "Mỗi tài khoản được thiết kế để sử dụng cá nhân. Việc chia sẻ có thể dẫn đến vi phạm điều khoản của nhà cung cấp dịch vụ và có thể khiến tài khoản bị khóa."
        },
        {
          question: "Làm sao để tải và cài đặt phần mềm từ tài khoản đã mua?",
          answer: "Sau khi nhận thông tin tài khoản, bạn đăng nhập vào website chính thức của nhà cung cấp, vào mục tải về (Download) và làm theo hướng dẫn cài đặt."
        }
      ]
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Contact form submitted:', contactForm);
    // Show success message or redirect
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
  };

  const handleFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 tracking-tight leading-none">
                Hỗ trợ khách hàng
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Tìm câu trả lời nhanh chóng 
                hoặc liên hệ trực tiếp với đội ngũ chuyên nghiệp.
              </p>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                Kênh hỗ trợ
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Chọn cách thức liên hệ phù hợp nhất với bạn
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportChannels.map((channel, index) => (
                <div key={index} className="group bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 border border-gray-100">
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${channel.bgColor} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <channel.icon className={`w-10 h-10 ${channel.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{channel.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{channel.description}</p>
                  <div className={`text-sm ${channel.color} font-medium mb-6`}>
                    <FiCheckCircle className="w-4 h-4 inline mr-2" />
                    {channel.status}
                  </div>
                  <button className={`w-full ${channel.color.replace('text-', 'bg-').replace('600', '600')} hover:${channel.color.replace('text-', 'bg-').replace('600', '700')} text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2`}>
                    {channel.action}
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Tabs */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                Trung tâm trợ giúp
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Tìm kiếm câu trả lời cho các câu hỏi thường gặp
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-12 bg-gray-50 rounded-2xl p-2 max-w-2xl mx-auto">
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'faq'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Câu hỏi thường gặp
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'contact'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Liên hệ với chúng tôi
              </button>
            </div>

            {/* FAQ Content */}
            {activeTab === 'faq' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* FAQ Categories */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
                    <div className="space-y-2">
                      {faqCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setExpandedFaq(category.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
                            expandedFaq === category.id
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          <category.icon className="w-5 h-5" />
                          {category.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQ List */}
                <div className="lg:col-span-3">
                  {faqCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`${expandedFaq === category.id || expandedFaq === null ? 'block' : 'hidden'}`}
                    >
                      <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                          <category.icon className="w-6 h-6 text-blue-600" />
                          {category.title}
                        </h3>
                        <div className="space-y-4">
                          {category.faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                              <button
                                onClick={() => setExpandedFaq(expandedFaq === `${category.id}-${index}` ? null : `${category.id}-${index}`)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                              >
                                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                                {expandedFaq === `${category.id}-${index}` ? (
                                  <FiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                ) : (
                                  <FiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                )}
                              </button>
                              {expandedFaq === `${category.id}-${index}` && (
                                <div className="px-6 pb-5 border-t border-gray-100">
                                  <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Form */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleContactSubmit} className="bg-gray-50 rounded-3xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={contactForm.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={contactForm.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      name="category"
                      value={contactForm.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
                    >
                      <option value="general">Thông tin chung</option>
                      <option value="account">Tài khoản & Đăng nhập</option>
                      <option value="payment">Thanh toán & Đơn hàng</option>
                      <option value="technical">Kỹ thuật & Sử dụng</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={contactForm.subject}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="Mô tả ngắn gọn vấn đề"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={contactForm.message}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-xl"
                  >
                    Gửi yêu cầu hỗ trợ
                    <FiSend className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Quick Support Info */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Cam kết hỗ trợ
            </h2>
            <p className="text-lg text-gray-600 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm hỗ trợ khách hàng tốt nhất với đội ngũ 
              chuyên nghiệp và thời gian phản hồi nhanh chóng.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <FiClock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phản hồi nhanh</h3>
                <p className="text-gray-600">Trả lời trong vòng 2 giờ</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Giải quyết hiệu quả</h3>
                <p className="text-gray-600">98% vấn đề được xử lý thành công</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-4">
                  <FiHelpCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
                <p className="text-gray-600">Luôn sẵn sàng khi bạn cần</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Support;
