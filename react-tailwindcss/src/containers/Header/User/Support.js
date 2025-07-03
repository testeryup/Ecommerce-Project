import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faHeadset, 
  faEnvelope, 
  faPhone, 
  faClock, 
  faChevronDown, 
  faChevronUp,
  faLifeRing,
  faComments,
  faBook,
  faTicketAlt,
  faGift,
  faShieldAlt,
  faBug,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// Custom CSS for animations
const customStyles = `
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(-10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

const Support = () => {
    const [activeTab, setActiveTab] = useState('faq');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [contactForm, setContactForm] = useState({
        subject: '',
        message: '',
        priority: 'medium'
    });

    const faqCategories = {
        general: {
            title: 'Câu hỏi chung',
            icon: faQuestionCircle,
            faqs: [
                {
                    id: 1,
                    question: 'OCTOPUS Store là gì?',
                    answer: 'OCTOPUS Store là cửa hàng số chuyên cung cấp các sản phẩm và dịch vụ kỹ thuật số chất lượng cao, từ phần mềm, ứng dụng đến các gói dịch vụ đăng ký premium. Chúng tôi cam kết mang đến trải nghiệm mua sắm số tuyệt vời với hệ thống bảo mật cao và dịch vụ khách hàng 24/7.'
                },
                {
                    id: 2,
                    question: 'Làm thế nào để tạo tài khoản?',
                    answer: 'Bạn có thể tạo tài khoản bằng cách nhấp vào nút "Đăng ký" ở góc phải trên cùng, điền thông tin cần thiết và xác nhận email. Quá trình này chỉ mất vài phút.'
                },
                {
                    id: 3,
                    question: 'Tôi có thể thay đổi thông tin cá nhân không?',
                    answer: 'Có, bạn có thể cập nhật thông tin cá nhân trong phần "Hồ sơ" của tài khoản. Một số thông tin như email có thể cần xác nhận lại.'
                }
            ]
        },
        payment: {
            title: 'Thanh toán & Nạp tiền',
            icon: faGift,
            faqs: [
                {
                    id: 4,
                    question: 'Các phương thức thanh toán nào được hỗ trợ?',
                    answer: 'OCTOPUS Store hỗ trợ đa dạng phương thức thanh toán an toàn: thẻ ngân hàng quốc tế (Visa, Mastercard, JCB), ví điện tử (MoMo, ZaloPay, ShopeePay), chuyển khoản ngân hàng nội địa, QR Banking và thẻ cào điện thoại. Tất cả giao dịch đều được mã hóa bảo mật SSL 256-bit.'
                },
                {
                    id: 5,
                    question: 'Làm sao để nạp tiền vào tài khoản?',
                    answer: 'Truy cập phần "Ví tiền" trong tài khoản của bạn, chọn "Nạp tiền", chọn phương thức và số tiền muốn nạp. Tiền sẽ được cộng vào tài khoản sau khi giao dịch thành công.'
                },
                {
                    id: 6,
                    question: 'Tôi có thể hoàn tiền không?',
                    answer: 'Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày cho sản phẩm lỗi hoặc không đúng mô tả. Hoàn tiền sẽ được xử lý trong 3-5 ngày làm việc.'
                }
            ]
        },
        products: {
            title: 'Sản phẩm & Dịch vụ',
            icon: faShieldAlt,
            faqs: [
                {
                    id: 7,
                    question: 'Làm thế nào để mua sản phẩm?',
                    answer: 'Chọn sản phẩm bạn muốn mua, thêm vào giỏ hàng, kiểm tra thông tin và tiến hành thanh toán. Bạn sẽ nhận được sản phẩm ngay sau khi thanh toán thành công.'
                },
                {
                    id: 8,
                    question: 'Sản phẩm có được bảo hành không?',
                    answer: 'Tất cả sản phẩm đều có chính sách bảo hành. Thời gian bảo hành tùy thuộc vào từng loại sản phẩm và được ghi rõ trong mô tả.'
                },
                {
                    id: 9,
                    question: 'Tôi mua nhầm sản phẩm, có thể đổi không?',
                    answer: 'Bạn có thể đổi sản phẩm trong vòng 24 giờ sau khi mua nếu chưa sử dụng. Liên hệ với bộ phận hỗ trợ để được hướng dẫn chi tiết.'
                }
            ]
        },
        technical: {
            title: 'Hỗ trợ kỹ thuật',
            icon: faBug,
            faqs: [
                {
                    id: 10,
                    question: 'Website bị lỗi, tôi phải làm gì?',
                    answer: 'Hãy thử làm mới trang (F5), xóa cache trình duyệt hoặc thử trên trình duyệt khác. Nếu vẫn gặp vấn đề, hãy liên hệ với bộ phận kỹ thuật.'
                },
                {
                    id: 11,
                    question: 'Sản phẩm không hoạt động sau khi mua?',
                    answer: 'Kiểm tra hướng dẫn sử dụng trong email xác nhận. Nếu vẫn gặp vấn đề, liên hệ hỗ trợ kỹ thuật với thông tin chi tiết về lỗi.'
                },
                {
                    id: 12,
                    question: 'Tôi quên mật khẩu, làm sao để khôi phục?',
                    answer: 'Nhấp vào "Quên mật khẩu" ở trang đăng nhập, nhập email đăng ký và làm theo hướng dẫn trong email khôi phục được gửi đến.'
                }
            ]
        }
    };

    const contactInfo = {
        email: 'support@octopusstore.vn',
        phone: '1900 9999',
        workingHours: '24/7 - Luôn sẵn sàng hỗ trợ',
        address: 'Tầng 15, Tòa nhà OCTOPUS Tower, 456 Nguyễn Huệ, Quận 1, TP.HCM',
        facebook: 'fb.com/octopusstore.vn',
        zalo: 'zalo.me/octopusstore'
    };

    const supportChannels = [
        {
            title: 'Live Chat',
            description: 'Trò chuyện trực tuyến với đội ngũ hỗ trợ',
            icon: faComments,
            status: 'online',
            action: 'Bắt đầu chat'
        },
        {
            title: 'Email Support',
            description: 'Gửi email cho chúng tôi',
            icon: faEnvelope,
            status: 'available',
            action: 'Gửi email'
        },
        {
            title: 'Tạo Ticket',
            description: 'Tạo yêu cầu hỗ trợ chi tiết',
            icon: faTicketAlt,
            status: 'available',
            action: 'Tạo ticket'
        },
        {
            title: 'Hướng dẫn',
            description: 'Xem tài liệu hướng dẫn chi tiết',
            icon: faBook,
            status: 'available',
            action: 'Xem hướng dẫn'
        }
    ];

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleContactFormChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContactFormSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Contact form submitted:', contactForm);
        alert('Yêu cầu hỗ trợ đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
        setContactForm({ subject: '', message: '', priority: 'medium' });
    };

    const filteredFaqs = searchQuery 
        ? Object.values(faqCategories).flatMap(category => 
            category.faqs.filter(faq => 
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
        : faqCategories[selectedCategory].faqs;

    return (
        <>
            <style>{customStyles}</style>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                <FontAwesomeIcon icon={faLifeRing} className="text-4xl" />
                            </div>
                            <h1 className="text-5xl font-black mb-4 tracking-tight">
                                Trung tâm hỗ trợ
                            </h1>
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                                Chúng tôi luôn sẵn sàng giúp đỡ bạn. Tìm câu trả lời nhanh chóng hoặc liên hệ trực tiếp với đội ngũ hỗ trợ chuyên nghiệp.
                            </p>
                            
                            {/* Quick Search */}
                            <div className="mt-8 max-w-2xl mx-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm câu trả lời..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="w-full px-6 py-4 pl-12 pr-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-300 text-base"
                                    />
                                    <FontAwesomeIcon 
                                        icon={faQuestionCircle} 
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
                                    />
                                    <button 
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                                        onClick={() => setActiveTab('faq')}
                                    >
                                        Tìm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                            <button
                                className={`px-8 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 font-semibold ${
                                    activeTab === 'faq'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => setActiveTab('faq')}
                            >
                                <FontAwesomeIcon icon={faQuestionCircle} />
                                <span>Câu hỏi thường gặp</span>
                            </button>
                            <button
                                className={`px-8 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 font-semibold ${
                                    activeTab === 'contact'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => setActiveTab('contact')}
                            >
                                <FontAwesomeIcon icon={faHeadset} />
                                <span>Liên hệ hỗ trợ</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'faq' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            
                            {/* FAQ Categories */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        {searchQuery ? 'Kết quả tìm kiếm' : 'Danh mục'}
                                    </h3>
                                    {!searchQuery && (
                                        <div className="space-y-2">
                                            {Object.entries(faqCategories).map(([key, category]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedCategory(key)}
                                                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-left ${
                                                        selectedCategory === key
                                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    <FontAwesomeIcon icon={category.icon} />
                                                    <span className="font-medium">{category.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {searchQuery && (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Tìm thấy {filteredFaqs.length} kết quả cho "{searchQuery}"
                                            </p>
                                            <button 
                                                onClick={() => setSearchQuery('')}
                                                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                            >
                                                Xóa tìm kiếm
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FAQ Content */}
                            <div className="lg:col-span-3">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                            <FontAwesomeIcon 
                                                icon={searchQuery ? faQuestionCircle : faqCategories[selectedCategory].icon} 
                                                className="text-blue-600 dark:text-blue-400" 
                                            />
                                            <span>
                                                {searchQuery ? 'Kết quả tìm kiếm' : faqCategories[selectedCategory].title}
                                            </span>
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredFaqs.length > 0 ? (
                                            filteredFaqs.map((faq) => (
                                                <div key={faq.id} className="group">
                                                    <button
                                                        className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                                        onClick={() => toggleFaq(faq.id)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                                {faq.question}
                                                            </h3>
                                                            <FontAwesomeIcon 
                                                                icon={expandedFaq === faq.id ? faChevronUp : faChevronDown}
                                                                className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200"
                                                            />
                                                        </div>
                                                    </button>
                                                    {expandedFaq === faq.id && (
                                                        <div className="px-6 pb-6 animate-fade-in">
                                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500">
                                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                                    {faq.answer}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-12 text-center">
                                                <FontAwesomeIcon icon={faQuestionCircle} className="text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Không tìm thấy kết quả
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Thử tìm kiếm với từ khóa khác hoặc liên hệ trực tiếp với chúng tôi.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            
                            {/* Support Channels */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {supportChannels.map((channel, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <FontAwesomeIcon icon={channel.icon} className="text-2xl text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                {channel.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                                {channel.description}
                                            </p>
                                            <div className="flex items-center justify-center space-x-2 mb-4">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    channel.status === 'online' ? 'bg-green-500' : 'bg-blue-500'
                                                }`}></div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {channel.status === 'online' ? 'Trực tuyến' : 'Khả dụng'}
                                                </span>
                                            </div>
                                            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium">
                                                {channel.action}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Contact Details */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faHeadset} className="text-blue-600 dark:text-blue-400" />
                                        <span>Thông tin liên hệ</span>
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium">{contactInfo.email}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Phản hồi trong vòng 24h</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FontAwesomeIcon icon={faPhone} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Hotline</h4>
                                                <p className="text-green-600 dark:text-green-400 font-medium text-xl">{contactInfo.phone}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Miễn phí cuộc gọi</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FontAwesomeIcon icon={faClock} className="text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Giờ làm việc</h4>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">{contactInfo.workingHours}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Hỗ trợ toàn thời gian</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FontAwesomeIcon icon={faHeadset} className="text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Địa chỉ</h4>
                                                <p className="text-gray-700 dark:text-gray-300">{contactInfo.address}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Trụ sở chính</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Contact Form */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faLightbulb} className="text-blue-600 dark:text-blue-400" />
                                        <span>Gửi yêu cầu hỗ trợ</span>
                                    </h3>
                                    <form onSubmit={handleContactFormSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Chủ đề
                                            </label>
                                            <select 
                                                name="subject"
                                                value={contactForm.subject}
                                                onChange={handleContactFormChange}
                                                required
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                            >
                                                <option value="">Chọn chủ đề</option>
                                                <option value="payment">Vấn đề thanh toán</option>
                                                <option value="technical">Lỗi kỹ thuật</option>
                                                <option value="product">Hỏi về sản phẩm</option>
                                                <option value="account">Vấn đề tài khoản</option>
                                                <option value="feedback">Góp ý</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Mức độ ưu tiên
                                            </label>
                                            <select 
                                                name="priority"
                                                value={contactForm.priority}
                                                onChange={handleContactFormChange}
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                            >
                                                <option value="low">Thấp</option>
                                                <option value="medium">Trung bình</option>
                                                <option value="high">Cao</option>
                                                <option value="urgent">Khẩn cấp</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tin nhắn
                                            </label>
                                            <textarea 
                                                name="message"
                                                value={contactForm.message}
                                                onChange={handleContactFormChange}
                                                required
                                                rows="4" 
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                                                placeholder="Mô tả chi tiết vấn đề của bạn..."
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit"
                                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!contactForm.subject || !contactForm.message}
                                        >
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                            Gửi yêu cầu hỗ trợ
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Support;