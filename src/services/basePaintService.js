import BaseAPIService from "./baseAPIService";

export default class BasePaintService extends BaseAPIService {
  static getBasePaintList = async () => {
    return this.requestWithAuth(`/base`, "GET");
  };
  static getBasePaintByID = async (id) => {
    return this.requestWithAuth(`/base/${id}`, "GET");
  };
  static createBasePaint = async (payload) => {
    return this.requestWithAuth(`/base`, "POST", payload);
  };
  static updateBasePaint = async (id, payload) => {
    return this.requestWithAuth(`/base/${id}`, "PUT", payload);
  };
}
