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
  static createSharedScheme = async (
    user_id,
    scheme_id,
    editable = 0,
    accepted = 0
  ) => {
    return this.requestWithAuth(`/shared`, "POST", {
      user_id,
      scheme_id,
      editable,
      accepted,
    });
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
