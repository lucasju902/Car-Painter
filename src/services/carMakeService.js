import BaseAPIService from "./baseAPIService";

export default class CarMakeService extends BaseAPIService {
  static getCarMakeList = async () => {
    return this.requestWithAuth(`/carMake`, "GET");
  };
  static getCarMakeByID = async (id) => {
    return this.requestWithAuth(`/carMake/${id}`, "GET");
  };
  static createCarMake = async (payload) => {
    return this.requestWithAuth(`/carMake`, "POST", payload);
  };
  static updateCarMake = async (id, payload) => {
    return this.requestWithAuth(`/carMake/${id}`, "PUT", payload);
  };
}
