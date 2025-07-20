import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getAdminProducts, changeProductStatus, getProductStats, getSellers } from '../../services/adminService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCurrency } from '../../ultils';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import './Products.scss';

export default function Products() {
    const { token, isAuthenticated } = useSelector((state) => state.auth);
    const [products, setProducts] = useState(null);
    const [stats, setStats] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: 'all',
        seller: 'all',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching products with filters:', filters);
            console.log('Token available:', !!token);
            
            const [productsResponse, statsResponse] = await Promise.all([
                getAdminProducts(filters),
                getProductStats()
            ]);

            console.log('Products response:', productsResponse);
            console.log('Stats response:', statsResponse);

            if (productsResponse.errCode === 0) {
                setProducts(productsResponse.data);
            } else {
                setError(productsResponse.message || 'Lỗi khi tải danh sách sản phẩm');
            }
            
            if (statsResponse.errCode === 0) {
                setStats(statsResponse.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Không thể tải danh sách sản phẩm');
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    }, [filters, token]);

    const fetchSellers = useCallback(async () => {
        try {
            const response = await getSellers();
            console.log('Sellers response:', response);
            if (response.errCode === 0) {
                setSellers(response.data);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchProducts();
            fetchSellers();
        }
    }, [isAuthenticated, token, fetchProducts, fetchSellers]);

    // Debug effect for filters
    useEffect(() => {
        console.log('Filters changed:', filters);
    }, [filters]);

    const handleStatusChange = async (productId, newStatus, event) => {
        event.preventDefault();
        event.stopPropagation();
        
        try {
            console.log('Changing status for product:', productId, 'to:', newStatus);
            
            // Validate productId
            if (!productId) {
                console.error('Product ID is missing');
                toast.error('Không tìm thấy ID sản phẩm');
                return;
            }
            
            const response = await changeProductStatus(productId, newStatus);
            console.log('Status change response:', response);
            
            if (response.errCode === 0) {
                toast.success('Cập nhật trạng thái thành công');
                
                // Update local state immediately for better UX
                setProducts(prevProducts => {
                    if (!prevProducts || !prevProducts.products) return prevProducts;
                    
                    const updatedProducts = prevProducts.products.map(product => {
                        if (product._id === productId) {
                            if (newStatus === 'deleted') {
                                return { ...product, isDeleted: true };
                            } else {
                                return { ...product, status: newStatus, isDeleted: false };
                            }
                        }
                        return product;
                    });
                    
                    return {
                        ...prevProducts,
                        products: updatedProducts
                    };
                });
                
                // Also fetch fresh data from server
                setTimeout(() => {
                    fetchProducts();
                }, 500);
            } else {
                toast.error(response.message || 'Không thể cập nhật trạng thái');
            }
        } catch (error) {
            console.error('Error changing status:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái');
        }
    };

    const handleSort = (field, event) => {
        event.preventDefault();
        event.stopPropagation();
        
        setFilters(prev => ({
            ...prev,
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleViewDetail = (product, event) => {
        event.preventDefault();
        event.stopPropagation();
        
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key === 'page' ? value : 1
        }));
    };

    const handleRefresh = () => {
        setFilters({
            page: 1,
            limit: 10,
            status: 'all',
            seller: 'all',
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const handleModalClose = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        setShowDetailModal(false);
        setSelectedProduct(null);
    };

    const handleModalContentClick = (event) => {
        event.stopPropagation();
    };

    const getStatusBadge = (product) => {
        if (product.isDeleted) {
            return <span className="status-badge deleted">Đã xóa</span>;
        }
        if (product.status === 'inactive') {
            return <span className="status-badge inactive">Tạm ngưng</span>;
        }
        return <span className="status-badge active">Đang hoạt động</span>;
    };

    const getTotalStock = (product) => {
        if (product.skus && product.skus.length > 0) {
            return product.skus.reduce((total, sku) => total + (sku.stock || 0), 0);
        }
        return 0;
    };

    const getMinPrice = (product) => {
        if (product.skus && product.skus.length > 0) {
            const prices = product.skus.map(sku => sku.price).filter(price => price > 0);
            return prices.length > 0 ? Math.min(...prices) : 0;
        }
        return 0;
    };

    const getTotalSales = (product) => {
        if (product.skus && product.skus.length > 0) {
            return product.skus.reduce((total, sku) => total + (sku.sales?.count || 0), 0);
        }
        return 0;
    };

    if (!isAuthenticated || !token) {
        return (
            <div className="admin-products">
                <div className="error-message">
                    <h2>Chưa đăng nhập</h2>
                    <p>Vui lòng đăng nhập để truy cập trang quản lý sản phẩm</p>
                </div>
            </div>
        );
    }

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="admin-products">
                <div className="error-message">
                    <h2>Lỗi</h2>
                    <p>{error}</p>
                    <button onClick={fetchProducts}>Thử lại</button>
                </div>
            </div>
        );
    }

    if (!products) {
        return (
            <div className="admin-products">
                <div className="error-message">
                    <h2>Không có dữ liệu</h2>
                    <p>Không thể tải danh sách sản phẩm</p>
                    <button onClick={fetchProducts}>Thử lại</button>
                </div>
            </div>
        );
    }

    // Debug: Log the actual data structure
    console.log('Products data structure:', products);
    console.log('Products array:', products.products);
    console.log('Products count:', products.products?.length || 0);
    console.log('Stats data:', stats);
    console.log('Current filters:', filters);

    return (
        <div className="admin-products">
            <div className="products-header">
                <h1>Quản lý sản phẩm</h1>
                <button className="refresh-btn" onClick={handleRefresh}>
                    <FontAwesomeIcon icon="sync" /> Làm mới
                </button>
            </div>

            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Tổng sản phẩm</h3>
                    <p>{products.pagination?.totalItems || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Đang hoạt động</h3>
                    <p>{stats?.statusStats?.find(s => s._id === 'active')?.count || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Tạm ngưng</h3>
                    <p>{stats?.statusStats?.find(s => s._id === 'inactive')?.count || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Đã xóa</h3>
                    <p>{stats?.statusStats?.find(s => s._id === 'deleted')?.count || 0}</p>
                </div>
            </div>

            <div className="filters-section">
                <div className="search-bar">
                    <FontAwesomeIcon icon="search" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Tạm ngưng</option>
                        <option value="deleted">Đã xóa</option>
                    </select>

                    <select
                        value={filters.seller}
                        onChange={(e) => handleFilterChange('seller', e.target.value)}
                    >
                        <option value="all">Tất cả người bán</option>
                        {sellers.map(seller => (
                            <option key={seller._id} value={seller._id}>
                                {seller.username}
                            </option>
                        ))}
                    </select>

                    <select
                        className="page-size-select"
                        value={filters.limit}
                        onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
                    >
                        <option value={10}>10 / trang</option>
                        <option value={20}>20 / trang</option>
                        <option value={50}>50 / trang</option>
                    </select>
                </div>
            </div>

            <div className="products-table">
                {products.products && products.products.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th onClick={(e) => handleSort('name', e)}>
                                    Tên sản phẩm
                                    {filters.sortBy === 'name' && (
                                        <FontAwesomeIcon
                                            icon={filters.sortOrder === 'asc' ? 'sort-up' : 'sort-down'}
                                        />
                                    )}
                                </th>
                                <th>Danh mục</th>
                                <th onClick={(e) => handleSort('minPrice', e)}>
                                    Giá thấp nhất
                                    {filters.sortBy === 'minPrice' && (
                                        <FontAwesomeIcon
                                            icon={filters.sortOrder === 'asc' ? 'sort-up' : 'sort-down'}
                                        />
                                    )}
                                </th>
                                <th>Tổng kho</th>
                                <th>Đã bán</th>
                                <th>Người bán</th>
                                <th>Trạng thái</th>
                                <th onClick={(e) => handleSort('createdAt', e)}>
                                    Ngày tạo
                                    {filters.sortBy === 'createdAt' && (
                                        <FontAwesomeIcon
                                            icon={filters.sortOrder === 'asc' ? 'sort-up' : 'sort-down'}
                                        />
                                    )}
                                </th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.products.map(product => (
                                <tr key={product._id} data-product-id={product._id}>
                                    <td>
                                        <div className="product-info">
                                            {product.images && product.images.length > 0 && (
                                                <img 
                                                    src={product.images[0]} 
                                                    alt={product.name}
                                                    className="product-thumbnail"
                                                />
                                            )}
                                            <div>
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-description">
                                                    {product.description?.substring(0, 50)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="category-info">
                                            <span className="category-name">{product.categoryName || 'N/A'}</span>
                                            <span className="subcategory">{product.subcategory || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{formatCurrency(getMinPrice(product))}₫</td>
                                    <td>{getTotalStock(product)}</td>
                                    <td>{getTotalSales(product)}</td>
                                    <td>{product.sellerInfo?.username || 'N/A'}</td>
                                    <td>{getStatusBadge(product)}</td>
                                    <td>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                type="button"
                                                className="btn-view"
                                                onClick={(e) => handleViewDetail(product, e)}
                                            >
                                                <FontAwesomeIcon icon="eye" />
                                            </button>
                                            <select
                                                className="status-select"
                                                value={product.isDeleted ? 'deleted' : (product.status || 'active')}
                                                onChange={(e) => handleStatusChange(product._id, e.target.value, e)}
                                            >
                                                <option value="active">Đang hoạt động</option>
                                                <option value="inactive">Tạm ngưng</option>
                                                <option value="deleted">Xóa</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-products-message">
                        <h3>Không có sản phẩm nào</h3>
                        <p>Không tìm thấy sản phẩm nào với bộ lọc hiện tại.</p>
                        <button 
                            type="button"
                            onClick={handleRefresh}
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>

            {products.pagination && (
                <div className="pagination">
                    <button
                        type="button"
                        className="page-btn"
                        disabled={!products.pagination.hasPrev}
                        onClick={() => handleFilterChange('page', filters.page - 1)}
                    >
                        <FontAwesomeIcon icon="chevron-left" />
                    </button>

                    <span className="page-info">
                        Trang {products.pagination.currentPage} / {products.pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        className="page-btn"
                        disabled={!products.pagination.hasNext}
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                    >
                        <FontAwesomeIcon icon="chevron-right" />
                    </button>
                </div>
            )}

            {/* Product Detail Modal */}
            {showDetailModal && selectedProduct && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={handleModalContentClick}>
                        <div className="modal-header">
                            <h2>Chi tiết sản phẩm</h2>
                            <button 
                                type="button"
                                className="close-btn"
                                onClick={handleModalClose}
                            >
                                <FontAwesomeIcon icon="times" />
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="product-detail-grid">
                                <div className="product-images">
                                    <h3>Hình ảnh sản phẩm</h3>
                                    <div className="image-gallery">
                                        {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                            selectedProduct.images.map((image, index) => (
                                                <img 
                                                    key={index} 
                                                    src={image} 
                                                    alt={`${selectedProduct.name} ${index + 1}`}
                                                />
                                            ))
                                        ) : (
                                            <p>Không có hình ảnh</p>
                                        )}
                                    </div>
                                </div>

                                <div className="product-info-detail">
                                    <h3>Thông tin cơ bản</h3>
                                    <div className="info-item">
                                        <label>Tên sản phẩm:</label>
                                        <span>{selectedProduct.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Mô tả:</label>
                                        <span>{selectedProduct.description || 'Không có mô tả'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Danh mục:</label>
                                        <span>{selectedProduct.categoryName || 'N/A'} - {selectedProduct.subcategory || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Người bán:</label>
                                        <span>{selectedProduct.sellerInfo?.username || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày tạo:</label>
                                        <span>{new Date(selectedProduct.createdAt).toLocaleString('vi-VN')}</span>
                                    </div>
                                </div>

                                <div className="sku-details">
                                    <h3>Thông tin SKU</h3>
                                    {selectedProduct.skus && selectedProduct.skus.length > 0 ? (
                                        <div className="sku-list">
                                            {selectedProduct.skus.map(sku => (
                                                <div key={sku._id} className="sku-item">
                                                    <div className="sku-header">
                                                        <span className="sku-name">{sku.name}</span>
                                                        <span className={`sku-status ${sku.status}`}>
                                                            {sku.status === 'available' ? 'Có sẵn' : 'Ẩn'}
                                                        </span>
                                                    </div>
                                                    <div className="sku-details-grid">
                                                        <div className="sku-detail">
                                                            <label>Giá:</label>
                                                            <span>{formatCurrency(sku.price)}₫</span>
                                                        </div>
                                                        <div className="sku-detail">
                                                            <label>Kho:</label>
                                                            <span>{sku.stock}</span>
                                                        </div>
                                                        <div className="sku-detail">
                                                            <label>Đã bán:</label>
                                                            <span>{sku.sales?.count || 0}</span>
                                                        </div>
                                                        <div className="sku-detail">
                                                            <label>Doanh thu:</label>
                                                            <span>{formatCurrency(sku.sales?.revenue || 0)}₫</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Không có SKU nào</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}