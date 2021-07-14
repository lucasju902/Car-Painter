import Cookies from "js-cookie";

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
    return getQueryVariable(
      Cookies.get(
        "site_login_v2"
        // {
        //   domain: "tradingpaints.com",
        // }
      )
    );
  };

  static setSiteLogin = (token) => {
    Cookies.set(
      "site_login_v2",
      token
      // {
      //   domain: "tradingpaints.com",
      // }
    );
  };

  static clearSiteLogin = () => {
    Cookies.remove(
      "site_login_v2"
      // {
      //   domain: "tradingpaints.com",
      // }
    );
  };
}
