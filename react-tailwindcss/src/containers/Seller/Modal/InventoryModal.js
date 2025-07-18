import { createPortal } from "react-dom"
import { useState, useEffect } from "react";
import { userGetProductById } from "../../../services/userService";
import toast from 'react-hot-toast';
import { uploadInventory, getInventoryList, deleteInventoryById } from "../../../services/sellerService";

export default function InventoryModal({ isOpen, onClose, productId }) {
    const [formData, setFormData] = useState({
        selectedSKU: '',
        inventoryList: [],
        skus: [],
        subcategory: '',
        inventoryDataToUpload: '',
        inventoryTextArea: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(null) // Track which item is being deleted
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await userGetProductById(productId);
                if (result.errCode === 0 && result.data) {
                    setFormData(prev => ({
                        ...prev,
                        skus: result.data.skus,
                        subcategory: result.data.subcategory
                    }))
                }
            } catch (error) {
                toast.error("Failed to fetch product data");
            }
        };
        if (productId) {
            fetchProduct();
        }
    }, [productId])
    const resetForm = () => {
        setFormData({
            selectedSKU: '',
            inventoryList: [],
            skus: [],
            subcategory: '',
            inventoryDataToUpload: '',
            inventoryTextArea: ''
        })
    }

    const setField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const validateData = () => {
        if (!productId) {
            toast.error("Không có thông tin sản phẩm");
            return false;
        }
        if (!formData.selectedSKU) {
            toast.error("Vui lòng chọn phân loại sản phẩm");
            return false;
        }
        if (!formData.inventoryDataToUpload || formData.inventoryDataToUpload.trim() === '') {
            toast.error("Vui lòng nhập thông tin tài khoản");
            return false;
        }
        
        const accounts = parseAccounts(formData.inventoryDataToUpload);
        if (accounts.length === 0) {
            toast.error("Không có tài khoản hợp lệ để thêm");
            return false;
        }
        
        return true;
    }
    const handleSelectedSkuChange = async (skuId) => {
        setField('selectedSKU', skuId);
        setField('inventoryList', []);
        
        if (!skuId) return;
        
        setIsLoading(true);
        try {
            const inventoryData = await getInventoryList(skuId);
            if (inventoryData?.errCode === 0 && inventoryData.data) {
                setField('inventoryList', inventoryData.data);
            } else {
                throw new Error(inventoryData?.message || "Không thể lấy danh sách kho hàng");
            }
        } catch (error) {
            toast.error("Không thể lấy danh sách kho hàng");
        } finally {
            setIsLoading(false);
        }
    }

    const handleInventoryChange = (event) => {
        setField('inventoryDataToUpload', event.target.value);
    }
    const parseAccounts = (text) => {
        return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    };

    const handleDeleteInventory = async (inventoryId) => {
        if (!inventoryId) {
            toast.error("Không có thông tin tài khoản để xóa");
            return;
        }
        
        if (!formData.selectedSKU) {
            toast.error("Vui lòng chọn phân loại sản phẩm");
            return;
        }
        
        setIsDeleting(inventoryId);
        try {
            const result = await deleteInventoryById(inventoryId, formData.selectedSKU);
            if (result.errCode === 0) {
                setFormData(prev => ({
                    ...prev,
                    inventoryList: prev.inventoryList.filter(inv => inv._id !== inventoryId)
                }));
                toast.success('Xóa tài khoản thành công');
            } else {
                throw new Error(result.message || "Xóa tài khoản thất bại");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Xóa tài khoản thất bại";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(null);
        }
    }
    const handleUpload = async () => {
        if (!validateData()) return;
        
        const dataToUpload = parseAccounts(formData.inventoryDataToUpload);
        
        setIsUploading(true);
        try {
            const result = await uploadInventory({
                productId,
                skuId: formData.selectedSKU,
                credentialsList: dataToUpload
            });
            
            if (result.errCode === 0) {
                setFormData(prev => ({
                    ...prev,
                    inventoryDataToUpload: '' // Clear upload data
                }));
                
                // Refresh inventory list
                await handleSelectedSkuChange(formData.selectedSKU);
                
                toast.success(`Đã thêm thành công ${dataToUpload.length} tài khoản vào kho hàng`);
            } else {
                throw new Error(result.message || "Bổ sung kho hàng thất bại");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Bổ sung kho hàng thất bại";
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    }

    const inventoryStatus = {
        AVAILABLE: { code: 'available', label: 'sẵn sàng' },
        SOLD: { code: 'sold', label: 'đã bán' },
        INVALID: { code: 'invalid', label: 'đã huỷ' }
    }

    const getStatusLabel = (status) => {
        const statusEntry = Object.values(inventoryStatus).find(
            (entry) => entry.code === status
        );
        return statusEntry.label ?? 'không xác định'
    }
    if (!isOpen) return null;
    return createPortal(
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Bổ sung kho hàng</h2>
                        <button
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={handleClose}
                            aria-label="Close modal"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Body */}
                    <div className="pt-4 pb-2">
                        {/* SKU Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn phân loại sản phẩm
                            </label>
                            <select 
                                value={formData.selectedSKU} 
                                onChange={(e) => handleSelectedSkuChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Chọn phân loại sản phẩm</option>
                                {formData.skus && formData.skus.map((sku) => (
                                    <option value={sku._id} key={sku._id}>{sku.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Upload Section */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-2">
                                        Thêm account
                                    </label>
                                    <textarea 
                                        rows="10" 
                                        id="inventory"
                                        placeholder="Nhập tài khoản ở đây, mỗi dòng là 1 tài khoản"
                                        value={formData.inventoryDataToUpload}
                                        onChange={e => handleInventoryChange(e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>
                                <button 
                                    onClick={handleUpload}
                                    disabled={isUploading || !formData.selectedSKU}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Đang thêm...
                                        </>
                                    ) : (
                                        'Thêm tài khoản'
                                    )}
                                </button>
                            </div>

                            {/* Inventory List */}
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-900">Danh sách tài khoản</h3>
                                        {formData.inventoryList && formData.inventoryList.some(inv => !inv.credentials && !inv.credential) && (
                                            <p className="text-xs text-orange-600 mt-1">
                                                ⚠️ Một số tài khoản hiển thị "Dữ liệu cũ" - đây là dữ liệu từ phiên bản cũ của hệ thống
                                            </p>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="ml-2 text-gray-500">Đang tải danh sách...</span>
                                            </div>
                                        ) : (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Tài khoản
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Trạng thái
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Ngày tạo
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Thao tác
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {formData.inventoryList && formData.inventoryList.length > 0 ? (
                                                        formData.inventoryList.map(inventory => (
                                                            <tr key={inventory._id} className={`hover:bg-gray-50 ${!inventory.credentials && !inventory.credential ? 'bg-yellow-50' : ''}`}>
                                                                <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                                                                    {inventory.credentials || inventory.credential || 
                                                                     <span className="text-orange-600 italic">Dữ liệu cũ - ID: {inventory._id?.slice(-6)}</span>}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        inventory.status === 'available' ? 'bg-green-100 text-green-800' :
                                                                        inventory.status === 'sold' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {getStatusLabel(inventory.status)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    {inventory?.createdAt ? new Date(inventory.createdAt).toLocaleDateString('vi-VN') : 'Không có dữ liệu'}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    <button
                                                                        onClick={() => handleDeleteInventory(inventory._id)}
                                                                        disabled={isDeleting === inventory._id}
                                                                        className="text-red-600 hover:text-red-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                                                        title="Xóa tài khoản"
                                                                    >
                                                                        {isDeleting === inventory._id ? (
                                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                                        ) : (
                                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                                {formData.selectedSKU ? 'Chưa có tài khoản nào' : 'Vui lòng chọn phân loại sản phẩm'}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
