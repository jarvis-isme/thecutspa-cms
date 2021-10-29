import axiosCLient from './index';

class UserApi{
    async login (params){
        const url = "/authentication/login";
        return await axiosCLient.post(url, params);
    }
}
const userApi = new UserApi();
export default userApi;