const mdb = require("knex-mariadb");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  baseURL: process.env.BASE_URL,
  port: process.env.PORT || 3000,
  database: {
    client: process.env.DB_CLIENT === "mysql" ? process.env.DB_CLIENT : mdb,
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || "3306",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8",
    },
    migrations: {
      tableName: "migrations",
      directory: `${process.cwd()}/server/migrations`,
    },
    seeds: {
      tableName: "seeds",
      directory: `${process.cwd()}/server/seeds`,
    },
    debug: false,
  },
  awsKey: process.env.AWS_API_KEY,
  awsSecret: process.env.AWS_API_SECRET,
  awsRegion: process.env.AWS_REGION,
  bucketURL: process.env.BUCKET_URL,
};
