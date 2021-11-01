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
    const url = "/manager/staff/get-all";
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
    return await axiosCLient.post(url, { params, headers });
  }
}
const staffApi = new StaffApi();
export default staffApi;
