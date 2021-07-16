import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

import authReducer from "./authReducer";
import boardReducer from "./boardReducer";
import messageReducer from "./messageReducer";
import themeReducer from "./themeReducer";
import schemeReducer from "./schemeReducer";
import carMakeReducer from "./carMakeReducer";
import basePaintReducer from "./basePaintReducer";
import layerReducer from "./layerReducer";
import overlayReducer from "./overlayReducer";
import logoReducer from "./logoReducer";
import uploadReducer from "./uploadReducer";
import fontReducer from "./fontReducer";
import userReducer from "./userReducer";

const reducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    authReducer,
    boardReducer,
    messageReducer,
    themeReducer,
    schemeReducer,
    carMakeReducer,
    basePaintReducer,
    layerReducer,
    overlayReducer,
    logoReducer,
    uploadReducer,
    fontReducer,
    userReducer,
  });

export default reducers;
