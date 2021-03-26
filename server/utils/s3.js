const AWS = require("aws-sdk");
const config = require("../config");
AWS.config.update({
  accessKeyId: config.awsKey,
  secretAccessKey: config.awsSecret,
  region: config.awsRegion,
});
const s3 = new AWS.S3();

module.exports = s3;
