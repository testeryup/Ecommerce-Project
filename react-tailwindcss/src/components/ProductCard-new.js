import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, 
    faHeart, 
    faEye, 
    faStar,
    faTag,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    if (!product) {
        return null;
    }

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

    const discountPercent = getDiscountPercent();
    const currentPrice = getCurrentPrice();
    const originalPrice = getOriginalPrice();

    return (
        <Link 
            to={`/product/${product.id}`}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                        src={product.imageUrl || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
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
                        <Link
                            to={`/product/${product.id}`}
                            className="w-10 h-10 bg-white/90 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </Link>
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
                <div className="p-6">
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
                        {product.skus && product.skus[0]?.inventory?.quantity > 0 ? (
                            <span className="text-sm text-emerald-600 font-medium">
                                Còn hàng
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
