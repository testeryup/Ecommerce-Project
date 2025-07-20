import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../services/userService';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faArrowRight, 
    faStar,
    faFire,
    faGift,
    faChevronRight,
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 group"
    >
        <FontAwesomeIcon icon={faArrowRight} className="group-hover:scale-110 transition-transform duration-300" />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 group"
    >
        <FontAwesomeIcon icon={faArrowLeft} className="group-hover:scale-110 transition-transform duration-300" />
    </button>
);

export default function ProductSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Handle add to cart for ProductCard
    const handleAddToCart = useCallback((product) => {
        console.log('ProductSection handleAddToCart called with:', product);
        
        if (!product) {
            toast.error('Sản phẩm không hợp lệ');
            return;
        }
        
        if (!product.skus || product.skus.length === 0) {
            toast.error('Sản phẩm tạm hết');
            return;
        }
        
        try {
            dispatch(addToCart({
                product: product,
                sku: product.skus[0], // Use first SKU as default
                quantity: 1
            }));
            toast.success('Đã thêm vào giỏ hàng');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        }
    }, [dispatch]);

    const settings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        infinite: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const result = await getProducts();
                
                if (result.errCode === 0) {
                    if (result.data && result.data.length > 0) {
                        setProducts(result.data);
                    } else {
                        // If no products from API, add some mock data for testing
                        const mockProducts = [
                            {
                                _id: "mock1",
                                name: "iPhone 15 Pro Max",
                                images: ["https://via.placeholder.com/300x300/007AFF/ffffff?text=iPhone+15"],
                                category: { name: "Điện thoại" },
                                skus: [{
                                    price: 29990000,
                                    originalPrice: 32990000,
                                    inventory: { quantity: 10 }
                                }],
                                rating: 5,
                                reviewCount: 234
                            },
                            {
                                _id: "mock2", 
                                name: "MacBook Pro M3",
                                images: ["https://via.placeholder.com/300x300/2D2D2D/ffffff?text=MacBook+Pro"],
                                category: { name: "Laptop" },
                                skus: [{
                                    price: 52990000,
                                    originalPrice: 55990000,
                                    inventory: { quantity: 5 }
                                }],
                                rating: 5,
                                reviewCount: 156
                            },
                            {
                                _id: "mock3",
                                name: "iPad Air M2", 
                                images: ["https://via.placeholder.com/300x300/5856D6/ffffff?text=iPad+Air"],
                                category: { name: "Tablet" },
                                skus: [{
                                    price: 16990000,
                                    originalPrice: 18990000,
                                    inventory: { quantity: 8 }
                                }],
                                rating: 4,
                                reviewCount: 89
                            },
                            {
                                _id: "mock4",
                                name: "AirPods Pro 2",
                                images: ["https://via.placeholder.com/300x300/34C759/ffffff?text=AirPods+Pro"],
                                category: { name: "Tai nghe" },
                                skus: [{
                                    price: 6990000,
                                    originalPrice: 7490000,
                                    inventory: { quantity: 15 }
                                }],
                                rating: 5,
                                reviewCount: 312
                            }
                        ];
                        setProducts(mockProducts);
                    }
                }
                else {
                    throw new Error("An error occured when fetching data:", result);
                }
            } catch (error) {
                setError(error.message || error);
            }
            setLoading(false);
        }
        fetchProducts();
    }, [])
    
    if (loading) return (<Loading />);
    
    if (error) {
        console.log("error from product slider container:", error);
        return (
            <div className="min-h-[200px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-2">Có lỗi xảy ra khi tải sản phẩm</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-6">
                        <div className="bg-orange-600 rounded-full p-2">
                            <FontAwesomeIcon icon={faFire} className="text-white text-lg" />
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Sản phẩm 
                        <span className="text-orange-600"> Hot</span> nhất
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Khám phá những sản phẩm được yêu thích nhất với chất lượng premium và giá cả hợp lý
                    </p>
                </div>

                {/* Products Slider */}
                <div className="relative">
                    {products && products.length > 0 ? (
                        <Slider {...settings} className="product-slider">
                            {products.map((product, index) => (
                                <div key={index} className="px-3">
                                    <ProductCard 
                                        product={product} 
                                        onAddToCart={handleAddToCart}
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="text-center py-16">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-gray-400 text-6xl mb-4" />
                            <p className="text-gray-500 text-xl">Không có sản phẩm nào để hiển thị</p>
                        </div>
                    )}
                </div>

                {/* View All Products Button */}
                <div className="text-center mt-16">
                    <button 
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Xem tất cả sản phẩm
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}