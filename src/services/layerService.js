import BaseAPIService from "./baseAPIService";

export default class LayerService extends BaseAPIService {
  static getLayerList = async () => {
    return this.requestWithAuth(`/layer`, "GET");
  };
  static getLayerByID = async (id) => {
    return this.requestWithAuth(`/layer/${id}`, "GET");
  };
  static createLayer = async (payload) => {
    return this.requestWithAuth(`/layer`, "POST", payload);
  };
  static updateLayer = async (id, payload) => {
    return this.requestWithAuth(`/layer/${id}`, "PUT", payload);
  };
  static deleteLayer = async (id) => {
    return this.requestWithAuth(`/layer/${id}`, "DELETE");
  };
}
