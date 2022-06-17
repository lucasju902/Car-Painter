import BaseAPIService from "./baseAPIService";

export default class SchemeService extends BaseAPIService {
  static getSchemeList = async () => {
    return this.requestWithAuth(`/scheme`, "GET");
  };
  static getSchemeListByUserID = async (userID) => {
    return this.requestWithAuth(`/scheme/?userID=${userID}`, "GET");
  };
  static getSchemeListByUploadID = async (uploadID) => {
    return this.requestWithAuth(`/scheme/byUpload/${uploadID}`, "GET");
  };
  static createScheme = async (carMakeID, name, userID, legacy_mode) => {
    return this.requestWithAuth(`/scheme`, "POST", {
      carMakeID,
      name,
      userID,
      legacy_mode,
    });
  };
  static getScheme = async (schemeID) => {
    return this.requestWithAuth(`/scheme/${schemeID}`, "GET");
  };
  static updateScheme = async (schemeID, payload) => {
    return this.requestWithAuth(`/scheme/${schemeID}`, "PUT", payload);
  };
  static deleteScheme = async (id) => {
    return this.requestWithAuth(`/scheme/${id}`, "DELETE");
  };
  static cloneScheme = async (id) => {
    return this.requestWithAuth(`/scheme/clone/${id}`, "POST");
  };
  static renewCarMakeLayers = async (id) => {
    return this.requestWithAuth(`/scheme/renewCarMakeLayers/${id}`, "POST");
  };

  static uploadThumbnail = async (formData) => {
    return this.requestWithAuth(
      `/scheme/thumbnail`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
  };

  static uploadToShowroom = async (schemeID, payload) => {
    return this.directRequestWithAuth(
      // `https://beta:cort@beta.tradingpaints.com/showroom/upload/${schemeID}`,
      `https://beta.tradingpaints.com/showroom/upload/${schemeID}`,
      "POST",
      payload,
      0,
      "multipart/form-data"
    );
  };
}
