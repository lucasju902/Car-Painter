import BaseAPIService from "./baseAPIService";

export default class TeamService extends BaseAPIService {
  static getTeamList = async () => {
    return this.requestWithAuth(`/team`, "GET");
  };
  static getTeamListByUserID = async (userID) => {
    return this.requestWithAuth(`/team/byUser/${userID}`, "GET");
  };
  static createTeam = async (payload) => {
    return this.requestWithAuth(`/team`, "POST", payload);
  };
  static getTeam = async (ID) => {
    return this.requestWithAuth(`/team/${ID}`, "GET");
  };
  static updateTeam = async (ID, payload) => {
    return this.requestWithAuth(`/team/${ID}`, "PUT", payload);
  };
  static deleteTeam = async (id) => {
    return this.requestWithAuth(`/team/${id}`, "DELETE");
  };
}
