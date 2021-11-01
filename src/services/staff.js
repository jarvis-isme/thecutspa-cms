import staffApi from '../api/staff';

class StaffService {
  async getAll(params) {
    try {
      var response = await staffApi.getAll();
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async getAllShift() {
    try {
      var response = await staffApi.getAllShift();
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
  async createStaff(params) {
    try {
      var response = await staffApi.createStaffInfo(params);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
}

const staffService = new StaffService();

export default staffService;