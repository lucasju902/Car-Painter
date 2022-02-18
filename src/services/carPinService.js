import BaseAPIService from "./baseAPIService";

export default class CarPinService extends BaseAPIService {
  static getCarPinList = async () => {
    return this.requestWithAuth(`/carPin`, "GET");
  };
  static getCarPinListByUserID = async (userID) => {
    return this.requestWithAuth(`/carPin/byUser/${userID}`, "GET");
  };
  static createCarPin = async (payload) => {
    return this.requestWithAuth(`/carPin`, "POST", payload);
  };
  static getCarPin = async (ID) => {
    return this.requestWithAuth(`/carPin/${ID}`, "GET");
  };
  static updateCarPin = async (ID, payload) => {
    return this.requestWithAuth(`/carPin/${ID}`, "PUT", payload);
  };
  static deleteCarPin = async (id) => {
    return this.requestWithAuth(`/carPin/${id}`, "DELETE");
  };
}
