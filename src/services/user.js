import userApi from "../api/user";

class UserService {
  async loginService(params) {
    try {
      var response = await userApi.login(params);
      // console.log(response);
    } catch (error) {
      return error.response.data;
    }
    return response;
  }
}

const userService = new UserService();
export default userService;