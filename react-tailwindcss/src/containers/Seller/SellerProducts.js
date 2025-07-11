import NewProductModal from './Modal/NewProductModal';
import InventoryModal from './Modal/InventoryModal';

import { useState, useEffect } from 'react';
import { getCategory } from '../../services/userService';
import { getAllProducts, deleteProduct } from '../../services/sellerService';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../ultils';

const ModalTypes = {
    NONE: 'NONE',
    NEW_PRODUCT: 'NEW_PRODUCT',
    INVENTORY: 'INVENTORY'
};

export default function SellerProducts() {
    const [categoriesList, setCategoriesList] = useState([]);
    const [products, setProducts] = useState([]);

    const [activeModal, setActiveModal] = useState(ModalTypes.NONE);
    const [mode, setMode] = useState('create');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const handleDeleteProduct = async (productId) => {
        try {
            const result = await deleteProduct(productId);
            console.log("check delete result:", result);
            if (result?.errCode === 0) {
                toast.success("Xoá sản phẩm thành công")
                setProducts(products => products.filter(p => p._id !== productId));
                return;
            }
            throw new Error("Xoá sản phẩm thất bại");

        } catch (error) {
            toast.error("Xoá sản phẩm thất bại");
            console.log("delete product error:", error);
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            let products = await getAllProducts();
            setProducts(products?.data || []);
        }

        if (activeModal === ModalTypes.NONE) {
            fetchProducts();
        }
    }, [activeModal]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategory('ALL');
                if (response && response.errCode === 0) {
                    setCategoriesList(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleOpenModal = (modalType, mode = 'create', productId = null) => {
        setActiveModal(modalType);
        setMode(mode);
        setSelectedProductId(productId);
    };

    const handleCloseModal = () => {
        setActiveModal(ModalTypes.NONE);
        setSelectedProductId(null);
    };

    return (
        <div className="seller-product-container">
            {activeModal === ModalTypes.NEW_PRODUCT && (
                <NewProductModal
                    isOpen={activeModal === ModalTypes.NEW_PRODUCT}
                    onClose={handleCloseModal}
                    categories={categoriesList}
                    mode={mode}
                    product={mode === 'edit' ? products.find(p => p._id === selectedProductId) : null}
                />
            )}
            {activeModal === ModalTypes.INVENTORY && (
                <InventoryModal
                    isOpen={activeModal === ModalTypes.INVENTORY}
                    onClose={handleCloseModal}
                    product={products.find(p => p._id === selectedProductId)}
                />
            )}

            <div className="product-header">
                <h1>Sản phẩm của tôi</h1>
                <button className="add-product-btn" onClick={() => handleOpenModal(ModalTypes.NEW_PRODUCT)}>
                    Thêm sản phẩm mới
                </button>
            </div>

            <div className="product-list">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.images[0]} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>{formatCurrency(product.price)}</p>
                            <p>Kho: {product.stock}</p>
                        </div>
                        <div className="product-actions">
                            <button onClick={() => handleOpenModal(ModalTypes.NEW_PRODUCT, 'edit', product._id)}>Sửa</button>
                            <button onClick={() => handleOpenModal(ModalTypes.INVENTORY, 'view', product._id)}>Kho</button>
                            <button onClick={() => handleDeleteProduct(product._id)}>Xoá</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
