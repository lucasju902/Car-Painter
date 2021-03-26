import BaseAPIService from "./baseAPIService";

export default class SchemeService extends BaseAPIService {
  static getSchemeList = async () => {
    return this.requestWithAuth(`/scheme`, "GET");
  };
  static getSchemeListByUserID = async (userID) => {
    return this.requestWithAuth(`/scheme/?userID=${userID}`, "GET");
  };
  static createScheme = async (carMakeID, userID) => {
    return this.requestWithAuth(`/scheme`, "POST", {
      carMakeID,
      userID,
    });
  };
  static getScheme = async (schemeID) => {
    return this.requestWithAuth(`/scheme/${schemeID}`, "GET");
  };
  static updateScheme = async (schemeID, payload) => {
    return this.requestWithAuth(`/scheme/${schemeID}`, "PUT", payload);
  };
}
