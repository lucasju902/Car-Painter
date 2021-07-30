import BaseAPIService from "./baseAPIService";

export default class FavoriteSchemeService extends BaseAPIService {
  static getFavoriteSchemeList = async () => {
    return this.requestWithAuth(`/favorite`, "GET");
  };
  static getFavoriteSchemeListByUserID = async (userID) => {
    return this.requestWithAuth(`/favorite/byUser/${userID}`, "GET");
  };
  static getFavoriteSchemeListBySchemeID = async (schemeID) => {
    return this.requestWithAuth(`/favorite/byScheme/${schemeID}`, "GET");
  };
  static createFavoriteScheme = async (payload) => {
    return this.requestWithAuth(`/favorite`, "POST", payload);
  };
  static getFavoriteScheme = async (schemeID) => {
    return this.requestWithAuth(`/favorite/${schemeID}`, "GET");
  };
  static updateFavoriteScheme = async (schemeID, payload) => {
    return this.requestWithAuth(`/favorite/${schemeID}`, "PUT", payload);
  };
  static deleteFavoriteScheme = async (id) => {
    return this.requestWithAuth(`/favorite/${id}`, "DELETE");
  };
}
