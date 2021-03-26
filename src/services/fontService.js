import BaseAPIService from "./baseAPIService";

export default class FontService extends BaseAPIService {
  static getFontList = async () => {
    return this.requestWithAuth(`/font`, "GET");
  };
  static getFontByID = async (id) => {
    return this.requestWithAuth(`/font/${id}`, "GET");
  };
  static createFont = async (payload) => {
    return this.requestWithAuth(`/font`, "POST", payload);
  };
  static updateFont = async (id, payload) => {
    return this.requestWithAuth(`/font/${id}`, "PUT", payload);
  };
}
