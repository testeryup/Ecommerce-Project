import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from "./Header";
import Footer from "./Footer";
import { getProducts, getCategory } from '../services/userService';
import { addToCart } from '../features/cart/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFilter, 
    faSort, 
    faTh,
    faList,
    faStar,
    faShoppingCart,
    faHeart,
    faEye,
    faPlay,
    faDesktop,
    faMusic,
    faShield,
    faGraduationCap,
    faGamepad,
    faTag,
    faFire,
    faCrown
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const Products = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'all',
        subcategory: 'all',
        search: '',
        sort: 'newest'
    });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeSubcategories, setActiveSubcategories] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    // Helper function to get category icons
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Giải trí': '🎬',
            'Entertainment': '🎬',
            'Streaming': '📺',
            'Năng suất': '💼',
            'Productivity': '💼',
            'Office': '📊',
            'Âm nhạc': '🎵',
            'Music': '🎵',
            'Bảo mật': '🔒',
            'Security': '🔒',
            'Giáo dục': '🎓',
            'Education': '🎓',
            'Gaming': '🎮',
            'Trò chơi': '🎮'
        };
        return iconMap[categoryName] || '📦';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = (product) => {
        if (product.skus && product.skus.length > 0) {
            dispatch(addToCart({
                product: product,
                sku: product.skus[0],
                quantity: 1
            }));
            toast.success('Đã thêm vào giỏ hàng');
        } else {
            toast.error('Sản phẩm không có phiên bản để thêm vào giỏ');
        }
    };

    const handleViewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsResponse, categoriesResponse] = await Promise.all([
                    getProducts(),
                    getCategory()
                ]);

                if (productsResponse.errCode === 0) {
                    setProducts(productsResponse.data);
                    setFilteredProducts(productsResponse.data);
                }
                if (categoriesResponse && categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (filters.category !== 'all') {
            const category = categories.find(cat => cat._id === filters.category);
            setActiveSubcategories(category?.subcategories || []);
        } else {
            setActiveSubcategories([]);
        }
    }, [filters.category, categories]);

    useEffect(() => {
        let result = [...products];

        // Apply category filter
        if (filters.category !== 'all') {
            result = result.filter(product => product.category === filters.category);
        }

        // Apply subcategory filter
        if (filters.subcategory !== 'all') {
            result = result.filter(product => product.subcategory === filters.subcategory);
        }

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(product => 
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        switch (filters.sort) {
            case 'price-asc':
                result.sort((a, b) => a.minPrice - b.minPrice);
                break;
            case 'price-desc':
                result.sort((a, b) => b.minPrice - a.minPrice);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProducts(result);
    }, [filters, products]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-xl font-medium text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 transition-colors duration-200">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Tất cả sản phẩm
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tìm thấy {filteredProducts.length} sản phẩm
                        {filters.search && ` cho "${filters.search}"`}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24 transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                <FontAwesomeIcon icon={faFilter} className="mr-3 text-blue-500" />
                                Bộ lọc
                            </h3>
                            
                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                    Tìm kiếm sản phẩm
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nhập tên sản phẩm..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                                    />
                                    <FontAwesomeIcon 
                                        icon={faSearch} 
                                        className="absolute left-3 top-4 text-gray-400 dark:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <FontAwesomeIcon icon={faTh} className="mr-2" />
                                    Danh mục
                                </h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setFilters({ 
                                            ...filters, 
                                            category: 'all',
                                            subcategory: 'all'
                                        })}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                            filters.category === 'all'
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faSearch} className="text-sm" />
                                        <span className="text-sm font-medium">Tất cả danh mục</span>
                                    </button>
                                    {categories.map(category => (
                                        <button
                                            key={category._id}
                                            onClick={() => setFilters({ 
                                                ...filters, 
                                                category: category._id,
                                                subcategory: 'all'
                                            })}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                                filters.category === category._id
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            <span className="text-lg">{getCategoryIcon(category.name)}</span>
                                            <span className="text-sm font-medium">{category.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subcategory Filter */}
                            {activeSubcategories.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Loại sản phẩm
                                    </label>
                                    <select
                                        value={filters.subcategory}
                                        onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
                                    >
                                        <option value="all">Tất cả loại</option>
                                        {activeSubcategories.map(sub => (
                                            <option key={sub._id} value={sub.name}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort Options */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <FontAwesomeIcon icon={faSort} className="text-gray-500 dark:text-gray-400" />
                                <select
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
                                >
                                    <option value="newest">🆕 Mới nhất</option>
                                    <option value="price-asc">💰 Giá thấp đến cao</option>
                                    <option value="price-desc">💎 Giá cao đến thấp</option>
                                    <option value="name-asc">🔤 Tên A-Z</option>
                                    <option value="name-desc">🔤 Tên Z-A</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-lg transition-all duration-200 ${
                                        viewMode === 'grid'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faTh} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-lg transition-all duration-200 ${
                                        viewMode === 'list'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faList} />
                                </button>
                            </div>
                        </div>

                        {/* Results Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product._id} className="group animate-fadeIn">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700">
                                            {/* Image */}
                                            <div className="relative aspect-video bg-gray-50 dark:bg-gray-700 overflow-hidden transition-colors duration-200">
                                                {product.thumbnail ? (
                                                    <img 
                                                        src={product.thumbnail} 
                                                        alt={product.name}
                                                        className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faTag} className="text-4xl text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                )}
                                                
                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                                                    {product.featured && (
                                                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-bold shadow-lg animate-pulse">
                                                            <FontAwesomeIcon icon={faCrown} className="mr-1" />
                                                            HOT
                                                        </span>
                                                    )}
                                                    {product.skus?.[0]?.originalPrice && product.skus[0].originalPrice > product.skus[0].price && (
                                                        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold shadow-lg">
                                                            -{Math.round(((product.skus[0].originalPrice - product.skus[0].price) / product.skus[0].originalPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Hover Actions */}
                                                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                                                        <FontAwesomeIcon icon={faHeart} className="text-gray-600 dark:text-gray-400 text-sm hover:text-red-500" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleViewProduct(product._id)}
                                                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-500" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer" onClick={() => handleViewProduct(product._id)}>
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                                                        {product.description || 'Không có mô tả'}
                                                    </p>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {product.rating || '4.5'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                                        ({product.reviews || '0'} đánh giá)
                                                    </span>
                                                    {product.sold && (
                                                        <>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                                                                <FontAwesomeIcon icon={faFire} className="mr-1" />
                                                                Đã bán {product.sold}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        {product.skus && product.skus.length > 0 ? (
                                                            <>
                                                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                                    {formatPrice(product.skus[0].price)}
                                                                </span>
                                                                {product.skus[0].originalPrice && product.skus[0].originalPrice > product.skus[0].price && (
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        {formatPrice(product.skus[0].originalPrice)}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                                                                Liên hệ
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button 
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.skus || product.skus.length === 0}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-xl transition-all duration-300 font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                                >
                                                    <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
                                                    <span>Thêm vào giỏ</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                                <FontAwesomeIcon icon={faSearch} className="text-6xl text-gray-400 dark:text-gray-500 mb-6" />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Không tìm thấy sản phẩm nào
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc để xem thêm kết quả
                                </p>
                                <button 
                                    onClick={() => setFilters({
                                        category: 'all',
                                        subcategory: 'all',
                                        search: '',
                                        sort: 'newest'
                                    })}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Load More Info */}
                        {filteredProducts.length > 0 && (
                            <div className="text-center mt-12">
                                <div className="inline-flex items-center px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-200">
                                    <FontAwesomeIcon icon={faFire} className="mr-3 text-blue-500" />
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                                        Đã hiển thị tất cả {filteredProducts.length} sản phẩm
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Products;