import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from "./Layout";
import Loading from './Loading';
import { getProducts, getCategory } from '../services/userService';
import { addToCart } from '../features/cart/cartSlice';
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
                if (categoriesResponse) {
                    setCategories(categoriesResponse);
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
        return <Loading />;
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                            Khám phá sản phẩm
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Tìm thấy {filteredProducts.length} sản phẩm chất lượng cao với thiết kế hiện đại
                        </p>
                        
                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                            />
                            <button className="absolute right-2 top-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
                                🔍
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    Bộ lọc sản phẩm
                                </h3>
                                
                                {/* Category Filter */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-700 mb-4">
                                        Danh mục
                                    </h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setFilters({ 
                                                ...filters, 
                                                category: 'all',
                                                subcategory: 'all'
                                            })}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                                                filters.category === 'all'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-lg">🌟</span>
                                            <span className="font-medium">Tất cả danh mục</span>
                                        </button>
                                        {categories.map(category => (
                                            <button
                                                key={category._id}
                                                onClick={() => setFilters({ 
                                                    ...filters, 
                                                    category: category._id,
                                                    subcategory: 'all'
                                                })}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                                                    filters.category === category._id
                                                        ? 'bg-gray-900 text-white'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                <span className="text-lg">{getCategoryIcon(category.name)}</span>
                                                <span className="font-medium">{category.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subcategory Filter */}
                                {activeSubcategories.length > 0 && (
                                    <div className="mb-8">
                                        <h4 className="text-sm font-medium text-gray-700 mb-4">
                                            Loại sản phẩm
                                        </h4>
                                        <select
                                            value={filters.subcategory}
                                            onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
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

                                {/* Sort Options */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-700 mb-4">
                                        Sắp xếp theo
                                    </h4>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
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
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    {filters.search ? `Kết quả cho "${filters.search}"` : 'Tất cả sản phẩm'}
                                </h2>
                                <span className="text-gray-600">
                                    {filteredProducts.length} sản phẩm
                                </span>
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredProducts.map((product) => (
                                        <div 
                                            key={product._id} 
                                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
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
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-5xl text-gray-300">📦</span>
                                                    </div>
                                                )}
                                                
                                                {/* Product Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                                                    {product.featured && (
                                                        <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-medium shadow-lg">
                                                            ⭐ Nổi bật
                                                        </span>
                                                    )}
                                                    {product.skus?.[0]?.originalPrice && product.skus[0].originalPrice > product.skus[0].price && (
                                                        <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium shadow-lg">
                                                            -{Math.round(((product.skus[0].originalPrice - product.skus[0].price) / product.skus[0].originalPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quick Add Button */}
                                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddToCart(product);
                                                        }}
                                                        disabled={!product.skus || product.skus.length === 0}
                                                        className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 border border-gray-100"
                                                    >
                                                        🛒
                                                    </button>
                                                </div>

                                                {/* Wishlist Button */}
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors border border-gray-100">
                                                        ❤️
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-6">
                                                <h3 
                                                    className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-gray-700 text-lg leading-tight"
                                                    onClick={() => handleViewProduct(product._id)}
                                                >
                                                    {product.name}
                                                </h3>
                                                
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
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
                                                    <span className="text-sm text-gray-500 font-medium">
                                                        {product.rating || '4.8'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        ({product.reviews || '128'} đánh giá)
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <div className="mb-4">
                                                    {product.skus && product.skus.length > 0 ? (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                {formatPrice(product.skus[0].price)}
                                                            </span>
                                                            {product.skus[0].originalPrice && product.skus[0].originalPrice > product.skus[0].price && (
                                                                <span className="text-lg text-gray-400 line-through">
                                                                    {formatPrice(product.skus[0].originalPrice)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xl font-bold text-gray-600">
                                                            Liên hệ để biết giá
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock Status */}
                                                <div className="mb-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                        ✅ Còn hàng
                                                    </span>
                                                </div>

                                                {/* Add to Cart Button */}
                                                <button 
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.skus || product.skus.length === 0}
                                                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                                >
                                                    Thêm vào giỏ hàng
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                                    <div className="text-8xl mb-6">🔍</div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                        Không tìm thấy sản phẩm nào
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                        Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc để xem thêm kết quả
                                    </p>
                                    <button 
                                        onClick={() => setFilters({
                                            category: 'all',
                                            subcategory: 'all',
                                            search: '',
                                            sort: 'newest'
                                        })}
                                        className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                </div>
                            )}

                            {/* Results Summary */}
                            {filteredProducts.length > 0 && (
                                <div className="text-center mt-12 py-8">
                                    <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-2xl border border-gray-200">
                                        <span className="text-gray-600">
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