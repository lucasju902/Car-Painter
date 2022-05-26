import React, { useEffect } from "react";
import ReactGA from "react-ga";

export const withGAPageTracking = (Component) =>
  React.memo((props) => {
    useEffect(() => {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    return <Component {...props} />;
  });
