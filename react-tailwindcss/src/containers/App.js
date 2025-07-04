import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { path } from '../ultils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../features/user/userSlice';

import { setAuthToken } from '../axios';

import Application from '../components/Application';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import { SellerDashboard } from '../containers/System';
import UserDashboard from '../containers/System/UserDashboard';
import AdminApp from '../components/admin/AdminApp';
import AdminDemo from '../components/admin/AdminDemo';
import UserProfile from './Header/User/UserProfile';
import Loading from '../components/Loading';
import ProductDetail from '../components/ProductDetailV2';
import CartPage from './Header/User/Checkout/CartPage';
import Checkout from './Header/User/Checkout/Checkout';
import PaymentSuccess from './Header/User/PaymentSuccess';
import MyOrders from './Header/User/MyOrders';
import OrderDetail from './Header/User/OrderDetail';
import Support from './Header/User/Support';
import TransactionHistory from './Header/User/TransactionHistory';
import Topup from './HomePage/Topup';
import About from '../components/About';
import AllProducts from '../components/AllProducts.js'
import SearchResults from './Search/SearchResults';
import { Toaster } from 'react-hot-toast';

export default function App() {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('Initializing auth, token:', auth.token);
            console.log('Auth state:', auth);
            
            if (auth.token) {
                console.log('Setting auth token on app initialization:', auth.token);
                setAuthToken(auth.token);
                
                try {
                    await dispatch(fetchUserProfile());
                    console.log('User profile fetched successfully');
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                }
            } else {
                console.log('No token found in auth state');
            }
            setIsInitialized(true);
        };
        initializeAuth();
    }, [dispatch, auth.token]);

    if (!isInitialized) return <Loading></Loading>;

    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '10px',
                    },
                    success: {
                        icon: '🎉',
                        style: {
                            background: 'linear-gradient(to right, #00b09b, #96c93d)',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#00b09b',
                        }
                    },
                    error: {
                        icon: '❌',
                        style: {
                            background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#ff5f6d',
                        }
                    }
                }}
                gutter={8}
                containerStyle={{
                    top: 20,
                    right: 20,
                }}
                containerClassName="toast-container"
            />
            <Routes>

                <Route path={path.UNAUTHORIZED} element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Truy cập bị từ chối</p>
                            <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                Về trang chủ
                            </a>
                        </div>
                    </div>
                } />
                <Route path={path.HOME} element={<Home></Home>} />
                <Route path={path.APP} element={<Application />} />
                <Route path={path.LOGIN} element={<Login />} />
                <Route path={path.SIGNUP} element={auth.isAuthenticated ? <Home></Home> : <Register></Register>}></Route>
                <Route
                    path={path.PRODUCT}
                    element={<ProductDetail />}
                />
                <Route
                    path={path.USER_DASHBOARD}
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={path.PROFILE}
                    element={
                        <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={path.SELLER_DASHBOARD}
                    element={
                        <ProtectedRoute allowedRoles={['seller']}>
                            <SellerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminApp />
                        </ProtectedRoute>
                    }
                />
                <Route path={path.CHECKOUT} element={<Checkout></Checkout>}></Route>
                <Route path={path.CART} element={<CartPage />} />
                <Route path={path.CHECKOUT_SUCCESS} element={<PaymentSuccess></PaymentSuccess>}></Route>
                <Route path={path.VIEWORDER} element={
                    <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
                        <OrderDetail />
                    </ProtectedRoute>
                }></Route>
                <Route path={path.ORDERS} element={
                    <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
                        <MyOrders />
                    </ProtectedRoute>
                }></Route>
                <Route path={path.SUPPORT} element={
                    <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
                        <Support />
                    </ProtectedRoute>
                }></Route>
                <Route path={path.TRANSACTIONS} element={
                    <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
                        <TransactionHistory />
                    </ProtectedRoute>
                }></Route>
                <Route path={path.TOPUP} element={
                    <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
                        <Topup />
                    </ProtectedRoute>
                }></Route>
                <Route path="/products" element={<AllProducts />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin-demo" element={<AdminDemo />} />
                {/* Catch-All Route */}
                <Route path='*' element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                            <p className="text-xl text-gray-600 mb-8">Trang không tìm thấy</p>
                            <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                Về trang chủ
                            </a>
                        </div>
                    </div>
                } />


            </Routes>
        </>
    );
}