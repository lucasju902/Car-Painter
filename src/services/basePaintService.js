import BaseAPIService from "./baseAPIService";

export default class BasePaintService extends BaseAPIService {
  static getBasePaintList = async () => {
    return this.requestWithAuth(`/basePaint`, "GET");
  };
  static getBasePaintByID = async (id) => {
    return this.requestWithAuth(`/basePaint/${id}`, "GET");
  };
  static createBasePaint = async (payload) => {
    return this.requestWithAuth(`/basePaint`, "POST", payload);
  };
  static updateBasePaint = async (id, payload) => {
    return this.requestWithAuth(`/basePaint/${id}`, "PUT", payload);
  };
}
