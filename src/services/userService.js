import BaseAPIService from "./baseAPIService";

export default class UserService extends BaseAPIService {
  static getUserList = async () => {
    return this.requestWithAuth(`/user`, "GET");
  };
  static getUserByID = async (id) => {
    return this.requestWithAuth(`/user/${id}`, "GET");
  };
  static getPremiumUserByID = async (id) => {
    return this.requestWithAuth(`/user/premium/${id}`, "GET");
  };
}
