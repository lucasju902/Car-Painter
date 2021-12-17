import { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch } from "react-redux";

import {
  updateListItem as updateSchemeListItem,
  setCurrent as setCurrentScheme,
} from "redux/reducers/schemeReducer";
import { setMessage } from "redux/reducers/messageReducer";
import {
  mergeListItem as mergeLayerListItem,
  deleteListItem as deleteLayerListItem,
  insertToList as insertToLayerList,
} from "redux/reducers/layerReducer";
import SocketClient from "utils/socketClient";

export const useBoardSocket = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  // Socket.io Stuffs
  useEffect(() => {
    SocketClient.connect();

    SocketClient.on("connect", () => {
      SocketClient.emit("room", params.id);
    });

    SocketClient.on("client-create-layer", (response) => {
      dispatch(insertToLayerList(response.data));
    });

    SocketClient.on("client-update-layer", (response) => {
      dispatch(mergeLayerListItem(response.data));
    });

    SocketClient.on("client-delete-layer", (response) => {
      dispatch(deleteLayerListItem(response.data));
    });

    SocketClient.on("client-update-scheme", (response) => {
      dispatch(updateSchemeListItem(response.data));
      dispatch(setCurrentScheme(response.data));
    });

    SocketClient.on("client-delete-scheme", () => {
      dispatch(setMessage({ message: "The Project has been deleted!" }));
      history.push("/");
    });

    return () => {
      SocketClient.disconnect();
    };
  }, []);
};
