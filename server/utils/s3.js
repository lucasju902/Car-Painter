const AWS = require("aws-sdk");
const config = require("../config");
const constants = require("../constants");

AWS.config.update({
  accessKeyId: config.awsKey,
  secretAccessKey: config.awsSecret,
  region: config.awsRegion,
});

let s3;
if (config.storageType === constants.StorageType.S3) {
  s3 = new AWS.S3();
} else if (config.storageType === constants.StorageType.SPACE) {
  const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
  s3 = new AWS.S3({
    endpoint: spacesEndpoint,
  });
}

module.exports = s3;
