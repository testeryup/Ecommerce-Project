import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import { getProducts, getCategory } from '../services/userService';
import ProductCard from './ProductCard';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFilter, 
    faSort, 
    faTh,
    faList
} from '@fortawesome/free-solid-svg-icons';

const Products = () => {
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

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                        🐙 Cửa hàng OCTOPUS
                    </h1>
                    <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Khám phá hàng ngàn dịch vụ subscription premium với giá tốt nhất thị trường
                    </p>
                    <div className="flex items-center justify-center space-x-8 text-blue-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{products.length}+</div>
                            <div className="text-sm">Sản phẩm</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">24/7</div>
                            <div className="text-sm">Hỗ trợ</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">100%</div>
                            <div className="text-sm">Bảo đảm</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-1/4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                <FontAwesomeIcon icon={faFilter} className="mr-2 text-blue-600" />
                                Bộ lọc
                            </h2>
                            
                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <FontAwesomeIcon icon={faSearch} className="mr-1" />
                                    Tìm kiếm sản phẩm
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nhập tên sản phẩm..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                                    />
                                    <FontAwesomeIcon 
                                        icon={faSearch} 
                                        className="absolute left-3 top-4 text-gray-400 dark:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    <FontAwesomeIcon icon={faTh} className="mr-1" />
                                    Danh mục sản phẩm
                                </label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setFilters({ 
                                            ...filters, 
                                            category: 'all',
                                            subcategory: 'all'
                                        })}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ${
                                            filters.category === 'all'
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-400'
                                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        🌟 Tất cả danh mục
                                    </button>
                                    {categories.map(category => (
                                        <button
                                            key={category._id}
                                            onClick={() => setFilters({ 
                                                ...filters, 
                                                category: category._id,
                                                subcategory: 'all'
                                            })}
                                            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ${
                                                filters.category === category._id
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-400'
                                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {getCategoryIcon(category.name)} {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subcategory Filter */}
                            {activeSubcategories.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Loại sản phẩm
                                    </label>
                                    <select
                                        value={filters.subcategory}
                                        onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

                            {/* Sort Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sắp xếp theo
                                </label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">Giá: Thấp đến cao</option>
                                    <option value="price-desc">Giá: Cao đến thấp</option>
                                    <option value="name-asc">Tên A-Z</option>
                                    <option value="name-desc">Tên Z-A</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Products Area */}
                    <div className="lg:w-3/4">
                        {/* Top Bar */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Tìm thấy {filteredProducts.length} sản phẩm
                                    </h2>
                                    {filters.search && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            cho "{filters.search}"
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Sort Options */}
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faSort} className="text-gray-500" />
                                        <select
                                            value={filters.sort}
                                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        >
                                            <option value="newest">🆕 Mới nhất</option>
                                            <option value="price-asc">💰 Giá thấp đến cao</option>
                                            <option value="price-desc">💎 Giá cao đến thấp</option>
                                            <option value="name-asc">🔤 Tên A-Z</option>
                                            <option value="name-desc">🔤 Tên Z-A</option>
                                        </select>
                                    </div>
                                    
                                    {/* View Mode Toggle */}
                                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-md transition-colors duration-200 ${
                                                viewMode === 'grid'
                                                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={faTh} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-md transition-colors duration-200 ${
                                                viewMode === 'list'
                                                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={faList} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Display */}
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon 
                                        icon={faSearch} 
                                        className="text-3xl text-gray-400 dark:text-gray-600"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Không tìm thấy sản phẩm nào
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để xem thêm kết quả.
                                </p>
                                <button
                                    onClick={() => setFilters({
                                        category: 'all',
                                        subcategory: 'all',
                                        search: '',
                                        sort: 'newest'
                                    })}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className={
                                viewMode === 'grid' 
                                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                                    : 'space-y-4'
                            }>
                                {filteredProducts.map(product => (
                                    <ProductCard 
                                        key={product._id} 
                                        product={product} 
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Load More Button (if needed) */}
                        {filteredProducts.length > 0 && (
                            <div className="text-center mt-12">
                                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-200 dark:border-gray-600">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
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