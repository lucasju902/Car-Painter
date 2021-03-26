const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");
const Upload = require("../models/upload.model");
const config = require("../config");

class UploadService {
  static async getList() {
    const uploads = await Upload.forge().fetchAll();
    return uploads;
  }

  static async getListByUserID(user_id) {
    const uploads = await Upload.where({
      user_id: user_id,
    }).fetchAll();
    return uploads;
  }

  static async getById(id) {
    const upload = await Upload.where({ id }).fetch();
    return upload;
  }

  static async create(payload) {
    const upload = await Upload.forge(payload).save();
    return upload;
  }

  static async updateById(id, payload) {
    const upload = await this.getById(id);
    await upload.save(payload);
    return upload;
  }

  static uploadFiles() {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `./server/assets/uploads/`);
      },
      filename: function (req, file, cb) {
        let { userID } = req.body;
        cb(null, userID + "_" + file.originalname);
      },
    });
    let upload = multer({ storage: storage }).fields([
      { name: "files", maxCount: 3 },
    ]);
    return upload;
  }

  static uploadFilesToS3() {
    let filesUploadMulter = multer({
      storage: multerS3({
        s3: s3,
        bucket: config.bucketURL,
        acl: "public-read",
        key: function (req, file, cb) {
          let { userID } = req.body;
          cb(null, `uploads/${userID}_${file.originalname}`);
        },
      }),
    }).fields([{ name: "files", maxCount: 3 }]);
    return filesUploadMulter;
  }
}

module.exports = UploadService;
