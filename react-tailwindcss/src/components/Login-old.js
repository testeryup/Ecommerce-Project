import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import { path } from '../ultils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle as fabGoogle, faFacebook as fabFacebook, faApple as fabApple } from '@fortawesome/free-brands-svg-icons';
import Layout from './Layout';
import Button from './ui/Button';
import Input from './ui/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '', // Pre-filled for testing
    password: '', // Pre-filled for testing
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (auth.isAuthenticated && user.role) {
      // Redirect based on user role using constants
      console.log('User authenticated with role:', user.role);
      switch (user.role) {
        case 'admin':
          navigate(path.ADMIN_DASHBOARD);
          break;
        case 'seller':
          navigate(path.SELLER_DASHBOARD);
          break;
        case 'user':
          navigate(path.USER_DASHBOARD);
          break;
        default:
          navigate(path.HOME);
      }
    }
  }, [auth.isAuthenticated, user.role, navigate]);

  useEffect(() => {
    if (auth.error) {
      toast.error(auth.error);
      dispatch(clearError());
    }
  }, [auth.error, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password
      }));
      
      if (login.fulfilled.match(result)) {
        toast.success('Đăng nhập thành công!');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">O</span>
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">Chào mừng trở lại</h1>
              <p className="text-gray-600 font-light">Đăng nhập vào tài khoản Octopus Store của bạn</p>
            </div>

            {/* Social Login */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => handleSocialLogin('microsoft')}
                className="w-full flex items-center justify-center px-6 py-4 border border-gray-200 rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium"
              >
                <div className="w-5 h-5 bg-blue-600 rounded mr-3"></div>
                Tiếp tục với Microsoft
              </button>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center px-4 py-4 border border-gray-200 rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={fabGoogle} className="text-red-500 w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex items-center justify-center px-4 py-4 border border-gray-200 rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={fabFacebook} className="text-blue-600 w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSocialLogin('apple')}
                  className="flex items-center justify-center px-4 py-4 border border-gray-200 rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={fabApple} className="text-gray-900 w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">hoặc</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <Input
                type="email"
                label="Email"
                icon={faEnvelope}
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                error={localErrors.email}
              />

              {/* Password */}
              <Input
                type="password"
                label="Mật khẩu"
                icon={faLock}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                name="password"
                error={localErrors.password}
              />
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {localErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{localErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={auth.loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {auth.loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>

          {/* Terms Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
