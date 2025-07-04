import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import { toast } from 'react-hot-toast';
import { getUserBalance, createPaymentLink } from "../../services/userService";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
const ProductDisplay = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isCreatingLink, setIsCreatingLink] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");
    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: window.location.origin,
        ELEMENT_ID: "embedded-payment-container",
        CHECKOUT_URL: null,
        embedded: true,
        onSuccess: (event) => {
            setIsOpen(false);
            setMessage("Nạp tiền thành công!");
            // You might want to refresh the balance here
        },
    });

    const { open, exit } = usePayOS(payOSConfig);

    const handleGetPaymentLink = async () => {
        if (!validateAmount(amount)) {
            return;
        }
        try {
            setIsCreatingLink(true);
            exit();
            // const response = await fetch(
            //     `${process.env.REACT_APP_BACKEND_URL}/create-embedded-payment-link`,
            //     {
            //         method: "POST",
            //         credentials: 'include'
            //     }
            // );

            // if (!response.ok) {
            //     throw new Error('Không thể tạo liên kết thanh toán');
            // }

            const result = await createPaymentLink(amount);
            setPayOSConfig((oldConfig) => ({
                ...oldConfig,
                CHECKOUT_URL: result.checkoutUrl || result.data?.checkoutUrl,
            }));

            setIsOpen(true);
        } catch (error) {
            toast.error('Không thể tạo liên kết thanh toán');
            console.log("error:", error.message);
        } finally {
            setIsCreatingLink(false);
        }
    };

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
    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL != null) {
            open();
        }
    }, [payOSConfig]);

    // You might want to fetch current balance when component mounts
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await getUserBalance();
                setCurrentBalance(response.data || 0);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
                toast.error('Không thể tải thông tin số dư');
            }
        };

        fetchBalance();
    }, []);

    return message ? (
        <Message message={message} />
    ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            💳 Nạp tiền vào tài khoản
                        </h1>
                        <p className="text-blue-100">
                            Thanh toán an toàn và bảo mật qua PayOS
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Balance Info */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                                        Số dư hiện tại
                                    </span>
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBalance)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                                        Số tiền nạp tối thiểu
                                    </span>
                                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                        10.000₫
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-8">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Số tiền muốn nạp
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Nhập số tiền"
                                    className={`w-full px-4 py-3 pr-16 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        error 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                                    VND
                                </span>
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Chọn nhanh số tiền
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[50000, 100000, 200000, 500000].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => {
                                            setAmount(value);
                                            validateAmount(value);
                                        }}
                                        className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 text-center font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        {new Intl.NumberFormat('vi-VN').format(value)}₫
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Actions */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            {!isOpen ? (
                                <div className="space-y-4">
                                    {isCreatingLink ? (
                                        <div className="flex items-center justify-center p-8">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-gray-600 dark:text-gray-400">Đang tạo liên kết thanh toán...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(event) => {
                                                event.preventDefault();
                                                handleGetPaymentLink();
                                            }}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span>Nạp tiền ngay</span>
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setIsOpen(false);
                                            exit();
                                        }}
                                        className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Đóng cửa sổ thanh toán</span>
                                    </button>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start space-x-3">
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            Sau khi thanh toán thành công, vui lòng đợi 5-10 giây để hệ thống cập nhật số dư.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div id="embedded-payment-container" className="mt-6"></div>
                </div>
            </div>
        </div>
    );
};
const Message = ({ message }) => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{message}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Giao dịch của bạn đã được xử lý thành công
                    </p>
                    <button 
                        onClick={navigateToHome}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        <span>Quay lại trang chủ</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Topup = () => {
    return <ProductDisplay />;
};

export default Topup;