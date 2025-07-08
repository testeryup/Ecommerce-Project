import React, { useState, useEffect, useCallback } from 'react';
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
    
    // Handle add to cart for ProductCard
    const handleAddToCart = useCallback((product) => {
        console.log('ProductSection handleAddToCart called with:', product);
        
        if (!product) {
            toast.error('Sản phẩm không hợp lệ');
            return;
        }
        
        if (!product.skus || product.skus.length === 0) {
            toast.error('Sản phẩm không có phiên bản để thêm vào giỏ');
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
                    setProducts(result.data);
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
                <div className="text-center mt-12">
                    <button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Xem tất cả sản phẩm
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}