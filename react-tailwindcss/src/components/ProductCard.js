import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, 
    faHeart, 
    faEye, 
    faStar
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    if (!product) {
        return null;
    }

    // Debug log to check product data structure
    // console.log('ProductCard received product:', product);
    // console.log('Product ID field:', product._id || product.id);
    // console.log('Product image fields:', {
    //     imageUrl: product.imageUrl,
    //     images: product.images,
    //     image: product.image,
    //     thumbnail: product.thumbnail
    // });
    // console.log('Product SKUs structure:', product.skus);
    // console.log('Product inventory:', product.inventory);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart && typeof onAddToCart === 'function') {
            onAddToCart(product);
        }
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getDiscountPercent = () => {
        if (product.skus && product.skus.length > 0) {
            const sku = product.skus[0];
            if (sku.originalPrice && sku.price < sku.originalPrice) {
                return Math.round(((sku.originalPrice - sku.price) / sku.originalPrice) * 100);
            }
        }
        return 0;
    };

    const getCurrentPrice = () => {
        if (product.skus && product.skus.length > 0) {
            return product.skus[0].price;
        }
        return 0;
    };

    const getOriginalPrice = () => {
        if (product.skus && product.skus.length > 0) {
            return product.skus[0].originalPrice;
        }
        return 0;
    };

    const getProductImage = () => {
        // Try multiple possible image fields
        let imageUrl = null;
        
        // Check thumbnail first (usually base64 data)
        if (product.thumbnail && product.thumbnail.trim()) {
            imageUrl = product.thumbnail;
        }
        // Check images array
        else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            imageUrl = product.images[0];
        }
        // Check imageUrl field
        else if (product.imageUrl && product.imageUrl.trim()) {
            imageUrl = product.imageUrl;
        }
        // Check image field
        else if (product.image && product.image.trim()) {
            imageUrl = product.image;
        }
        
        // Validate the image URL/data
        if (imageUrl) {
            // If it's base64 data, return as is
            if (imageUrl.startsWith('data:image/')) {
                return imageUrl;
            }
            // If it's a URL, make sure it's valid
            if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
                return imageUrl;
            }
        }
        
        // Return null if no valid image found
        return null;
    };

    const getStockQuantity = () => {
        // Try multiple possible inventory structures
        if (product.skus && product.skus.length > 0) {
            const sku = product.skus[0];
            
            // Check if stock is in SKU (this is the actual structure based on logs)
            if (typeof sku.stock === 'number') {
                return sku.stock;
            }
            
            // Check SKU inventory
            if (sku.inventory && typeof sku.inventory.quantity === 'number') {
                return sku.inventory.quantity;
            }
            
            // Check if quantity is directly in SKU
            if (typeof sku.quantity === 'number') {
                return sku.quantity;
            }
        }
        
        // Check if inventory is directly in product
        if (product.inventory && typeof product.inventory.quantity === 'number') {
            return product.inventory.quantity;
        }
        
        // Check if quantity is directly in product
        if (typeof product.quantity === 'number') {
            return product.quantity;
        }
        
        // Check if stock is used instead of quantity
        if (typeof product.stock === 'number') {
            return product.stock;
        }
        
        // Default to available if we can't determine
        // console.log('Could not determine stock quantity for product:', product);
        return 1; // Default to available
    };

    const discountPercent = getDiscountPercent();
    const currentPrice = getCurrentPrice();
    const originalPrice = getOriginalPrice();
    const productImage = getProductImage();
    const stockQuantity = getStockQuantity();

    return (
        <Link 
            to={`/product/${product._id || product.id}`}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {productImage && productImage !== 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=No+Image' ? (
                        <img
                            src={productImage}
                            alt={product.name || 'Sản phẩm'}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-2"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    
                    {/* Fallback placeholder */}
                    <div 
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
                        style={{ display: productImage && productImage !== 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=No+Image' ? 'none' : 'flex' }}
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Chưa có hình ảnh</p>
                        </div>
                    </div>
                    
                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            -{discountPercent}%
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                        <button
                            onClick={handleWishlist}
                            className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 ${
                                isWishlisted 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                            }`}
                        >
                            <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = `/product/${product._id || product.id}`;
                            }}
                            className="w-10 h-10 bg-white/90 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick Add to Cart - appears on hover */}
                    <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-black/90 backdrop-blur-md text-white py-3 rounded-full font-medium hover:bg-black transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                            <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                            <span>Thêm vào giỏ</span>
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                    {/* Category */}
                    <div className="text-sm text-gray-500 mb-2 font-medium">
                        {product.category?.name || 'Sản phẩm'}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`w-4 h-4 ${
                                        i < (product.rating || 5) ? 'text-yellow-400' : 'text-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                            ({product.reviewCount || 0})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                            {formatPrice(currentPrice)}
                        </span>
                        {originalPrice > currentPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="mt-3">
                        {stockQuantity > 0 ? (
                            <span className="text-sm text-emerald-600 font-medium">
                                Còn hàng ({stockQuantity} sản phẩm)
                            </span>
                        ) : (
                            <span className="text-sm text-red-500 font-medium">
                                Hết hàng
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
