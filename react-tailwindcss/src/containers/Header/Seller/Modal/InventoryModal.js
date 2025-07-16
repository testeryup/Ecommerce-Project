import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import './InventoryModal.scss';
import { userGetProductById } from "../../../../services/userService";
import toast from 'react-hot-toast';
import inventoryService from "../../../../services/inventoryService";

export default function InventoryModal({ isOpen, onClose, productId }) {
    const [formData, setFormData] = useState({
        selectedSKU: '',
        inventoryList: [],
        skus: [],
        subcategory: '',
        accountType: 'subscription',
        accountsData: '',
        accountsList: [],
        stats: null
    });

    const [activeTab, setActiveTab] = useState('upload');
    const [loading, setLoading] = useState(false);
    const [expiringSoon, setExpiringSoon] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await userGetProductById(productId);
                if (result.errCode === 0 && result.data) {
                    setFormData(prev => ({
                        ...prev,
                        skus: result.data.skus,
                        subcategory: result.data.subcategory
                    }));
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to fetch product data");
            }
        };

        const fetchStats = async () => {
            try {
                const [statsResult, expiringResult] = await Promise.all([
                    inventoryService.getSubscriptionStats(),
                    inventoryService.getExpiringSoon(24)
                ]);

                if (statsResult.data.errCode === 0) {
                    setFormData(prev => ({ ...prev, stats: statsResult.data.data }));
                }
                
                if (expiringResult.data.errCode === 0) {
                    setExpiringSoon(expiringResult.data.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        if (productId && isOpen) {
            fetchProduct();
            fetchStats();
        }
    }, [productId, isOpen]);

    const resetForm = () => {
        setFormData(prev => ({
            ...prev,
            selectedSKU: '',
            inventoryList: [],
            accountsData: '',
            accountsList: []
        }));
    };

    const setField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSelectedSkuChange = async (skuId) => {
        setField('selectedSKU', skuId);
        setField('inventoryList', []);
        
        if (!skuId) return;

        setLoading(true);
        try {
            const inventoryData = await inventoryService.getInventory({
                page: 1,
                limit: 100
            });
            
            if (inventoryData?.data?.errCode === 0) {
                const filteredInventory = inventoryData.data.data.inventory.filter(
                    item => item.sku._id === skuId
                );
                setField('inventoryList', filteredInventory);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Lỗi khi tải danh sách kho");
        } finally {
            setLoading(false);
        }
    };

    const parseAccountsData = (text, accountType) => {
        const lines = text.split('\\n').map(line => line.trim()).filter(line => line.length > 0);
        
        return lines.map(line => {
            if (accountType === 'subscription') {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    return {
                        username: parts[0].trim(),
                        password: parts[1].trim(),
                        email: parts[2]?.trim() || '',
                        notes: parts.slice(3).join(':').trim() || ''
                    };
                }
                return null;
            } else if (accountType === 'key') {
                const parts = line.split(':');
                return {
                    key: parts[0].trim(),
                    notes: parts.slice(1).join(':').trim() || ''
                };
            }
            return null;
        }).filter(account => account !== null);
    };

    const handleAccountsDataChange = (event) => {
        const text = event.target.value;
        setField('accountsData', text);
        
        const parsed = parseAccountsData(text, formData.accountType);
        setField('accountsList', parsed);
    };

    const handleUploadInventory = async () => {
        if (!formData.selectedSKU) {
            toast.error("Vui lòng chọn SKU");
            return;
        }

        if (formData.accountsList.length === 0) {
            toast.error("Vui lòng nhập dữ liệu tài khoản");
            return;
        }

        setLoading(true);
        try {
            const uploadData = {
                productId: productId,
                skuId: formData.selectedSKU,
                accountType: formData.accountType,
                accountsList: formData.accountsList
            };

            const result = await inventoryService.uploadInventory(uploadData);
            
            if (result.data.errCode === 0) {
                toast.success(`Đã upload ${result.data.data.uploadedCount} tài khoản thành công!`);
                setField('accountsData', '');
                setField('accountsList', []);
                handleSelectedSkuChange(formData.selectedSKU);
            } else {
                toast.error(result.data.message || "Upload thất bại");
            }
        } catch (error) {
            console.error("Error uploading inventory:", error);
            toast.error("Có lỗi xảy ra khi upload");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (accountId) => {
        try {
            const result = await inventoryService.resetAccountPassword(accountId);
            if (result.data.errCode === 0) {
                toast.success(`Mật khẩu mới: ${result.data.data.newPassword}`);
                handleSelectedSkuChange(formData.selectedSKU);
            } else {
                toast.error(result.data.message || "Reset password thất bại");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Có lỗi xảy ra khi reset password");
        }
    };

    const handleRenewSubscription = async (accountId, days = 30) => {
        try {
            const result = await inventoryService.renewSubscription({
                accountId,
                additionalDays: days
            });
            
            if (result.data.errCode === 0) {
                toast.success(`Đã gia hạn ${days} ngày thành công!`);
                handleSelectedSkuChange(formData.selectedSKU);
            } else {
                toast.error(result.data.message || "Gia hạn thất bại");
            }
        } catch (error) {
            console.error("Error renewing subscription:", error);
            toast.error("Có lỗi xảy ra khi gia hạn");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            available: { label: 'Sẵn sàng', className: 'bg-green-100 text-green-800' },
            sold: { label: 'Đã bán', className: 'bg-blue-100 text-blue-800' },
            expired: { label: 'Hết hạn', className: 'bg-red-100 text-red-800' },
            invalid: { label: 'Không hợp lệ', className: 'bg-gray-100 text-gray-800' }
        };
        
        const config = statusConfig[status] || statusConfig.invalid;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Quản lý Kho Tài Khoản
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="border-b">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'upload', label: 'Upload Tài Khoản', icon: 'upload' },
                            { id: 'manage', label: 'Quản Lý', icon: 'inventory_2' },
                            { id: 'stats', label: 'Thống Kê', icon: 'analytics' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn SKU
                        </label>
                        <select
                            value={formData.selectedSKU}
                            onChange={(e) => handleSelectedSkuChange(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn phân loại sản phẩm</option>
                            {formData.skus.map((sku) => (
                                <option key={sku._id} value={sku._id}>
                                    {sku.name} - {sku.price.toLocaleString('vi-VN')}đ - Stock: {sku.stock}
                                </option>
                            ))}
                        </select>
                    </div>

                    {activeTab === 'upload' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại Tài Khoản
                                </label>
                                <div className="flex space-x-4">
                                    {[
                                        { value: 'subscription', label: 'Subscription (Username/Password)' },
                                        { value: 'key', label: 'License Key' },
                                        { value: 'license', label: 'License' }
                                    ].map((type) => (
                                        <label key={type.value} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="accountType"
                                                value={type.value}
                                                checked={formData.accountType === type.value}
                                                onChange={(e) => setField('accountType', e.target.value)}
                                                className="mr-2"
                                            />
                                            {type.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dữ Liệu Tài Khoản
                                    <span className="text-xs text-gray-500 ml-2">
                                        {formData.accountType === 'subscription' 
                                            ? '(Định dạng: username:password:email)'
                                            : '(Định dạng: key:notes)'
                                        }
                                    </span>
                                </label>
                                <textarea
                                    value={formData.accountsData}
                                    onChange={handleAccountsDataChange}
                                    placeholder={
                                        formData.accountType === 'subscription'
                                            ? "user1:pass1:email1@example.com\\nuser2:pass2:email2@example.com"
                                            : "KEY123456:Note for this key\\nKEY789012:Another note"
                                    }
                                    rows={8}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {formData.accountsList.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Preview ({formData.accountsList.length} tài khoản)
                                    </h4>
                                    <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                                        {formData.accountsList.slice(0, 5).map((account, index) => (
                                            <div key={index} className="text-xs text-gray-600 mb-1">
                                                {formData.accountType === 'subscription' 
                                                    ? `${account.username} | ${account.password} | ${account.email}`
                                                    : `${account.key} | ${account.notes}`
                                                }
                                            </div>
                                        ))}
                                        {formData.accountsList.length > 5 && (
                                            <div className="text-xs text-gray-500">
                                                ...và {formData.accountsList.length - 5} tài khoản khác
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleUploadInventory}
                                disabled={loading || !formData.selectedSKU || formData.accountsList.length === 0}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading && <span className="material-symbols-outlined animate-spin">refresh</span>}
                                <span>Upload {formData.accountsList.length} Tài Khoản</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'manage' && (
                        <div className="space-y-4">
                            {!formData.selectedSKU ? (
                                <div className="text-center text-gray-500 py-8">
                                    Vui lòng chọn SKU để xem danh sách tài khoản
                                </div>
                            ) : loading ? (
                                <div className="text-center text-gray-500 py-8">
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    <div>Đang tải...</div>
                                </div>
                            ) : formData.inventoryList.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    Chưa có tài khoản nào trong kho
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tài Khoản
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Trạng Thái
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subscription
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hành Động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {formData.inventoryList.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {item.accountType === 'subscription' ? (
                                                                <>
                                                                    <div><strong>User:</strong> {item.credentials.username}</div>
                                                                    <div><strong>Pass:</strong> {item.credentials.password}</div>
                                                                    {item.credentials.email && (
                                                                        <div className="text-xs text-gray-500">
                                                                            Email: {item.credentials.email}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div><strong>Key:</strong> {item.credentials.key}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(item.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.currentSubscription.isActive ? (
                                                            <div>
                                                                <div>Bắt đầu: {formatDate(item.currentSubscription.startDate)}</div>
                                                                <div>Kết thúc: {formatDate(item.currentSubscription.endDate)}</div>
                                                                <div className="text-xs">
                                                                    Reset: {item.autoReset.resetCount} lần
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span>Chưa bán</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        {item.accountType === 'subscription' && (
                                                            <button
                                                                onClick={() => handleResetPassword(item._id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="Reset Password"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">refresh</span>
                                                            </button>
                                                        )}
                                                        {item.currentSubscription.isActive && (
                                                            <button
                                                                onClick={() => handleRenewSubscription(item._id, 30)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Gia hạn 30 ngày"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {formData.stats && (
                                <>
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="material-symbols-outlined text-blue-500">inventory_2</span>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Tổng Tài Khoản
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {formData.stats.totalAccounts}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Sẵn Sàng Bán
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {formData.stats.availableAccounts}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="material-symbols-outlined text-orange-500">schedule</span>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Đang Hoạt Động
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {formData.stats.activeSubscriptions}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="material-symbols-outlined text-green-600">payments</span>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Tổng Doanh Thu
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {formData.stats.totalRevenueFromHistory?.toLocaleString('vi-VN')}đ
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="material-symbols-outlined text-purple-500">avg_time</span>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Thời Gian Sử Dụng TB
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {Math.round(formData.stats.averageUsageDuration || 0)} ngày
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {expiringSoon.length > 0 && (
                                <div className="col-span-full">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-yellow-800 mb-3">
                                            🚨 Tài Khoản Sắp Hết Hạn (24h)
                                        </h4>
                                        <div className="space-y-2">
                                            {expiringSoon.map((item) => (
                                                <div key={item._id} className="flex justify-between items-center text-sm">
                                                    <span className="text-yellow-700">
                                                        {item.sku.name} - {item.credentials.username}
                                                    </span>
                                                    <span className="text-yellow-600">
                                                        {formatDate(item.currentSubscription.endDate)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}