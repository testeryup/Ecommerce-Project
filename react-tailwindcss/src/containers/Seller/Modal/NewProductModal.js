import { createPortal } from "react-dom";
import { useState } from "react";
import { useEffect, useCallback } from "react";
import { createOrUpdateProduct, getProductById } from '../../../services/userService';
import toast from 'react-hot-toast';

export default function NewProductModal({ isOpen, onClose, categoriesList, mode = 'create', productId = null }) {
    const MAX_IMAGES = 5;
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        images: [],
        skus: []
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setProductStateOnUpdate = useCallback((data) => {
        setFormData({
            name: data.name ?? '',
            description: data.description ?? '',
            category: data.category ?? '',
            subcategory: data.subcategory ?? '',
            images: data.images ?? [],
            skus: data.skus ?? []
        });

        const currentCategory = categoriesList.find(cat => cat._id === data.category);
        setSubcategoriesList(currentCategory?.subcategories || []);
    }, [categoriesList]); // Add categoriesList as dependency

    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const [newSku, setNewSku] = useState({
        name: '',
        price: '',
    });

    const [subcategoriesList, setSubcategoriesList] = useState([]);
    // const setProductStateOnUpdate = (data) => {
    //     console.log("check data subcategory", data.subcategory);
    //     setFormData({
    //         name: data.name ?? '',
    //         description: data.description ?? '',
    //         category: data.category ?? '',
    //         subcategory: data.subcategory ?? '',
    //         images: data.images ?? [],
    //         skus: data.skus ?? []
    //     });
    //     const currentCategory = categoriesList.find(cat => cat._id === data.category);
    //     setSubcategoriesList(currentCategory?.subcategories || []);
    // }
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductById(productId);
                setProductStateOnUpdate(result.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to fetch product data");
            }
        };

        if (mode === 'update' && productId) {
            fetchProduct();
        }
    }, [mode, productId, setProductStateOnUpdate, isOpen]);



    const handleAddSku = () => {
        if (!newSku.name || !newSku.price) {
            toast.error('Vui lòng nhập thông tin của SKU!');
            return;
        }
        updateField('skus', [...formData.skus, { ...newSku, stock: 0 }]);
        setNewSku({ name: '', price: '' });
    };

    const handleRemoveSku = (skuName) => {
        updateField('skus', formData.skus.filter(sku => sku.name !== skuName));
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        if (formData.images.length + files.length > MAX_IMAGES) {
            toast.error(`Bạn chỉ được phép thêm tối đa ${MAX_IMAGES} ảnh`);
            return;
        }

        const validFiles = files.filter(file => file.type.startsWith('image/'));

        try {
            const base64Images = await Promise.all(
                validFiles.map(file => convertToBase64(file))
            );

            updateField('images', [...formData.images, ...base64Images]);
        } catch (error) {
            toast.error('Lỗi convert ảnh')
            console.error('Error converting images:', error);
        }
    };

    const removeImage = (index) => {
        updateField('images', formData.images.filter((_, i) => i !== index))
    };


    const handleCategoryChange = (e) => {
        updateField('category', e.target.value);
        updateField('subcategory', '');

        const currentCategory = categoriesList.find(cat => cat._id === e.target.value);
        setSubcategoriesList(currentCategory?.subcategories || []);
    }

    const resetForm = () => {
        setFormData({
            id: '',
            name: '',
            description: '',
            category: '',
            subcategory: '',
            images: [],
            skus: []
        })
    };

    const validateInput = (data) => {
        const errors = {};
        if (!data.name) errors.name = 'Tên sản phẩm là bắt buộc';
        if (!data.category) errors.category = 'Danh mục là bắt buộc';
        if (!data.description) errors.description = 'Mô tả là bắt buộc';
        if (!data.skus.length) errors.skus = 'Cần ít nhất một SKU';
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    const handleSaveProduct = async () => {
        setIsSubmitting(true);
        setFormErrors({});
        try {
            const { isValid, errors } = validateInput(formData);
            if (!isValid) {
                setFormErrors(errors);
                toast.error('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const response = await createOrUpdateProduct({ ...formData, id: productId });
            if (response?.errCode === 0) {
                toast.success('Thao tác thành công');
                resetForm();
                onClose();
            }
            else {
                toast.error('Thao tác thất bại');

            }
        } catch (error) {
            toast.error('Thao tác thất bại');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    if (!isOpen) return null;

    const handleClose = () => {
        resetForm();
        onClose();
    }
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />
            
            {/* Modal Content */}
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {mode === 'create' ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
                    </h2>
                    <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="space-y-6">
                        {/* Basic Info Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    id="name" 
                                    type="text"
                                    value={formData.name} 
                                    onChange={(e) => updateField('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Nhập tên sản phẩm"
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-red-600">{formErrors.name}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => handleCategoryChange(e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                >
                                    <option value="">Chọn danh mục mặt hàng</option>
                                    {Array.isArray(categoriesList) && categoriesList.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.category && (
                                    <p className="text-sm text-red-600">{formErrors.category}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Loại mặt hàng
                                </label>
                                <select
                                    value={formData.subcategory}
                                    onChange={(e) => updateField('subcategory', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    disabled={!formData.category}
                                >
                                    <option value="">Chọn loại mặt hàng</option>
                                    {Array.isArray(subcategoriesList) && subcategoriesList.map(sub => (
                                        <option key={sub._id} value={sub.name}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* SKU Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    SKUs <span className="text-red-500">*</span>
                                </label>
                                {formErrors.skus && (
                                    <p className="text-sm text-red-600">{formErrors.skus}</p>
                                )}
                            </div>

                            {/* Add SKU Form */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Tên SKU"
                                        value={newSku.name}
                                        onChange={e => setNewSku({ ...newSku, name: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Giá (VNĐ)"
                                        value={newSku.price}
                                        onChange={e => setNewSku({ ...newSku, price: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button 
                                        onClick={handleAddSku} 
                                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
                                    >
                                        Thêm SKU
                                    </button>
                                </div>
                            </div>

                            {/* SKU List */}
                            {formData.skus.length > 0 && (
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-gray-100 grid grid-cols-4 gap-4 p-3 text-sm font-medium text-gray-700">
                                        <span>Tên SKU</span>
                                        <span>Giá</span>
                                        <span>Còn lại</span>
                                        <span>Thao tác</span>
                                    </div>
                                    {/* SKU Items */}
                                    <div className="divide-y divide-gray-200">
                                        {formData.skus.map((sku, index) => (
                                            <div key={index} className="grid grid-cols-4 gap-4 p-3 items-center hover:bg-gray-50">
                                                <span className="text-sm text-gray-900">{sku.name}</span>
                                                <span className="text-sm text-gray-900">{Number(sku.price).toLocaleString()}đ</span>
                                                <span className="text-sm text-gray-500">{sku.stock || 0}</span>
                                                <button
                                                    onClick={() => handleRemoveSku(sku.name)}
                                                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Images Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Hình ảnh sản phẩm (tối đa {MAX_IMAGES} ảnh)
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click để upload</span> hoặc kéo thả
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={formData.images.length >= MAX_IMAGES}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            
                            {/* Image Preview Grid */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img 
                                                src={image} 
                                                alt={`Product ${index + 1}`} 
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Mô tả sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                rows="6"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                            />
                            {formErrors.description && (
                                <p className="text-sm text-red-600">{formErrors.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleSaveProduct}
                        disabled={isSubmitting}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isSubmitting && (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isSubmitting ? 'Đang xử lý...' : (mode === 'create' ? 'Lưu thông tin' : 'Cập nhật')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}