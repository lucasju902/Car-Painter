import { useEffect } from "react";

import { useDispatch } from "react-redux";

import SocketClient from "utils/socketClient";

import {
  updateListItem as updateSchemeListItem,
  deleteListItem as deleteSchemeListItem,
} from "redux/reducers/schemeReducer";

export const useGeneralSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Socket.io Stuffs
    SocketClient.connect();

    SocketClient.on("connect", () => {
      SocketClient.emit("room", "general"); // Join General room
    });

    SocketClient.on("client-update-scheme", (response) => {
      dispatch(updateSchemeListItem(response.data));
    });

    SocketClient.on("client-delete-scheme", (response) => {
      console.log("client-delete-scheme: ", response);
      dispatch(deleteSchemeListItem(response.data.id));
    });

    return () => {
      SocketClient.disconnect();
    };
  }, []);
};
