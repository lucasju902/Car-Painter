import BaseAPIService from "./baseAPIService";

export default class LeagueSeriesService extends BaseAPIService {
  static getLeagueSeriesList = async () => {
    return this.requestWithAuth(`/leagueSeries`, "GET");
  };
  static getLeagueSeriesListByUserID = async (userID) => {
    return this.requestWithAuth(`/leagueSeries/byUser/${userID}`, "GET");
  };
  static createLeagueSeries = async (payload) => {
    return this.requestWithAuth(`/leagueSeries`, "POST", payload);
  };
  static getLeagueSeries = async (ID) => {
    return this.requestWithAuth(`/leagueSeries/${ID}`, "GET");
  };
  static updateLeagueSeries = async (ID, payload) => {
    return this.requestWithAuth(`/leagueSeries/${ID}`, "PUT", payload);
  };
  static deleteLeagueSeries = async (id) => {
    return this.requestWithAuth(`/leagueSeries/${id}`, "DELETE");
  };
}
