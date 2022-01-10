import BaseAPIService from "./baseAPIService";

export default class CarService extends BaseAPIService {
  static getCarList = async () => {
    return this.requestWithAuth(`/car`, "GET");
  };
  static getCarByID = async (id) => {
    return this.requestWithAuth(`/car/${id}`, "GET");
  };
  static getActiveCar = async (userID, carMakeID) => {
    return this.requestWithAuth(
      `/car/active?userID=${userID}&carMake=${carMakeID}`,
      "GET"
    );
  };
  static getCarRace = async (builderID, number) => {
    return this.directRequestWithAuth(
      `https://www.tradingpaints.com/builder.php?cmd=loadrace&builder_id=${builderID}&number=${number}`,
      "GET"
    );
  };
  static createCar = async (payload) => {
    return this.requestWithAuth(`/car`, "POST", payload);
  };
  static updateCar = async (id, payload) => {
    return this.requestWithAuth(`/car/${id}`, "PUT", payload);
  };
}
