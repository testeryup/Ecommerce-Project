import Layout from './Layout';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { register } from '../features/auth/authSlice';
import { path } from '../ultils';

export default function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [username, setUserName] = useState('');
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(path.HOME);
        }
    }, [auth.isAuthenticated, navigate]);
    
    const handleSignUp = async () => {
        if (!email || !password || !username || !verifyPassword) {
            setError("Email, password, and Username are required");
            return;
        }
        try {
            await dispatch(register({ email, password, username, verifyPassword })).unwrap();
        } catch (err) {
            setError(err);
        }
    }

    const handleLogin = () => {
        navigate(path.LOGIN)
    }
    
    return (
        <Layout>
            <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-md w-full space-y-8'>
                    <div className='bg-white rounded-xl shadow-lg p-8'>
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Đăng ký tài khoản</h2>
                            <p className='text-gray-600'>Nhập thông tin tài khoản</p>
                        </div>
                        
                        <div className='space-y-6'>
                            <div className='form-group'>
                                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                <input 
                                    type="email" 
                                    placeholder="Nhập email"
                                    id="email"
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                                    onChange={(event) => setEmail(event.target.value)}
                                    value={email}
                                />
                            </div>
                            
                            <div className='form-group'>
                                <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>Mật khẩu</label>
                                <input 
                                    type="password" 
                                    placeholder="Nhập mật khẩu"
                                    id="password"
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                />
                            </div>
                            
                            <div className='form-group'>
                                <label htmlFor="verifyPassword" className='block text-sm font-medium text-gray-700 mb-2'>Xác nhận mật khẩu</label>
                                <input 
                                    type="password" 
                                    placeholder="Xác nhận mật khẩu"
                                    id="verifyPassword"
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                                    onChange={(event) => setVerifyPassword(event.target.value)}
                                    value={verifyPassword}
                                />
                            </div>
                            
                            <div className='form-group'>
                                <label htmlFor="username" className='block text-sm font-medium text-gray-700 mb-2'>Username</label>
                                <input 
                                    type="text" 
                                    placeholder="Nhập username"
                                    id="username"
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                                    onChange={(event) => setUserName(event.target.value)}
                                    value={username}
                                />
                            </div>
                        </div>
                        
                        {error &&
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <span className="text-red-600 text-sm">{error}</span>
                            </div>
                        }
                        
                        <button
                            className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            onClick={handleSignUp}
                            disabled={auth.loading}
                        >
                            {auth.loading ? 'Đang đăng ký tài khoản...' : 'Đăng ký tài khoản'}
                        </button>
                        
                        <div className="text-center mt-6">
                            <span className='text-gray-600'>Đã có tài khoản? Vậy thì </span>
                            <span className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium" onClick={handleLogin}>Đăng nhập luôn</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
