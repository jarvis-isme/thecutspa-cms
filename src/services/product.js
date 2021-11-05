import productApi from '../api/product';

class ProductService {
  async searchProduct(params) {
    try {
      var response = await productApi.searchProduct(params);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async getAll() {
    try {
      var response = await productApi.getAllProduct();
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async delete(productId) {
    try {
      var response = await productApi.deleteProduct(productId);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async create(params) {
    try {
      var response = await productApi.createProduct(params);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async update(params, productId) {
    try {
      var response = await productApi.updateProduct(params, productId);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async getProductOrder(data){
    try {
      var response = await productApi.getProductOrder(data)
    } catch (error) {
      return error
    }
    return response
  }
  async cancelProductOrder(id,data){
    try {
      var response = await productApi.cancelProductOrder(id,data)
    } catch (error) {
      return error
    }
    return response
  }
  async confirmProductOrder(id){
    try {
      var response = await productApi.confirmProductOrder(id)
    } catch (error) {
      return error
    }
    return response
  }
}
const productService = new ProductService();
export default productService;