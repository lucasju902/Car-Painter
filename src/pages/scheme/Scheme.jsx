import React, { useEffect, useState, useRef, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Helmet from "react-helmet";
import { useHistory, useParams } from "react-router";

import { Box } from "@material-ui/core";

import { ScreenLoader } from "components/common";
import { Toolbar, Board, SideBar, PropertyBar, BoardGuide } from "./components";

import {
  getScheme,
  setLoaded,
  getSharedUsers,
  getFavoriteList,
} from "redux/reducers/schemeReducer";
import { getOverlayList } from "redux/reducers/overlayReducer";
import { getFontList } from "redux/reducers/fontReducer";
import { getLogoList } from "redux/reducers/logoReducer";
import { setMessage } from "redux/reducers/messageReducer";
import { setBoardRotate } from "redux/reducers/boardReducer";
import { getUploadListByUserID } from "redux/reducers/uploadReducer";

import { getUserList } from "redux/reducers/userReducer";
import { useBoardSocket, useCapture, useZoom, withKeyEvent } from "hooks";
import { withWrapper } from "./withWrapper";

const Scheme = (props) => {
  const {
    editable,
    dialog,
    setDialog,
    wrapperWidth,
    wrapperHeight,
    wrapperRef,
    stageRef,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    onKeyEvent,
    onDeleteLayer,
    onCloneLayer,
  } = props;
  useBoardSocket();
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const [, , , onZoomFit] = useZoom(stageRef);

  const [hoveredJSON, setHoveredJSON] = useState({});

  const activeTransformerRef = useRef(null);
  const hoveredTransformerRef = useRef(null);

  const [onUploadThumbnail, onDownloadTGA, onDownloadSpecTGA] = useCapture(
    stageRef,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    wrapperRef
  );

  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const schemeLoaded = useSelector((state) => state.schemeReducer.loaded);

  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const logoList = useSelector((state) => state.logoReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);
  const userList = useSelector((state) => state.userReducer.list);
  const sharedUsers = useSelector((state) => state.schemeReducer.sharedUsers);
  const favoriteSchemeList = useSelector(
    (state) => state.schemeReducer.favoriteList
  );

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);
  const fontLoading = useSelector((state) => state.fontReducer.loading);
  const uploadsInitialized = useSelector(
    (state) => state.uploadReducer.initialized
  );

  const setHoveredJSONItem = useCallback(
    (key, value) => {
      if (value === true) setHoveredJSON({ [key]: value });
      else setHoveredJSON((origin) => ({ ...origin, [key]: value }));
    },
    [setHoveredJSON]
  );

  const handleChangeBoardRotation = useCallback((newRotation) => {
    dispatch(setBoardRotate(newRotation));
  }, []);

  const handleGoBack = useCallback(async () => {
    await onUploadThumbnail(false);

    history.push("/");
  }, [history, onUploadThumbnail]);

  useEffect(() => {
    if (user && user.id && params.id) {
      if (!currentScheme) {
        dispatch(
          getScheme(
            params.id,
            (scheme, tempsharedUsers) => {
              if (
                user.id !== scheme.user_id &&
                !tempsharedUsers.find((shared) => shared.user_id === user.id)
              ) {
                dispatch(
                  setMessage({
                    message: "You don't have permission for this project!",
                  })
                );
                history.push("/");
              } else {
                if (!uploadsInitialized) {
                  dispatch(getUploadListByUserID(user.id));
                }
                if (!overlayList.length) dispatch(getOverlayList());
                if (!logoList.length) dispatch(getLogoList());
                if (!fontList.length) dispatch(getFontList());
                if (!userList.length) dispatch(getUserList());
                if (!sharedUsers.length) dispatch(getSharedUsers(params.id));
                if (!favoriteSchemeList.length)
                  dispatch(getFavoriteList(user.id));
              }
            },
            () => {
              history.push("/");
            }
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (
      !schemeLoaded &&
      Object.keys(loadedStatuses).length &&
      Object.keys(loadedStatuses).every((k) => loadedStatuses[k]) &&
      stageRef.current
    ) {
      dispatch(setLoaded(true));
      onZoomFit();
      setTimeout(onUploadThumbnail, 5000);
    }
  }, [loadedStatuses, schemeLoaded]);

  useEffect(() => {
    if (editable) {
      const thumbnailInterval = setInterval(onUploadThumbnail, 300000);
      return () => {
        clearInterval(thumbnailInterval);
      };
    }
  }, [editable]);

  return (
    <>
      <Helmet title={currentScheme ? currentScheme.name : null} />
      {schemeLoading || carMakeLoading || fontLoading || !currentScheme ? (
        <ScreenLoader />
      ) : (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
          <KeyboardEventHandler handleKeys={["all"]} onKeyEvent={onKeyEvent} />
          <KeyboardEventHandler
            handleKeys={["all"]}
            handleEventType="keyup"
            onKeyEvent={onKeyEvent}
          />
          <Box
            width="100%"
            height="calc(100% - 50px)"
            display="flex"
            justifyContent="space-between"
          >
            <SideBar
              dialog={dialog}
              setDialog={setDialog}
              editable={editable}
              hoveredLayerJSON={hoveredJSON}
              stageRef={stageRef}
              onBack={handleGoBack}
              onChangeHoverJSONItem={setHoveredJSONItem}
            />
            <Box
              bgcolor="#282828"
              overflow="hidden"
              flexGrow="1"
              position="relative"
            >
              <Board
                wrapperWidth={wrapperWidth}
                wrapperHeight={wrapperHeight}
                wrapperRef={wrapperRef}
                hoveredLayerJSON={hoveredJSON}
                editable={editable}
                onChangeHoverJSONItem={setHoveredJSONItem}
                onChangeBoardRotation={handleChangeBoardRotation}
                stageRef={stageRef}
                baseLayerRef={baseLayerRef}
                mainLayerRef={mainLayerRef}
                carMaskLayerRef={carMaskLayerRef}
                activeTransformerRef={activeTransformerRef}
                hoveredTransformerRef={hoveredTransformerRef}
              />
              <BoardGuide />
            </Box>
            <PropertyBar
              stageRef={stageRef}
              editable={editable}
              onCloneLayer={onCloneLayer}
              onDeleteLayer={onDeleteLayer}
            />
          </Box>
          <Toolbar
            editable={editable}
            stageRef={stageRef}
            onDownloadTGA={onDownloadTGA}
            onDownloadSpecTGA={onDownloadSpecTGA}
          />
        </Box>
      )}
    </>
  );
};

const SchemeWithWrapper = withWrapper(withKeyEvent(Scheme));

export { SchemeWithWrapper as Scheme };
