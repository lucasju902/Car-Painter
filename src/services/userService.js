import BaseAPIService from "./baseAPIService";

export default class UserService extends BaseAPIService {
  static getUserList = async () => {
    return this.requestWithAuth(`/user`, "GET");
  };
}
