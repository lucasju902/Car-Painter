const config = {
  env: process.env.NODE_ENV,
  assetsURL:
    process.env.REACT_APP_ASSET_URL ||
    (process.env.NODE_ENV !== "development"
      ? "/assets"
      : "http://localhost:3000/assets"),
  apiURL:
    process.env.NODE_ENV !== "development"
      ? "/api"
      : "http://localhost:3000/api",
};
export default config;
