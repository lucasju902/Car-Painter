import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useSelector, useDispatch } from "react-redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { useParams } from "react-router";

import { Box } from "@material-ui/core";

import { LayerTypes } from "constant";
import ScreenLoader from "components/ScreenLoader";
import Toolbar from "./Toolbar";
import Board from "./Board";
import Sidebar from "./sideBar";
import PropertyBar from "./propertyBar";
import ConfirmDialog from "dialogs/ConfirmDialog";

import { getScheme } from "redux/reducers/schemeReducer";
import { getOverlayList } from "redux/reducers/overlayReducer";
import { getFontList } from "redux/reducers/fontReducer";
import { getLogoList } from "redux/reducers/logoReducer";
import { deleteLayer } from "redux/reducers/layerReducer";
import { getUploadListByUserID } from "redux/reducers/uploadReducer";

const Wrapper = styled(Box)`
  background-color: ${(props) => props.background};
`;

const Scheme = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [confirmMessage, setConfirmMessage] = useState("");
  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const logoList = useSelector((state) => state.logoReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);
  const fontLoading = useSelector((state) => state.fontReducer.loading);
  const uploadsInitialized = useSelector(
    (state) => state.uploadReducer.initialized
  );

  const handleKeyEvent = (key, event) => {
    // Delete Selected Layer
    console.log("KeyEvent: ", key, event);
    if (
      key === "del" &&
      event.target.tagName !== "INPUT" &&
      currentLayer &&
      currentLayer.layer_type !== LayerTypes.CAR
    ) {
      setConfirmMessage(
        `Are you sure to delete "${currentLayer.layer_data.name}"?`
      );
    }
  };
  const handleConfirm = () => {
    dispatch(deleteLayer(currentLayer));
    setConfirmMessage("");
  };

  useEffect(() => {
    if (user && user.id && params.id) {
      if (!currentScheme) {
        dispatch(getScheme(params.id));
      }
      if (!uploadsInitialized) {
        dispatch(getUploadListByUserID(user.id));
      }
      if (!overlayList.length) dispatch(getOverlayList());
      if (!logoList.length) dispatch(getLogoList());
      if (!fontList.length) dispatch(getFontList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {schemeLoading || carMakeLoading || fontLoading || !currentScheme ? (
        <ScreenLoader />
      ) : (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
          <KeyboardEventHandler
            handleKeys={["all"]}
            onKeyEvent={handleKeyEvent}
          />
          <Box width="100%" height="calc(100% - 50px)" display="flex">
            <Sidebar />
            <Wrapper
              width="calc(100% - 350px)"
              background="#282828"
              overflow="hidden"
            >
              <Board />
            </Wrapper>
            <PropertyBar />
          </Box>
          <Toolbar />
        </Box>
      )}
      <ConfirmDialog
        text={confirmMessage}
        open={confirmMessage.length !== 0}
        onCancel={() => setConfirmMessage("")}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default Scheme;
