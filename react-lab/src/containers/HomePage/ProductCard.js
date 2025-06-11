import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../ultils';
import './ProductCard.scss';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    
    const handleGetProduct = (productId) => {
        navigate(`/product/${productId}`);
    };
    
    // Tính toán giảm giá nếu có
    const calculateDiscount = () => {
        if (product.originalPrice && product.minPrice < product.originalPrice) {
            const discount = Math.round((1 - (product.minPrice / product.originalPrice)) * 100);
            return discount > 0 ? discount : null;
        }
        return null;
    };
    
    const discount = calculateDiscount();
    
    return (
        <div className="product-card">
            <div className="product-card__image-container" onClick={() => handleGetProduct(product._id)}>
                <img 
                    src={product.thumbnail} 
                    alt={product.name} 
                    className="product-card__image"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                />
                {discount && (
                    <div className="product-card__discount-badge">
                        -{discount}%
                    </div>
                )}
            </div>
            
            <div className="product-card__content">
                <h3 
                    className="product-card__title" 
                    title={product.name || 'Sản phẩm'} 
                    onClick={() => handleGetProduct(product._id)}
                >
                    {product.name || 'Sản phẩm'}
                </h3>
                
                <div className="product-card__seller">
                    <i className="fas fa-store"></i>
                    <span>{product.seller?.username || 'Không xác định'}</span>
                </div>
                
                <div className="product-card__price-row">
                    <div className="product-card__price-container">
                        <span className="product-card__price">{formatCurrency(product.minPrice)}₫</span>
                        {discount && (
                            <span className="product-card__original-price">
                                {formatCurrency(product.originalPrice)}₫
                            </span>
                        )}
                    </div>
                    
                    <button 
                        className="product-card__button" 
                        onClick={() => handleGetProduct(product._id)}
                        aria-label="Xem chi tiết"
                    >
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}