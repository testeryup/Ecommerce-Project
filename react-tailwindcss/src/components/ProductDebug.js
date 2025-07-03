import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductDebug = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await productService.getProducts();
        console.log('API Response:', response);
        
        if (response.errCode === 0) {
          setProducts(response.data || []);
          console.log('Products loaded:', response.data.length);
          
          // Debug image data
          response.data.forEach((product, index) => {
            console.log(`Product ${index + 1}:`, {
              name: product.name,
              hasThumbnail: !!product.thumbnail,
              thumbnailStarts: product.thumbnail ? product.thumbnail.substring(0, 50) + '...' : 'No thumbnail',
              hasImages: !!product.images,
              imagesCount: product.images ? product.images.length : 0
            });
          });
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product Debug Info</h2>
      <p className="mb-4">Total products: {products.length}</p>
      
      <div className="space-y-4">
        {products.slice(0, 3).map((product, index) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>Has thumbnail: {product.thumbnail ? 'Yes' : 'No'}</p>
            {product.thumbnail && (
              <div>
                <p>Thumbnail preview:</p>
                <img 
                  src={product.thumbnail} 
                  alt={product.name}
                  className="w-32 h-32 object-cover border"
                  onError={(e) => {
                    console.error('Image failed to load:', product.name);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', product.name);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDebug;
