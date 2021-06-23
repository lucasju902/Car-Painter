const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");
const config = require("../config");

class FileService {
  // type: "upload", "thumbnail"
  static uploadFiles(type = "upload") {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (type === "upload") cb(null, `./server/assets/uploads/`);
        else cb(null, "./server/assets/scheme_thumbnails/");
      },
      filename: function (req, file, cb) {
        let { userID } = req.body;
        if (type === "upload") cb(null, userID + "_" + file.originalname);
        else cb(null, file.originalname);
      },
    });
    let upload = multer({ storage: storage }).fields([
      { name: "files", maxCount: 3 },
    ]);
    return upload;
  }

  // type: "upload", "thumbnail"
  static uploadFilesToS3(type = "upload") {
    let filesUploadMulter = multer({
      storage: multerS3({
        s3: s3,
        bucket: config.bucketURL,
        acl: "public-read",
        contentType: function (req, file, cb) {
          cb(null, file.mimetype);
        },
        key: function (req, file, cb) {
          let { userID } = req.body;
          if (type === "upload")
            cb(null, `uploads/${userID}_${file.originalname}`);
          else cb(null, `scheme_thumbnails/${file.originalname}`);
        },
      }),
    }).fields([{ name: "files", maxCount: 3 }]);
    return filesUploadMulter;
  }

  static async cloneFileOnS3(file_path, new_path) {
    await s3
      .copyObject({
        Bucket: config.bucketURL,
        CopySource: config.bucketURL + "/" + file_path,
        Key: new_path,
        ACL: "public-read",
      })
      .promise();
    return true;
  }

  static async deleteFileFromS3(file_path) {
    await s3
      .deleteObject({
        Bucket: config.bucketURL,
        Key: file_path,
      })
      .promise();
    return true;
  }
}

module.exports = FileService;
