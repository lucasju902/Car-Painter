const config = {
  env: process.env.NODE_ENV,
  assetsURL:
    process.env.REACT_APP_ASSET_URL ||
    (process.env.NODE_ENV !== "development"
      ? "/assets"
      : "http://localhost:3000/assets"),
  legacyAssetURL: "https://www.tradingpaints.com/builder",
  backendURL:
    process.env.NODE_ENV !== "development" ? "/" : "http://localhost:3000",
  apiURL:
    process.env.NODE_ENV !== "development"
      ? "/api"
      : "http://localhost:3000/api",
  gaTrackingID: process.env.REACT_APP_GA_TRACKING_ID,
};
console.log("ENV: ", config.env, config.backendURL);
export default config;
