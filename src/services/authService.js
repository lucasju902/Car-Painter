import BaseAPIService from "./baseAPIService";

export default class AuthService extends BaseAPIService {
  static signIn = async (payload) => {
    return this.request(`/auth/login`, "POST", payload);
  };
  static getMe = async () => {
    return this.requestWithAuth(`/auth/me`, "GET");
  };
}
