import BaseAPIService from "./baseAPIService";

export default class BlockedUserService extends BaseAPIService {
  static getBlockedUserList = async () => {
    return this.requestWithAuth(`/blockedUser`, "GET");
  };
  static getBlockedUserListByBlocker = async (blockerID) => {
    return this.requestWithAuth(`/blockedUser/blocker/${blockerID}`, "GET");
  };
  static getBlockedUserListByBlockedUser = async (userID) => {
    return this.requestWithAuth(`/blockedUser/blocked/${userID}`, "GET");
  };
  static getBlockedUserRowByID = async (id) => {
    return this.requestWithAuth(`/blockedUser/${id}`, "GET");
  };
  static createBlockedUserRow = async (payload) => {
    return this.requestWithAuth(`/blockedUser`, "POST", payload);
  };
  static updateBlockedUserRow = async (id, payload) => {
    return this.requestWithAuth(`/blockedUser/${id}`, "PUT", payload);
  };
}
