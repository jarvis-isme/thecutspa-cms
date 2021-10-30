import productApi from '../api/product';

class ProductService {
  async searchProduct(params) {
    try {
      var response = await productApi.searchProduct(params);
      // console.log(response);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async getAll() {
    try {
      var response = await productApi.getAllProduct();
      // console.log(response);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async delete(productId) {
    try {
      var response = await productApi.deleteProduct(productId);
      // console.log(response);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async create(params) {
    try {
      var response = await productApi.createProduct(params);
      // console.log(response);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async update(params, productId) {
    try {
      var response = await productApi.updateProduct(params, productId);
      // console.log(response);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
}
const productService = new ProductService();
export default productService;