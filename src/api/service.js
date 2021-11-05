import axiosClient from "./index";

class ServiceApi {
  async getAllService(params) {
    const url = "service/get-all-servicies-with-category";
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosClient.get(url, { headers });
  }
  async getAllServiceCategory(){
    const url = "https://thespacut.herokuapp.com/api/service-category/get-all"
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosClient.get(url, { headers });
  }
  async createService(data){
    const url = "service/create"
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "multipart/form-data"
    }
    return await axiosClient.post(url, data, {headers})
  }
  async updateService(id,data){
    const url = `service/update-service/${id}`
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "multipart/form-data"
    }
    return await axiosClient.post(url,data,{headers})
  }
  async deleteService(id){
    const url = `service/delete-service/${id}`
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    return await axiosClient.delete(url,{headers})
  }
  async createCategory(data){
    const url = 'service-category/create'
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "multipart/form-data"
    }
    return await axiosClient.post(url,data,{headers})
  }
  async getServiceOrder(data){
    const url ='manager/service-order/get'
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    return await axiosClient.post(url,data,{headers})
  }
  async confirmServiceOrder(id){
    const url =`manager/service-order/cancel/${id}`
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    return await axiosClient.get(url,{headers})
  }
  async cancelServiceOrder(id,data){
    const url = `manager/service-order/cancel/${id}`
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    return await axiosClient.post(url,data,{headers})
  }
  async markCompleteServiceOrder(id){
    const url = `manager/service-order/mark-complete/${id}`
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    return await axiosClient.get(url,{headers})
  }
}
const serviceApi = new ServiceApi();
export default serviceApi;
