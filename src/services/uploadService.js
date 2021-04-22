import BaseAPIService from "./baseAPIService";

export default class UploadService extends BaseAPIService {
  static getUploadList = async () => {
    return this.requestWithAuth(`/upload`, "GET");
  };
  static getUploadListByUserID = async (userID) => {
    return this.requestWithAuth(`/upload/byUserID/${userID}`, "GET");
  };
  static getUploadByID = async (id) => {
    return this.requestWithAuth(`/upload/${id}`, "GET");
  };
  static createUpload = async (payload) => {
    return this.requestWithAuth(`/upload`, "POST", payload);
  };
  static updateUpload = async (id, payload) => {
    return this.requestWithAuth(`/upload/${id}`, "PUT", payload);
  };
  static deleteUpload = async (id) => {
    return this.requestWithAuth(`/upload/${id}`, "DELETE");
  };
  static uploadFiles = async (formData) => {
    return this.requestWithAuth(
      `/upload/uploadFiles`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
  };
}
