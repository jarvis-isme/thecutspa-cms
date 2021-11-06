import serviceApi from "../api/service";

class ServiceService{
    async getAllWithCategory(){
        try {
            var response = await serviceApi.getAllService();
          } catch (error) {
            return error.response.data;
          }
          return response;
    }
    async getAllServiceCategory(){
      try {
        var response = await serviceApi.getAllServiceCategory();
      } catch (error) {
        return error.response.data;
      }
      return response;
    }
    async createService(data){
      try {
        var response = await serviceApi.createService(data)
      } catch (error) {
        return error.response.data
      }
      return response;
    }
    async updateService(id,data){
      try {
        var response = await serviceApi.updateService(id,data)
      } catch (error) {
        return error
      }
      return response
    }
    async deleteService(id){
      try {
        var response = await serviceApi.deleteService(id)
      } catch (error) {
        return error
      }
      return response
    }
    async createCategory(data){
      try {
        var response = await serviceApi.createCategory(data)
      } catch (error) {
        return error
      }
      return response
    }
    async getServiceOrder(data){
      try {
        var response = await serviceApi.getServiceOrder(data)
      } catch (error) {
        return error
      }
      return response
    }
    async confirmServiceOrder(id){
      try {
        var response = await serviceApi.confirmServiceOrder(id)
      } catch (error) {
        return error
      }
      return response
    }
    async cancelServiceOrder(id,data){
      try {
        var response= await serviceApi.cancelServiceOrder(id,data)
      } catch (error) {
        return error
      }
      return response
    }
    async markCompleteServiceOrder(id){
      try {
        var response= await serviceApi.markCompleteServiceOrder(id)
      } catch (error) {
        return error
      }
      return response
    }
}
const serviceService = new ServiceService()
export default serviceService