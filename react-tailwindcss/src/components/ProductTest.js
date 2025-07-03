import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductTest = () => {
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
          console.log('Products loaded:', response.data);
        } else {
          setError(response.message || 'Failed to load products');
          console.error('API Error:', response);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Unable to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products Test ({products.length})</h2>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product._id || index} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Price: {product.minPrice || 'N/A'}</p>
            <p>Stock: {product.totalStock || 'N/A'}</p>
            <p>Category: {product.category || 'N/A'}</p>
            <p>Seller: {product.seller?.username || 'Unknown'}</p>
            {product.thumbnail && (
              <div>
                <p>Has thumbnail: Yes</p>
                <p>Thumbnail length: {product.thumbnail.length}</p>
                <p>Thumbnail preview: {product.thumbnail.substring(0, 100)}...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTest;
