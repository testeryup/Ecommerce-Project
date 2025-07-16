import api from '../axios';

const productService = {
  // Lấy tất cả sản phẩm
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/api/products', { params });
      return response; // axios interceptor already returns response.data
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Lấy tất cả sản phẩm (alias)
  getAllProduct: async (params = {}) => {
    return productService.getProducts(params);
  },

  // Lấy sản phẩm theo ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response; // axios interceptor already returns response.data
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get('/api/products', { 
        params: { category } 
      });
      return response; // axios interceptor already returns response.data
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (query) => {
    try {
      const response = await api.get('/api/products', { 
        params: { search: query } 
      });
      return response; // axios interceptor already returns response.data
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

// Export individual functions for backward compatibility
export const getAllProduct = productService.getAllProduct;
export const getProductById = productService.getProductById;
export const searchProducts = productService.searchProducts;

export default productService;
