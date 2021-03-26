// import Cookies from "js-cookie";

const getQueryVariable = (variable) => {
  const query = decodeURIComponent(variable);
  var vars = query.split("&");
  let queryJson = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    queryJson[pair[0]] = pair[1];
  }
  return queryJson;
};

export default class CookieService {
  static getSiteLogin = () => {
    // return Cookies.get("site_login_v2", {
    //   domain: "tradingpaints.com",
    // });
    return getQueryVariable(
      "usr%3D20210226%26hash%3D5d9c68c6c50ed3d02a2fcf54f63993b6"
    );
  };
}
