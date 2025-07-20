import React, { useState, useEffect, useCallback } from "react";
import { usePayOS } from "@payos/payos-checkout";
import { toast } from 'react-hot-toast';
import { getUserBalance, createPaymentLink } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { setAuthToken } from '../../axios';
import Breadcrumb from '../ui/Breadcrumb';
import { 
  Wallet,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Zap,
  DollarSign,
  Gift,
  TrendingUp,
  Clock,
  X
} from 'lucide-react';

const TopupComponent = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !token) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng này');
      navigate('/login');
      return;
    }
  }, [isAuthenticated, token, navigate]);
  
  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.origin,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: null,
    embedded: true,
    onSuccess: (event) => {
      setIsOpen(false);
      setMessage("Nạp tiền thành công!");
      // Refresh balance
      fetchBalance();
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const quickAmounts = [
    { value: 50000, label: '50K', popular: false },
    { value: 100000, label: '100K', popular: true },
    { value: 200000, label: '200K', popular: false },
    { value: 500000, label: '500K', popular: true },
    { value: 1000000, label: '1M', popular: false },
    { value: 2000000, label: '2M', popular: false }
  ];

  const benefits = [
    { icon: Zap, title: 'Thanh toán nhanh chóng', desc: 'Giao dịch được xử lý trong vài giây' },
    { icon: Shield, title: 'Bảo mật tối đa', desc: 'Được bảo vệ bởi công nghệ PayOS' },
    { icon: Gift, title: 'Không phí giao dịch', desc: 'Miễn phí cho mọi giao dịch nạp tiền' },
    { icon: TrendingUp, title: 'Tích lũy điểm thưởng', desc: 'Nhận điểm cho mỗi lần nạp tiền' }
  ];

  const fetchBalance = useCallback(async () => {
    try {
      // Ensure token is set
      if (token) {
        setAuthToken(token);
      } else {
        toast.error('Bạn cần đăng nhập để sử dụng tính năng này');
        return;
      }
      
      const response = await getUserBalance();
      if (response.ok === 1) {
        setCurrentBalance(response.data);
      } else {
        toast.error('Không thể tải thông tin số dư');
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
      } else {
        toast.error('Không thể tải thông tin số dư');
      }
    }
  }, [token]);

  const validateAmount = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return false;
    }
    if (numValue < 10000) {
      setError("Số tiền nạp tối thiểu là 10.000₫");
      return false;
    }
    if (numValue > 50000000) {
      setError("Số tiền nạp tối đa là 50.000.000₫");
      return false;
    }
    setError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
    validateAmount(value);
  };

  const handleQuickAmount = (value) => {
    setAmount(value);
    validateAmount(value);
  };

  const handleGetPaymentLink = async () => {
    if (!validateAmount(amount)) {
      return;
    }
    
    try {
      // Ensure token is set
      if (token) {
        setAuthToken(token);
      } else {
        toast.error('Bạn cần đăng nhập để sử dụng tính năng này');
        return;
      }
      
      setIsCreatingLink(true);
      exit();
      
      const result = await createPaymentLink(amount);
      
      let checkoutUrl = result.checkoutUrl || result.data?.checkoutUrl;
      
      setPayOSConfig((oldConfig) => ({
        ...oldConfig,
        CHECKOUT_URL: checkoutUrl,
      }));

      setIsOpen(true);
    } catch (error) {
      console.error('Payment link error:', error);
      if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
      } else {
        toast.error('Không thể tạo liên kết thanh toán');
      }
    } finally {
      setIsCreatingLink(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig, open]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  if (message) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{message}</h3>
            <p className="text-gray-600 mb-8">
              Số dư của bạn đã được cập nhật thành công
            </p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-2xl transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Nạp tiền vào tài khoản
              </h1>
              <p className="text-lg text-gray-600">
                Nạp tiền nhanh chóng, an toàn với PayOS
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Balance */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Số dư hiện tại</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {formatCurrency(currentBalance)}
                  </div>
                </div>
                <button 
                  onClick={fetchBalance}
                  className="p-3 bg-white/80 hover:bg-white rounded-2xl transition-colors"
                >
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Nhập số tiền nạp</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Số tiền (VND)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className={`w-full px-6 py-4 text-xl font-semibold border-2 rounded-2xl focus:outline-none transition-all ${
                        error 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white'
                      }`}
                    />
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                      <DollarSign className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-3 flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chọn nhanh
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map(({ value, label, popular }) => (
                      <button
                        key={value}
                        onClick={() => handleQuickAmount(value)}
                        className={`relative px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                          amount === value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {popular && (
                          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Phổ biến
                          </div>
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              {!isOpen ? (
                <div className="space-y-4">
                  {isCreatingLink ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Đang tạo liên kết thanh toán...</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleGetPaymentLink}
                      disabled={!amount || error}
                      className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <CreditCard className="h-6 w-6" />
                      Tiến hành thanh toán
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      exit();
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <X className="h-5 w-5" />
                    Đóng cửa sổ thanh toán
                  </button>

                  <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      Vui lòng hoàn tất thanh toán trong cửa sổ bên dưới. Số dư sẽ được cập nhật sau khi giao dịch thành công.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Container */}
            <div id="embedded-payment-container" className="rounded-5xl overflow-hidden shadow-sm h-[600px]"></div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tại sao chọn chúng tôi?</h3>
              <div className="space-y-6">
                {benefits.map(({ icon: Icon, title, desc }, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin thanh toán</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí giao dịch:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian xử lý:</span>
                  <span className="font-medium">Tức thì</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hạn mức tối thiểu:</span>
                  <span className="font-medium">10.000₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hạn mức tối đa:</span>
                  <span className="font-medium">50.000.000₫</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Bảo mật bởi PayOS</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-3xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cần hỗ trợ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Đội ngũ hỗ trợ 24/7 sẵn sàng giúp bạn
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  Liên hệ hỗ trợ →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopupComponent;
