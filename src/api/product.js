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
    return await axiosCLient.delete(url,{headers});
  }
}
const userApi = new ProductApi();
export default userApi;
