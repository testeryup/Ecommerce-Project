import React, { useState, useEffect } from 'react';
import { getAllPromos, createNewPromo, deletePromo } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function Promos() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, code: '', promoData: null });
    const [searchInput, setSearchInput] = useState(''); // Riêng cho input
    const [formData, setFormData] = useState({
        code: '',
        expiresAt: '',
        usage: 10,
        discount: 5
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        includeExpired: true,
        search: ''
    });

    useEffect(() => {
        fetchPromos();
    }, [filters]);

    const fetchPromos = async () => {
        try {
            setLoading(true);
            const response = await getAllPromos(filters);
            console.log("check response:", response);
            if (response.errCode === 0) {
                setPromos(response.data.promos);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách promo');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createNewPromo(
                formData.code,
                formData.expiresAt,
                formData.usage,
                formData.discount
            );
            if (response.errCode === 0) {
                toast.success(response.message);
                setShowForm(false);
                setFormData({ code: '', expiresAt: '', usage: 10, discount: 5 });
                fetchPromos();
            }
        } catch (error) {
            toast.error(error.response?.message || 'Tạo promo thất bại');
        }
    };

    const showDeleteConfirm = (promo) => {
        setDeleteModal({ show: true, code: promo.code, promoData: promo });
    };

    const handleDelete = async () => {
        try {
            const response = await deletePromo(deleteModal.code);
            if (response.errCode === 0) {
                toast.success(response.message);
                fetchPromos();
            }
        } catch (error) {
            console.log("check error:", error);
            toast.error(error.response?.data.message || 'Xóa promo code thất bại');
        } finally {
            setDeleteModal({ show: false, code: '', promoData: null });
        }
    };

    // Xử lý tìm kiếm khi nhấn Enter hoặc nút tìm kiếm
    const handleSearch = () => {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    // Copy mã promo
    const handleCopyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success(`Đã sao chép mã "${code}"`);
        } catch (err) {
            toast.error('Không thể sao chép mã');
        }
    };

    // Format ngày đơn giản
    const formatSimpleDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Hàm kiểm tra và trả về trạng thái promo
    const getPromoStatus = (promo) => {
        if (promo.isDeleted) {
            return {
                text: 'Đã xóa',
                className: 'bg-gray-100 text-gray-800'
            };
        }

        const now = new Date();
        const expiryDate = new Date(promo.expiresAt);
        const currentUse = promo.currentUse || 0;
        const maximumUse = promo.maximumUse || 0;

        if (expiryDate <= now) {
            return {
                text: 'Đã hết hạn',
                className: 'bg-red-100 text-red-800'
            };
        }

        if (currentUse >= maximumUse) {
            return {
                text: 'Đã dùng hết',
                className: 'bg-orange-100 text-orange-800'
            };
        }

        return {
            text: 'Hoạt động',
            className: 'bg-green-100 text-green-800'
        };
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Promo Code</h1>
                
                {/* Controls */}
                <div className="flex gap-4 mb-4">
                    <div className="flex flex-1 gap-2">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã promo..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            className="px-4 py-2 border rounded-lg flex-1"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Tìm
                        </button>
                        {filters.search && (
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    setFilters(prev => ({ ...prev, search: '', page: 1 }));
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {showForm ? 'Hủy' : 'Tạo mới'}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Mã promo (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                    placeholder="Để trống để tự động tạo"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
                                <input
                                    type="datetime-local"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Số lần sử dụng (1-100)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.usage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, usage: parseInt(e.target.value) }))}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Giảm giá % (5-100)</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="100"
                                    value={formData.discount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) }))}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Tạo Promo
                        </button>
                    </form>
                )}
            </div>

            {/* Promo List */}
            {loading ? (
                <div className="text-center py-8">Đang tải...</div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Mã</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Giảm giá</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Sử dụng</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Hết hạn</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Trạng thái</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {promos.map((promo) => {
                                    const status = getPromoStatus(promo);
                                    return (
                                        <tr key={promo._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-blue-600">{promo.code}</span>
                                                    <button
                                                        onClick={() => handleCopyCode(promo.code)}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Sao chép mã"
                                                    >
                                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{promo.discount}%</td>
                                            <td className="px-4 py-3">{promo.__v || 0}/{promo.maximumUse + promo.__v}</td>
                                            <td className="px-4 py-3">
                                                {formatSimpleDate(promo.expiresAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${status.className}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => showDeleteConfirm(promo)}
                                                    disabled={promo.isDeleted || new Date() > new Date(promo.expiresAt)}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        promo.isDeleted || new Date() > new Date(promo.expiresAt) 
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-red-600 text-white hover:bg-red-700'
                                                    }`}
                                                >
                                                    {promo.isDeleted || new Date() > new Date(promo.expiresAt) ? 'Đã xóa' : 'Xóa'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {promos.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Không có promo code nào
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded ${
                                        page === pagination.currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa promo</h3>
                        <div className="mb-6">
                            <p className="text-gray-600 mb-3">
                                Bạn có chắc chắn muốn xóa promo code <strong>"{deleteModal.code}"</strong>?
                            </p>
                            {deleteModal.promoData && (
                                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span>Giảm giá:</span>
                                        <span className="font-medium">{deleteModal.promoData.discount}%</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span>Sử dụng:</span>
                                        <span className="font-medium">
                                            {deleteModal.promoData.currentUse || 0}/{deleteModal.promoData.maximumUse}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hết hạn:</span>
                                        <span className="font-medium">
                                            {formatSimpleDate(deleteModal.promoData.expiresAt)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <p className="text-red-600 text-sm mt-3">
                                ⚠️ Hành động này không thể hoàn tác!
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                            >
                                Xóa promo
                            </button>
                            <button
                                onClick={() => setDeleteModal({ show: false, code: '', promoData: null })}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}