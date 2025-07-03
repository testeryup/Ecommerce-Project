import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductDebugger = () => {
  const [status, setStatus] = useState('Đang kiểm tra...');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔄 Testing API connection...');
        console.log('🌐 Base URL:', process.env.REACT_APP_BACKEND_URL);
        
        setStatus('Đang kết nối API...');
        const response = await productService.getProducts();
        
        console.log('📊 Full API Response:', response);
        console.log('📊 Response type:', typeof response);
        console.log('📊 Response keys:', Object.keys(response || {}));
        
        if (response && response.errCode === 0) {
          setProducts(response.data || []);
          setStatus(`✅ Thành công! Tải được ${response.data?.length || 0} sản phẩm`);
          console.log('✅ Products loaded:', response.data);
        } else {
          setError(`❌ API Error: ${response?.message || 'Unknown error'}`);
          setStatus('❌ API trả về lỗi');
        }
      } catch (err) {
        console.error('❌ Network Error:', err);
        setError(`❌ Network Error: ${err.message}`);
        setStatus('❌ Lỗi kết nối');
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔧 Product API Debugger</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Trạng thái:</h3>
        <p className="text-lg">{status}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-semibold">Lỗi:</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Cấu hình:</h3>
        <p><strong>Backend URL:</strong> {process.env.REACT_APP_BACKEND_URL}</p>
        <p><strong>Node Env:</strong> {process.env.NODE_ENV}</p>
      </div>

      {products.length > 0 && (
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Dữ liệu sản phẩm ({products.length}):</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.slice(0, 3).map((product, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <p><strong>Tên:</strong> {product.name}</p>
                <p><strong>ID:</strong> {product._id}</p>
                <p><strong>Có thumbnail:</strong> {product.thumbnail ? 'Có' : 'Không'}</p>
                <p><strong>Có images:</strong> {product.images?.length || 0} ảnh</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Thử lại
        </button>
      </div>
    </div>
  );
};

export default ProductDebugger;
