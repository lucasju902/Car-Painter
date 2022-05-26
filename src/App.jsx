import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider } from "styled-components/macro";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";

import createTheme from "./theme";
import Routes from "./routes/Routes";
import config from "config";

ReactGA.initialize(config.gaTrackingID);

function App() {
  const theme = useSelector((state) => state.themeReducer);

  return (
    <React.Fragment>
      <Helmet
        titleTemplate="%s · Paint Builder · Trading Paints"
        defaultTitle="Paint Builder · Trading Paints"
      />
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
            <ThemeProvider theme={createTheme(theme.currentTheme)}>
              <Routes />
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </React.Fragment>
  );
}

export default App;
