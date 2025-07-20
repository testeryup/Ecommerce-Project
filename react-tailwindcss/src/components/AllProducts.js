import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from "./Layout";
import Loading from './Loading';
import { getProducts, getCategory } from '../services/userService';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const Products = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
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
            toast.error('Sản phẩm tạm hết');
        }
    };

    const handleViewProduct = (productId) => {
        // Scroll to top smoothly before navigating
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Small delay to ensure smooth scrolling starts before navigation
        setTimeout(() => {
            navigate(`/product/${productId}`);
        }, 100);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsResponse, categoriesResponse] = await Promise.all([
                    getProducts(),
                    getCategory()
                ]);

                if (productsResponse && productsResponse.errCode === 0) {
                    setProducts(productsResponse.data || []);
                    setFilteredProducts(productsResponse.data || []);
                } else {
                    console.warn('Products API response:', productsResponse);
                    setProducts([]);
                    setFilteredProducts([]);
                }

                if (categoriesResponse) {
                    // Ensure categories is always an array
                    const categoriesData = Array.isArray(categoriesResponse)
                        ? categoriesResponse
                        : categoriesResponse.data
                            ? (Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [])
                            : [];
                    setCategories(categoriesData);
                } else {
                    console.warn('Categories API response:', categoriesResponse);
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Set default empty arrays on error
                setProducts([]);
                setCategories([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle URL search parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search');

        if (searchQuery) {
            setFilters(prev => ({
                ...prev,
                search: searchQuery
            }));
        }
    }, [location.search]);

    useEffect(() => {
        if (filters.category !== 'all') {
            const category = Array.isArray(categories)
                ? categories.find(cat => cat._id === filters.category)
                : null;
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
        return <Loading />;
    }

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Hero Section - Apple Style */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
                            Khám phá sản phẩm
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
                            Tìm thấy {filteredProducts.length} sản phẩm chất lượng cao với thiết kế hiện đại
                        </p>

                        {/* Search Bar - Apple Style */}
                        <div className="max-w-2xl mx-auto relative">
                            <div className="flex items-center bg-gray-100 rounded-full transition-all duration-300 hover:bg-gray-200">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="w-4 h-4 text-gray-500 ml-6"
                                />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="bg-transparent px-4 py-4 w-full text-lg text-gray-900 placeholder-gray-500 focus:outline-none rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters - Apple Style */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight">
                                    Bộ lọc
                                </h3>

                                {/* Category Filter */}
                                <div className="mb-10">
                                    <h4 className="text-sm font-medium text-gray-700 mb-6 uppercase tracking-wide">
                                        Danh mục
                                    </h4>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setFilters({
                                                ...filters,
                                                category: 'all',
                                                subcategory: 'all'
                                            })}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all font-medium ${filters.category === 'all'
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <span className="text-lg">🌟</span>
                                            <span>Tất cả danh mục</span>
                                        </button>
                                        {Array.isArray(categories) && categories.map(category => (
                                            <button
                                                key={category._id}
                                                onClick={() => setFilters({
                                                    ...filters,
                                                    category: category._id,
                                                    subcategory: 'all'
                                                })}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all font-medium ${filters.category === category._id
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <span className="text-lg">{getCategoryIcon(category.name)}</span>
                                                <span>{category.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subcategory Filter */}
                                {activeSubcategories.length > 0 && (
                                    <div className="mb-10">
                                        <h4 className="text-sm font-medium text-gray-700 mb-6 uppercase tracking-wide">
                                            Loại sản phẩm
                                        </h4>
                                        <select
                                            value={filters.subcategory}
                                            onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 font-medium"
                                        >
                                            <option value="all">Tất cả loại</option>
                                            {Array.isArray(activeSubcategories) && activeSubcategories.map(sub => (
                                                <option key={sub._id} value={sub.name}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Sort Options */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-700 mb-6 uppercase tracking-wide">
                                        Sắp xếp theo
                                    </h4>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 font-medium"
                                    >
                                        <option value="newest">🆕 Mới nhất</option>
                                        <option value="price-asc">💰 Giá thấp đến cao</option>
                                        <option value="price-desc">💎 Giá cao đến thấp</option>
                                        <option value="name-asc">🔤 Tên A-Z</option>
                                        <option value="name-desc">🔤 Tên Z-A</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Content */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="flex flex-col space-y-4 mb-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                                        {filters.search ? `Kết quả cho "${filters.search}"` : 'Tất cả sản phẩm'}
                                    </h2>
                                    <span className="text-gray-600 font-medium">
                                        {filteredProducts.length} sản phẩm
                                    </span>
                                </div>

                                {/* Clear search button if searching */}
                                {filters.search && (
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
                                        >
                                            <span className="mr-2">✕</span>
                                            Xóa từ khóa tìm kiếm
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            Tìm thấy {filteredProducts.length} kết quả
                                        </span>
                                    </div>
                                )}
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden border border-gray-100 group"
                                        >
                                            {/* Product Image */}
                                            <div
                                                className="aspect-[4/3] bg-gray-50 relative overflow-hidden cursor-pointer"
                                                onClick={() => handleViewProduct(product._id)}
                                            >
                                                {product.thumbnail ? (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-6xl text-gray-300">📦</span>
                                                    </div>
                                                )}

                                                {/* Product Badges */}
                                                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                                    {product.featured && (
                                                        <span className="px-3 py-1 bg-black text-white text-xs rounded-full font-medium shadow-lg">
                                                            ⭐ Nổi bật
                                                        </span>
                                                    )}
                                                    {product.skus?.[0]?.originalPrice && product.skus[0].originalPrice > product.skus[0].price && (
                                                        <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium shadow-lg">
                                                            -{Math.round(((product.skus[0].originalPrice - product.skus[0].price) / product.skus[0].originalPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center hover:bg-white transition-colors border border-gray-100">
                                                        ❤️
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddToCart(product);
                                                        }}
                                                        disabled={!product.skus || product.skus.length === 0}
                                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 border border-gray-100"
                                                    >
                                                        🛒
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-6">
                                                <h3
                                                    className="font-semibold text-gray-900 mb-3 line-clamp-2 cursor-pointer hover:text-gray-700 text-lg leading-snug tracking-tight"
                                                    onClick={() => handleViewProduct(product._id)}
                                                >
                                                    {product.name}
                                                </h3>

                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed font-light">
                                                    {product.description || 'Sản phẩm chất lượng cao với thiết kế hiện đại và tính năng vượt trội'}
                                                </p>

                                                {/* Rating */}
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-sm ${i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-200'}`}
                                                            >
                                                                ⭐
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600 font-medium">
                                                        {product.rating || '4.8'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        ({product.reviews || '128'})
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <div className="mb-4">
                                                    {product.skus && product.skus.length > 0 ? (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-2xl font-semibold text-gray-900 tracking-tight">
                                                                {formatPrice(product.skus[0].price)}
                                                            </span>
                                                            {product.skus[0].originalPrice && product.skus[0].originalPrice > product.skus[0].price && (
                                                                <span className="text-lg text-gray-400 line-through font-light">
                                                                    {formatPrice(product.skus[0].originalPrice)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xl font-semibold text-gray-600">
                                                            Liên hệ để biết giá
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock Status */}
                                                <div className="mb-6">
                                                    {
                                                        product.skus && product.skus.length > 0 ? (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                                ✅ Còn hàng
                                                            </span>
                                                        ) :
                                                        (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                                                ❌ Tạm hết
                                                            </span>
                                                        )
                                                    }

                                                </div>

                                                {/* Add to Cart Button - Apple Style */}
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.skus || product.skus.length === 0}
                                                    className="w-full bg-black text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                                >
                                                    Thêm vào giỏ hàng
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-gray-50 rounded-3xl">
                                    <div className="text-8xl mb-8">🔍</div>
                                    <h3 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
                                        {filters.search ? 'Không tìm thấy kết quả nào' : 'Không tìm thấy sản phẩm nào'}
                                    </h3>
                                    <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto leading-relaxed font-light">
                                        {filters.search
                                            ? `Không có sản phẩm nào khớp với "${filters.search}". Thử tìm kiếm với từ khóa khác.`
                                            : 'Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc để xem thêm kết quả'
                                        }
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        {filters.search && (
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                Xóa từ khóa tìm kiếm
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setFilters({
                                                category: 'all',
                                                subcategory: 'all',
                                                search: '',
                                                sort: 'newest'
                                            })}
                                            className="px-8 py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                        >
                                            Xóa tất cả bộ lọc
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Results Summary */}
                            {filteredProducts.length > 0 && (
                                <div className="text-center mt-16 py-8">
                                    <div className="inline-flex items-center px-8 py-4 bg-gray-50 rounded-3xl border border-gray-100">
                                        <span className="text-gray-600 font-medium">
                                            Đã hiển thị tất cả <strong className="text-gray-900">{filteredProducts.length}</strong> sản phẩm
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;