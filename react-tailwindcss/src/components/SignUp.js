import Layout from './Layout';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { register } from '../features/auth/authSlice';
import { path } from '../ultils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faUser,
  faEye, 
  faEyeSlash,
  faSpinner,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [username, setUserName] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        hasLength: false,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    
    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(path.HOME);
        }
    }, [auth.isAuthenticated, navigate]);

    // Check password strength
    useEffect(() => {
        setPasswordStrength({
            hasLength: password.length >= 8,
            hasLower: /[a-z]/.test(password),
            hasUpper: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    const handleSignUp = async () => {
        // Reset error
        setError(null);

        if (!email || !password || !username || !verifyPassword) {
            setError("Tất cả các trường là bắt buộc");
            return;
        }

        if (password !== verifyPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email không hợp lệ");
            return;
        }

        try {
            await dispatch(register({ email, password, username, verifyPassword })).unwrap();
            toast.success('Đăng ký tài khoản thành công!');
        } catch (err) {
            setError(err);
        }
    }

    const handleLogin = () => {
        navigate(path.LOGIN);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    }

    const PasswordStrengthIndicator = ({ condition, text }) => (
        <div className={`flex items-center space-x-2 text-xs ${condition ? 'text-green-600' : 'text-gray-400'}`}>
            <FontAwesomeIcon icon={condition ? faCheck : faTimes} className="w-3 h-3" />
            <span>{text}</span>
        </div>
    );

    return (
        <Layout>
            <div className='min-h-screen bg-white flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-md w-full'>
                    <div className='bg-white rounded-3xl shadow-2xl p-10 border border-gray-100/50 backdrop-blur-xl'>
                        {/* Header */}
                        <div className='text-center mb-10'>
                            <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
                                <div className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200">
                                    <span className="text-2xl">🐙</span>
                                </div>
                                <span className="text-2xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                    Octopus Store
                                </span>
                            </Link>
                            <h1 className='text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight'>
                                Đăng ký
                            </h1>
                            <p className='text-xl text-gray-600 font-light'>Nhập thông tin tài khoản</p>
                        </div>
                        
                        <div className='space-y-8'>
                            {/* Email Field */}
                            <div className='space-y-3'>
                                <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="email" 
                                        placeholder="Nhập email"
                                        id="email"
                                        className='block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg'
                                        onChange={(event) => setEmail(event.target.value)}
                                        value={email}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>
                            
                            {/* Username Field */}
                            <div className='space-y-3'>
                                <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập username"
                                        id="username"
                                        className='block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg'
                                        onChange={(event) => setUserName(event.target.value)}
                                        value={username}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>
                            
                            {/* Password Field */}
                            <div className='space-y-3'>
                                <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Mật khẩu</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        id="password"
                                        className='block w-full pl-12 pr-14 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg'
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
                                
                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="mt-3 p-4 bg-gray-50/50 rounded-xl space-y-2">
                                        <div className="text-sm font-medium text-gray-700 mb-3">Độ mạnh mật khẩu:</div>
                                        <PasswordStrengthIndicator condition={passwordStrength.hasLength} text="Ít nhất 8 ký tự" />
                                        <PasswordStrengthIndicator condition={passwordStrength.hasLower} text="Chữ thường (a-z)" />
                                        <PasswordStrengthIndicator condition={passwordStrength.hasUpper} text="Chữ hoa (A-Z)" />
                                        <PasswordStrengthIndicator condition={passwordStrength.hasNumber} text="Số (0-9)" />
                                        <PasswordStrengthIndicator condition={passwordStrength.hasSpecial} text="Ký tự đặc biệt" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Verify Password Field */}
                            <div className='space-y-3'>
                                <label htmlFor="verifyPassword" className='block text-sm font-medium text-gray-700'>Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type={showVerifyPassword ? "text" : "password"}
                                        placeholder="Xác nhận mật khẩu"
                                        id="verifyPassword"
                                        className={`block w-full pl-12 pr-14 py-4 bg-gray-50/50 border rounded-2xl focus:ring-2 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg ${
                                            verifyPassword && password !== verifyPassword 
                                                ? 'border-red-300 focus:ring-red-500' 
                                                : verifyPassword && password === verifyPassword
                                                ? 'border-green-300 focus:ring-green-500'
                                                : 'border-gray-200 focus:ring-blue-500'
                                        }`}
                                        onChange={(event) => setVerifyPassword(event.target.value)}
                                        value={verifyPassword}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors duration-200"
                                        onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                                    >
                                        <FontAwesomeIcon 
                                            icon={showVerifyPassword ? faEyeSlash : faEye} 
                                            className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        />
                                    </button>
                                </div>
                                {verifyPassword && password !== verifyPassword && (
                                    <p className="text-sm text-red-600 mt-2 font-medium">Mật khẩu xác nhận không khớp</p>
                                )}
                                {verifyPassword && password === verifyPassword && (
                                    <p className="text-sm text-green-600 mt-2 font-medium">Mật khẩu khớp</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Error Display */}
                        {error && (
                            <div className="mt-8 p-4 bg-red-50/50 border border-red-200 rounded-2xl backdrop-blur-sm">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-red-500 mr-3" />
                                    <span className="text-red-700 text-sm font-medium">{error}</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Register Button */}
                        <button
                            className="group w-full mt-8 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSignUp}
                            disabled={auth.loading}
                        >
                            {auth.loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                                    Đang đăng ký tài khoản...
                                </>
                            ) : (
                                <>
                                    Đăng ký tài khoản
                                    <FontAwesomeIcon icon={faUser} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                        
                        {/* Login Link */}
                        <div className="text-center mt-8">
                            <span className='text-gray-600 font-light'>Đã có tài khoản? Vậy thì </span>
                            <button
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                onClick={handleLogin}
                            >
                                Đăng nhập luôn
                            </button>
                        </div>
                    </div>

                    {/* Terms Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500 font-light">
                        <p>
                            Bằng việc đăng ký, bạn đồng ý với{' '}
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
    )
}
