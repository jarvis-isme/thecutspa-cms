import axiosCLient from "./index";

class ProductApi {
  async searchProduct(params) {
    const url = "/product/get-products";
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.post(url, { params, headers });
  }
  async getAllProduct(params) {
    const url = "/home/get-all-categories-and-products";
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.get(url, { headers });
  }
  async deleteProduct(productId) {
    const url = `/product/delete-product/${productId}`;
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.delete(url, { headers });
  }
  async createProduct(params) {
    const url = `/product/create-product`;
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.post(url, params, { headers });
  }
  async updateProduct(params, productId) {
    const url = `/product/update-product/${productId}`;
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.post(url, params, { headers });
  }
  async getProductOrder(data){
    const url = `manager/product-order/get`;
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.post(url, data, { headers });
  }
  async confirmProductOrder(id){
    const url = `manager/product-order/confirm/${id}`
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.get(url, { headers });
  }
  async cancelProductOrder(id,data){
    const url = `manager/product-order/cancel/${id}`
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.post(url, data,{ headers });
  }
}
const userApi = new ProductApi();
export default userApi;
