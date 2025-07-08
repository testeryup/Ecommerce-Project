import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, 
    faUser, 
    faStore, 
    faCaretDown, 
    faChevronDown,
    faSearch,
    faBell,
    faSignOutAlt,
    faUserCircle,
    faCog,
    faHeart,
    faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { path } from "../../ultils";
import { logout } from "../../features/auth/authSlice";
import CartPreview from './User/CartPreview';
import { formatCurrency } from '../../ultils';
export default function UserHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const { profile, role } = useSelector(state => state.user);
    const [showCart, setShowCart] = useState(false);
    const { items } = useSelector(state => state.cart);

    useEffect(() => {

    }, [profile]);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate(path.HOME);
    }
    const handleGoHome = () => {
        navigate(path.HOME);
    }

    const roleComponents = {
        seller: (
            <div>
                <Link to={path.SELLER_DASHBOARD} className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                    <FontAwesomeIcon icon={faStore} />
                    <span>Store</span>
                </Link>
            </div>
        ),
        admin: (
            <div>
                <Link to={path.ADMIN_DASHBOARD} className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                    <FontAwesomeIcon icon={faCog} />
                    <span>Admin</span>
                </Link>
            </div>
        ),
        default: (
            <div className='relative'
                onMouseEnter={() => setShowCart(true)}
                onMouseLeave={() => setShowCart(false)}>
                <Link to="/cart" className='relative flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {items?.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{items.length}</span>
                    )}
                </Link>
                {showCart && <CartPreview items={items} />}
            </div>
        )
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className='flex items-center'>
                        <div className="text-2xl font-bold cursor-pointer text-blue-600 hover:text-blue-700 transition-colors" onClick={handleGoHome}>
                            ShopHub
                        </div>
                        <div className="ml-12">
                            <ul className='flex gap-8 cursor-pointer'>
                                <li className='text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium'>
                                    <Link to="/products" className="block">
                                        All Products
                                    </Link>
                                </li>
                                {
                                    auth.isAuthenticated && role === 'user' &&
                                    <li className='text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium'>
                                        <Link to="/topup" className="block">
                                            Top Up
                                        </Link>
                                    </li>
                                }
                                <li className='text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium'>
                                    <Link to="/about" className="block">
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        {
                            profile ?
                                (
                                    <div className="flex items-center space-x-4">
                                        {roleComponents[profile.role] || roleComponents.default}

                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUserCircle} className="text-white text-lg" />
                                        </div>
                                        <div className='relative'>
                                            <div className='flex items-center cursor-pointer group'>
                                                <div className="user-trigger flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                                    <span className="text-gray-700 font-medium">{profile.username ? profile.username : 'undefined'}</span>
                                                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 group-hover:text-gray-700" />
                                                </div>
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                    <Link to={path.PROFILE} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-t-xl">
                                                        <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-500" />
                                                        Profile
                                                    </Link>
                                                    {
                                                        profile.role === 'user' &&
                                                        (<Link to="/orders" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                                            <FontAwesomeIcon icon={faBoxOpen} className="mr-3 text-gray-500" />
                                                            Orders
                                                        </Link>)
                                                    }
                                                    <Link to="/support" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                                        <FontAwesomeIcon icon={faHeart} className="mr-3 text-gray-500" />
                                                        Support Center
                                                    </Link>
                                                    <Link onClick={handleLogout} className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 border-t border-gray-200 rounded-b-xl">
                                                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                                                        Logout
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className='flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm'>
                                                <span className="font-medium">{profile.balance >= 0 ? formatCurrency(profile.balance) : 'not defined!'}</span>
                                                <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
                                            </div>
                                        </div>

                                    </div>
                                )
                                :
                                (<div className=''>
                                    <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium' >
                                        <Link to={path.LOGIN} className="text-white">Login</Link>
                                    </button>
                                </div>)
                        }

                    </div>

                </div>
            </div>
        </div>
    )
}