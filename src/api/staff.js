import axiosCLient from "./index";

class StaffApi {
  async getAll() {
    const url = "/manager/staff/get-all";
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.get(url, { headers });
  }
  async getAllShift() {
    const url = "/manager/shift/get-all";
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.get(url, { headers });
  }
  async createStaffInfo(params) {
    const url = "/manager/staff/create";
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.post(url, params, { headers });
  }
  async deleteStaff(id) {
    const url = `/manager/staff/delete/${id}`;
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.delete(url, { headers });
  }
  async getAllSkill() {
    const url = "/manager/skill/get-all";
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await axiosCLient.get(url, { headers });
  }
  async updateStaff(staffId, params){
    const url = `manager/staff/update/${staffId}`;
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    return await axiosCLient.post(url, params, { headers });
  }
}
const staffApi = new StaffApi();
export default staffApi;
