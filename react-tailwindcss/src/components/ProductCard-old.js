import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, 
    faHeart, 
    faEye, 
    faStar,
    faTag
} from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product, onAddToCart }) => {
    if (!product) {
        return null;
    }

    const handleAddToCart = () => {
        if (onAddToCart && typeof onAddToCart === 'function') {
            onAddToCart(product);
        }
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

    const discountPercent = getDiscountPercent();
    const currentPrice = getCurrentPrice();
    const originalPrice = getOriginalPrice();

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-50 aspect-square">
                <img
                    src={product.image || '/api/placeholder/300/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discountPercent > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <FontAwesomeIcon icon={faTag} className="text-xs" />
                            -{discountPercent}%
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            New
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <FontAwesomeIcon icon={faHeart} className="text-sm" />
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                    </button>
                </div>

                {/* Quick Add to Cart Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
                        Thêm vào giỏ
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={`text-xs ${
                                i < Math.floor(product.rating || 4.5)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                        ({product.reviewCount || 0})
                    </span>
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                {/* Category */}
                {product.category && (
                    <p className="text-sm text-gray-500 mb-3">
                        {product.category.name}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-blue-600">
                            {formatPrice(currentPrice)}
                        </span>
                        {originalPrice > currentPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                    
                    {/* Mobile Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="lg:hidden w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
