const config = {
  env: process.env.NODE_ENV,
  // apiURL: "/api",
  assetsURL: process.env.REACT_APP_ASSET_URL || "http://localhost:3000/assets",
  apiURL: process.env.REACT_APP_BACKEND_ENDPOINT
    ? process.env.REACT_APP_BACKEND_ENDPOINT + "/api"
    : "http://localhost:3000/api",
};
export default config;
