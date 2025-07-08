import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { login } from "../features/auth/authSlice";
import { path } from "../ultils";
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (auth.isAuthenticated && user.role) {
            // Navigate based on role
            switch (user.role) {
                case 'seller':
                    navigate(path.SELLER_DASHBOARD);
                    break;
                case 'admin':
                    navigate(path.ADMIN_DASHBOARD);
                    break;
                default:
                    navigate(path.HOME);
            }
        }
    }, [auth.isAuthenticated, user.role, navigate]);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Email và mật khẩu là bắt buộc");
            return;
        }

        try {
            await dispatch(login({ email, password })).unwrap();
            toast.success('Đăng nhập thành công!');
        } catch (error) {
            setError(error || 'Đăng nhập thất bại');
        }
    }

    const handleSignup = () => {
        navigate(path.SIGNUP);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <Layout>
            <div className="min-h-screen bg-white flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100/50 backdrop-blur-xl">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
                                <div className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200">
                                    <span className="text-2xl">🐙</span>
                                </div>
                                <span className="text-2xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                    Octopus Store
                                </span>
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
                                Xin chào
                            </h1>
                            <p className="text-xl text-gray-600 font-light">Vui lòng nhập thông tin của bạn</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-8">
                            {/* Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Tài khoản
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Nhập email hoặc username"
                                        className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg"
                                        onChange={(event) => setEmail(event.target.value)}
                                        value={email}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Nhập mật khẩu"
                                        className="block w-full pl-12 pr-14 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg"
                                        onChange={(event) => setPassword(event.target.value)}
                                        value={password}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors duration-200"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon 
                                            icon={showPassword ? faEyeSlash : faEye} 
                                            className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Error Display and Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    {error && (
                                        <span className="text-sm text-red-600 font-medium">{error}</span>
                                    )}
                                </div>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleLogin}
                                disabled={auth.loading}
                                className="group w-full bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {auth.loading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    <>
                                        Đăng nhập
                                        <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <span className="text-gray-600 font-light">Không có tài khoản? </span>
                                <button
                                    onClick={handleSignup}
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                >
                                    Đăng ký ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500 font-light">
                        <p>
                            Bằng việc đăng nhập, bạn đồng ý với{' '}
                            <Link to="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
                                Điều khoản dịch vụ
                            </Link>{' '}
                            và{' '}
                            <Link to="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
                                Chính sách bảo mật
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
            </div>
        </Layout>
    );
}
