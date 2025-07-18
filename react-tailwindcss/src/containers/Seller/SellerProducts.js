import React, { useState, useEffect } from 'react';
import { getCategory } from '../../services/userService';
import { getAllProducts, deleteProduct } from '../../services/sellerService';
import { formatCurrency } from '../../ultils';
import toast from 'react-hot-toast';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Package, 
    Eye,
    Search,
    Filter
} from 'lucide-react';
import NewProductModal from './Modal/NewProductModal';
import InventoryModal from './Modal/InventoryModal';
import Loading from '../../components/Loading';

const ModalTypes = {
    NONE: 'NONE',
    NEW_PRODUCT: 'NEW_PRODUCT',
    INVENTORY: 'INVENTORY'
};

export default function SellerProducts() {
    const [categoriesList, setCategoriesList] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const [activeModal, setActiveModal] = useState(ModalTypes.NONE);
    const [mode, setMode] = useState('create');
    const [selectedProductId, setSelectedProductId] = useState(null);

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }
        
        try {
            const result = await deleteProduct(productId);
            if (result?.errCode === 0) {
                toast.success("Xóa sản phẩm thành công");
                setProducts(products => products.filter(p => p._id !== productId));
            } else {
                throw new Error("Xóa sản phẩm thất bại");
            }
        } catch (error) {
            toast.error("Xóa sản phẩm thất bại");
            console.error("delete product error:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const products = await getAllProducts();
            setProducts(products?.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeModal === ModalTypes.NONE) {
            fetchProducts();
        }
    }, [activeModal]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('🔧 Fetching categories...');
                const categories = await getCategory();
                console.log('🔧 Categories response:', categories);
                
                // Handle different response formats
                let categoriesArray = [];
                if (Array.isArray(categories)) {
                    categoriesArray = categories;
                } else if (categories && categories.data && Array.isArray(categories.data)) {
                    categoriesArray = categories.data;
                } else if (categories && categories.errCode === 0 && Array.isArray(categories.data)) {
                    categoriesArray = categories.data;
                } else {
                    categoriesArray = [];
                }
                
                setCategoriesList(categoriesArray);
                console.log('Categories set:', categoriesArray);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategoriesList([]);
            }
        };
        fetchCategories();
    }, []);

    const handleOpenModal = (modalType, mode = 'create', productId = null) => {
        console.log('Opening modal:', { modalType, mode, productId });
        setActiveModal(modalType);
        setMode(mode);
        setSelectedProductId(productId);
    };

    const handleCloseModal = () => {
        setActiveModal(ModalTypes.NONE);
        setSelectedProductId(null);
    };

    // Filter products based on search term and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Sản phẩm của tôi</h1>
                <button
                    onClick={() => handleOpenModal(ModalTypes.NEW_PRODUCT)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-4 sm:mt-0"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <div className="relative">
                            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                            >
                                <option value="all">Tất cả danh mục</option>
                                {Array.isArray(categoriesList) && categoriesList.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow overflow-hidden rounded-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên sản phẩm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh số
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh thu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kho hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        {searchTerm || categoryFilter !== 'all' 
                                            ? 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc'
                                            : 'Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên của bạn!'
                                        }
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex-shrink-0 h-16 w-16">
                                                <img
                                                    className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                                    src={product.thumbnail || product.images?.[0]}
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.target.src = '/api/placeholder/64/64';
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {product.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {product.totalSales?.count || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(product.totalSales?.revenue || 0)}₫
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {product.totalStock || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(ModalTypes.INVENTORY, 'view', product._id)}
                                                    className="inline-flex items-center p-2 border border-transparent rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    title="Quản lý kho"
                                                >
                                                    <Package className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(ModalTypes.NEW_PRODUCT, 'edit', product._id)}
                                                    className="inline-flex items-center p-2 border border-transparent rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {activeModal === ModalTypes.NEW_PRODUCT && (
                <NewProductModal
                    key={`modal-${Array.isArray(categoriesList) ? categoriesList.length : 0}`} // Force re-render when categories load
                    isOpen={activeModal === ModalTypes.NEW_PRODUCT}
                    onClose={handleCloseModal}
                    categoriesList={categoriesList}
                    mode={mode}
                    productId={mode === 'edit' ? selectedProductId : null}
                />
            )}
            {activeModal === ModalTypes.INVENTORY && (
                <InventoryModal
                    isOpen={activeModal === ModalTypes.INVENTORY}
                    onClose={handleCloseModal}
                    productId={selectedProductId}
                />
            )}
        </div>
    );
}
