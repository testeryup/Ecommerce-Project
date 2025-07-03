import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';
import productService from '../services/productService';
import { placeholderImage } from '../utils/imageUtils';

const SimpleProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products...');
        const response = await productService.getProducts();
        console.log('📊 API Response:', response);
        
        if (response.errCode === 0) {
          setProducts(response.data || []);
          console.log('✅ Products loaded successfully:', response.data.length);
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageSrc = (product) => {
    if (product.thumbnail && product.thumbnail.startsWith('data:image/')) {
      console.log('🖼️ Using thumbnail for:', product.name);
      return product.thumbnail;
    }
    
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage && firstImage.startsWith('data:image/')) {
        console.log('🖼️ Using first image for:', product.name);
        return firstImage;
      }
    }
    
    console.log('🔄 Using placeholder for:', product.name);
    return placeholderImage;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getMinPrice = (skus) => {
    if (!skus || skus.length === 0) return 0;
    return Math.min(...skus.map(sku => sku.price));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600">
          Discover the most popular premium services and accounts ({products.length} products found)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const minPrice = getMinPrice(product.skus);
          
          return (
            <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={getImageSrc(product)} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    console.log('🚫 Image load error for:', product.name);
                    e.target.src = placeholderImage;
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded for:', product.name);
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon 
                      key={star} 
                      icon={faStar} 
                      className="text-yellow-400 text-sm" 
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.5)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(minPrice)}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleProductGrid;
