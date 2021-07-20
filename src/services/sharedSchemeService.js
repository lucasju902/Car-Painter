import BaseAPIService from "./baseAPIService";

export default class SharedSchemeService extends BaseAPIService {
  static getSharedSchemeList = async () => {
    return this.requestWithAuth(`/shared`, "GET");
  };
  static getSharedSchemeListByUserID = async (userID) => {
    return this.requestWithAuth(`/shared/byUser/${userID}`, "GET");
  };
  static getSharedSchemeListBySchemeID = async (schemeID) => {
    return this.requestWithAuth(`/shared/byScheme/${schemeID}`, "GET");
  };
  static createSharedScheme = async (payload) => {
    return this.requestWithAuth(`/shared`, "POST", payload);
  };
  static getSharedScheme = async (schemeID) => {
    return this.requestWithAuth(`/shared/${schemeID}`, "GET");
  };
  static updateSharedScheme = async (schemeID, payload) => {
    return this.requestWithAuth(`/shared/${schemeID}`, "PUT", payload);
  };
  static deleteSharedScheme = async (id) => {
    return this.requestWithAuth(`/shared/${id}`, "DELETE");
  };
}
