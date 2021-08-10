import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useReducerRef } from "hooks";
import { useResizeDetector } from "react-resize-detector";
import _ from "lodash";
import styled from "styled-components/macro";
import { useSelector, useDispatch } from "react-redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Helmet from "react-helmet";
import { useHistory, useParams } from "react-router";
import TGA from "utils/tga";

import { Box } from "@material-ui/core";

import { LayerTypes } from "constant";
import ScreenLoader from "components/ScreenLoader";
import Toolbar from "./Toolbar";
import Board from "./Board";
import Sidebar from "./sideBar";
import PropertyBar from "./propertyBar";
import ConfirmDialog from "dialogs/ConfirmDialog";
import { MouseModes, PaintingGuides, DialogTypes } from "constant";

import {
  getScheme,
  setSaving,
  setLoaded,
  getSharedUsers,
  updateListItem as updateSchemeListItem,
  setCurrent as setCurrentScheme,
  clearSharedUsers,
  clearCurrent as clearCurrentScheme,
  getFavoriteList,
} from "redux/reducers/schemeReducer";
import { getOverlayList } from "redux/reducers/overlayReducer";
import { getFontList } from "redux/reducers/fontReducer";
import { getLogoList } from "redux/reducers/logoReducer";
import { setMessage } from "redux/reducers/messageReducer";
import {
  deleteLayer,
  setCurrent as setCurrentLayer,
  updateLayer,
  updateLayerOnly,
  setClipboard as setLayerClipboard,
  cloneLayer,
  setDrawingStatus,
  DrawingStatus,
  updateListItem as updateLayerListItem,
  deleteListItem as deleteLayerListItem,
  insertToList as insertToLayerList,
  clearCurrent as clearCurrentLayer,
  setLoadedStatusAll,
} from "redux/reducers/layerReducer";
import {
  setPaintingGuides,
  setZoom,
  setMouseMode,
  setPressedKey,
  setBoardRotate,
  setShowProperties,
  historyActionUp,
  historyActionBack,
  clearFrameSize,
} from "redux/reducers/boardReducer";
import { getUploadListByUserID } from "redux/reducers/uploadReducer";
import {
  mathRound4,
  dataURItoBlob,
  addImageProcess,
  getZoomedCenterPosition,
} from "helper";
import SchemeService from "services/schemeService";
import { getUserList } from "redux/reducers/userReducer";
import SocketClient from "utils/socketClient";

const Wrapper = styled(Box)`
  background-color: ${(props) => props.background};
`;

const Scheme = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const [confirmMessage, setConfirmMessage] = useState("");
  const [dialog, setDialog] = useState(null);
  const [hoveredJSON, setHoveredJSON] = useState({});

  const {
    width: wrapperWidth,
    height: wrapperHeight,
    ref: wrapperRef,
  } = useResizeDetector();
  const tick = useRef(0);
  const prevTick = useRef(0);
  const stageRef = useRef(null);
  const baseLayerRef = useRef(null);
  const mainLayerRef = useRef(null);
  const carMaskLayerRef = useRef(null);
  const activeTransformerRef = useRef(null);
  const hoveredTransformerRef = useRef(null);

  const [user, userRef] = useReducerRef(
    useSelector((state) => state.authReducer.user)
  );
  const [currentScheme, currentSchemeRef] = useReducerRef(
    useSelector((state) => state.schemeReducer.current)
  );
  const [currentCarMake, currentCarMakeRef] = useReducerRef(
    useSelector((state) => state.carMakeReducer.current)
  );
  const schemeLoaded = useSelector((state) => state.schemeReducer.loaded);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const clipboardLayer = useSelector((state) => state.layerReducer.clipboard);
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
  const zoom = useSelector((state) => state.boardReducer.zoom);
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const [showProperties, showPropertiesRef] = useReducerRef(
    useSelector((state) => state.boardReducer.showProperties)
  );
  const [frameSize, frameSizeRef] = useReducerRef(
    useSelector((state) => state.boardReducer.frameSize)
  );
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );

  // const currentSchemeRef = useRef(null);
  // const frameSizeRef = useRef(null);

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);
  const fontLoading = useSelector((state) => state.fontReducer.loading);
  const uploadsInitialized = useSelector(
    (state) => state.uploadReducer.initialized
  );

  const editable = useMemo(
    () =>
      !user || !currentScheme
        ? false
        : user.id === currentScheme.user_id ||
          sharedUsers.find(
            (shared) => shared.user_id === user.id && shared.editable
          ),
    [user, currentScheme, sharedUsers]
  );

  const setHoveredJSONItem = useCallback(
    (key, value) => {
      if (value === true) setHoveredJSON({ [key]: value });
      else setHoveredJSON((origin) => ({ ...origin, [key]: value }));
    },
    [setHoveredJSON]
  );

  const handleZoom = useCallback(
    (newScale) => {
      if (currentLayer && currentLayer.layer_data) {
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const selectedNode = stage.findOne("." + currentLayer.id);

        const { x: pointerX, y: pointerY } = selectedNode.getAbsolutePosition();
        const mousePointTo = {
          x: (pointerX - stage.x()) / oldScale,
          y: (pointerY - stage.y()) / oldScale,
        };

        dispatch(setZoom(newScale));

        const newPos = {
          x: pointerX - mousePointTo.x * newScale,
          y: pointerY - mousePointTo.y * newScale,
        };

        stage.position(newPos);
        stage.batchDraw();
      } else {
        dispatch(setZoom(newScale));
      }
    },
    [dispatch, currentLayer, stageRef.current]
  );

  const handleZoomIn = useCallback(() => {
    const newScale = mathRound4(Math.max(Math.min(zoom * 1.25, 10), 0.25));
    handleZoom(newScale);
  }, [zoom, handleZoom]);

  const handleZoomOut = useCallback(() => {
    const newScale = mathRound4(Math.max(Math.min(zoom / 1.25, 10), 0.25));
    handleZoom(newScale);
  }, [zoom, handleZoom]);
  const handleZoomFit = useCallback(() => {
    let width = stageRef.current.attrs.width;
    let height = stageRef.current.attrs.height;
    const newZoom = mathRound4(
      Math.min(width / frameSize.width, height / frameSize.height)
    );
    stageRef.current.x(width / 2);
    stageRef.current.y(height / 2);
    dispatch(setZoom(newZoom));
  }, [
    dispatch,
    stageRef.current && stageRef.current.attrs && stageRef.current.attrs.width,
    stageRef.current && stageRef.current.attrs && stageRef.current.attrs.height,
    frameSize,
  ]);
  const handleChangePaintingGuides = useCallback((newFormats) => {
    dispatch(setPaintingGuides(newFormats));
  }, []);
  const handleChangeBoardRotation = useCallback((newRotation) => {
    dispatch(setBoardRotate(newRotation));
  }, []);
  const togglePaintingGuides = useCallback(
    (guide) => {
      let newPaintingGuides = [...paintingGuides];
      let index = newPaintingGuides.indexOf(guide);
      if (index > -1) {
        newPaintingGuides.splice(index, 1);
      } else {
        newPaintingGuides.push(guide);
      }
      handleChangePaintingGuides(newPaintingGuides);
    },
    [paintingGuides, handleChangePaintingGuides]
  );
  const focusBoard = useCallback(() => {
    setTimeout(() => document.activeElement.blur(), 1000);
  }, []);

  const handleCloneLayer = useCallback(
    (layer, samePosition = false, pushingToHistory = true) => {
      dispatch(
        cloneLayer(
          layer,
          samePosition,
          pushingToHistory,
          getZoomedCenterPosition(stageRef, frameSize, zoom)
        )
      );
      focusBoard();
    },
    [dispatch, getZoomedCenterPosition, focusBoard, stageRef, frameSize, zoom]
  );
  const handleDeleteLayer = useCallback(
    (layer) => {
      setConfirmMessage(`Are you sure to delete "${layer.layer_data.name}"?`);
    },
    [setConfirmMessage]
  );

  const handleKeyEvent = useCallback(
    (key, event) => {
      // Delete Selected Layer
      // console.log("KeyEvent: ", key, event);
      if (event.target.tagName !== "INPUT" && event.type === "keydown") {
        if (pressedKey !== key) {
          dispatch(setPressedKey(key));
        }
        if (
          (key === "del" || key === "backspace") &&
          currentLayer &&
          currentLayer.layer_type !== LayerTypes.CAR &&
          editable
        ) {
          handleDeleteLayer(currentLayer);
        } else if (key === "esc" && currentLayer) {
          dispatch(setCurrentLayer(null));
        } else if (event.key === "+" && event.shiftKey) {
          handleZoomIn();
        } else if (event.key === "_" && event.shiftKey) {
          handleZoomOut();
        } else if (event.key === ")" && event.shiftKey) {
          dispatch(setZoom(1));
        } else if (event.key === "(" && event.shiftKey) {
          handleZoomFit();
        } else if (event.key === "D" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.DEFAULT));
        } else if (event.key === "B" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.PEN));
        } else if (event.key === "R" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.RECT));
        } else if (event.key === "C" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.CIRCLE));
        } else if (event.key === "E" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.ELLIPSE));
        } else if (event.key === "S" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.STAR));
        } else if (event.key === "G" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.RING));
        } else if (event.key === "O" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.REGULARPOLYGON));
        } else if (event.key === "W" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.WEDGE));
        } else if (event.key === "A" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.ARC));
        } else if (event.key === "P" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.POLYGON));
        } else if (event.key === "L" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.LINE));
        } else if (event.key === ">" && event.shiftKey && editable) {
          dispatch(setMouseMode(MouseModes.ARROW));
        } else if (
          event.key === "c" &&
          (event.ctrlKey || event.metaKey) &&
          currentLayer &&
          editable
        ) {
          dispatch(setLayerClipboard(currentLayer));
        } else if (
          event.key === "v" &&
          (event.ctrlKey || event.metaKey) &&
          clipboardLayer &&
          editable
        ) {
          handleCloneLayer(clipboardLayer);
        } else if (
          event.key === "z" &&
          (event.ctrlKey || event.metaKey) &&
          editable
        ) {
          dispatch(historyActionBack());
        } else if (
          event.key === "y" &&
          (event.ctrlKey || event.metaKey) &&
          editable
        ) {
          dispatch(historyActionUp());
        } else if (key === "1") {
          togglePaintingGuides(PaintingGuides.CARMASK);
        } else if (key === "2") {
          togglePaintingGuides(PaintingGuides.WIREFRAME);
        } else if (key === "3") {
          togglePaintingGuides(PaintingGuides.SPONSORBLOCKS);
        } else if (key === "4") {
          togglePaintingGuides(PaintingGuides.NUMBERBLOCKS);
        } else if (key === "5") {
          togglePaintingGuides(PaintingGuides.GRID);
        } else if (key === "t" && editable) {
          setDialog(DialogTypes.TEXT);
        } else if (key === "s" && editable) {
          setDialog(DialogTypes.SHAPE);
        } else if (key === "l" && editable) {
          setDialog(DialogTypes.LOGO);
        } else if (key === "b" && editable) {
          setDialog(DialogTypes.BASEPAINT);
        } else if (key === "enter" && editable) {
          if (
            [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
              mouseMode
            )
          ) {
            dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
          } else if (currentLayer) {
            dispatch(setCurrentLayer(null));
          }
        }
      }

      // Arrow Keys
      if (event.target.tagName !== "INPUT" && editable) {
        if (event.type === "keyup") {
          dispatch(setPressedKey(null));
        }
        if (
          ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(
            event.key
          ) &&
          currentLayer &&
          ![LayerTypes.CAR, LayerTypes.BASE].includes(currentLayer.layer_type)
        ) {
          let speed = event.shiftKey ? 10 : 1;
          let initialspeedX =
            event.key === "ArrowLeft"
              ? -speed
              : event.key === "ArrowRight"
              ? speed
              : 0;
          let initialspeedY =
            event.key === "ArrowUp"
              ? -speed
              : event.key === "ArrowDown"
              ? speed
              : 0;
          let speedX = initialspeedX;
          let speedY = initialspeedY;
          if (boardRotate === 90) {
            speedX = initialspeedY;
            speedY = -initialspeedX;
          } else if (boardRotate === 180) {
            speedX = -initialspeedX;
            speedY = -initialspeedY;
          } else if (boardRotate === 270) {
            speedX = -initialspeedY;
            speedY = initialspeedX;
          }
          if (event.type === "keyup") {
            let layer_data = { ...currentLayer.layer_data };
            if (prevTick.current != tick.current) {
              layer_data.left = currentLayer.layer_data.left + speedX;
              layer_data.top = currentLayer.layer_data.top + speedY;
            }
            dispatch(
              updateLayer({
                ...currentLayer,
                layer_data: layer_data,
              })
            );
          } else {
            if (prevTick.current != tick.current) {
              prevTick.current = Object.assign(tick.current);
              dispatch(
                updateLayerOnly({
                  ...currentLayer,
                  layer_data: {
                    ...currentLayer.layer_data,
                    left: currentLayer.layer_data.left + speedX,
                    top: currentLayer.layer_data.top + speedY,
                  },
                })
              );
            }
          }
        }
      }
    },
    [
      dispatch,
      pressedKey,
      currentLayer,
      clipboardLayer,
      prevTick.current,
      tick.current,
      editable,
      handleCloneLayer,
      handleDeleteLayer,
    ]
  );
  const handleConfirm = useCallback(() => {
    dispatch(deleteLayer(currentLayer));
    setConfirmMessage("");
  }, [dispatch, currentLayer, setConfirmMessage]);

  const takeScreenshot = useCallback(
    async (isPNG = true) => {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      const targetWidth =
        currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
      const pixelRatio = targetWidth / frameSizeRef.current.width;

      let width = frameSizeRef.current.width * pixelRatio;
      let height = frameSizeRef.current.height * pixelRatio;
      let baseLayerImg, mainLayerImg, carMaskLayerImg;
      let stageAttrs = { ...stageRef.current.attrs };

      wrapperRef.current.style.width = `${frameSizeRef.current.width}px`;
      wrapperRef.current.style.height = `${frameSizeRef.current.height}px`;
      const originShowProperties = showPropertiesRef.current;
      dispatch(setShowProperties(false));

      stageRef.current.setAttrs({
        x: 0,
        y: 0,
        offsetX: frameSizeRef.current.width / 2,
        offsetY: frameSizeRef.current.width / 2,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        width: frameSizeRef.current.width,
        height: frameSizeRef.current.height,
      });
      stageRef.current.draw();

      if (baseLayerRef.current) {
        let baseLayerURL = baseLayerRef.current.toDataURL({
          pixelRatio,
          x: -frameSizeRef.current.width / 2,
          y: -frameSizeRef.current.width / 2,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        baseLayerImg = await addImageProcess(baseLayerURL);
      }

      if (mainLayerRef.current) {
        let mainLayerURL = mainLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        mainLayerImg = await addImageProcess(mainLayerURL);
      }
      if (carMaskLayerRef.current) {
        let carMaskLayerURL = carMaskLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        carMaskLayerImg = await addImageProcess(carMaskLayerURL);
      }

      stageRef.current.setAttrs(_.omit(stageAttrs, ["container"]));
      stageRef.current.draw();
      wrapperRef.current.style.width = `100%`;
      wrapperRef.current.style.height = `100%`;
      dispatch(setShowProperties(originShowProperties));
      canvas.width = width;
      canvas.height = height;

      if (baseLayerImg) {
        ctx.drawImage(baseLayerImg, 0, 0, width, height);
      }
      if (mainLayerImg) {
        ctx.drawImage(mainLayerImg, 0, 0, width, height);
      }
      if (carMaskLayerImg && isPNG) {
        ctx.drawImage(carMaskLayerImg, 0, 0, width, height);
      }
      return {
        canvas,
        ctx,
        carMaskLayerImg,
      };
    },
    [
      dispatch,
      showPropertiesRef.current,
      frameSizeRef.current,
      currentCarMakeRef.current,
      stageRef.current,
      baseLayerRef.current,
      mainLayerRef.current,
      carMaskLayerRef.current,
    ]
  );

  const uploadThumbnail = useCallback(
    async (dataURL) => {
      try {
        let blob = dataURItoBlob(dataURL);
        var fileOfBlob = new File(
          [blob],
          `${currentSchemeRef.current.id}.png`,
          {
            type: "image/png",
          }
        );

        let formData = new FormData();
        formData.append("files", fileOfBlob);
        formData.append("schemeID", currentSchemeRef.current.id);
        dispatch(setCurrentScheme({ thumbnail_updated: 1 }));
        await SchemeService.uploadThumbnail(formData);
      } catch (err) {
        dispatch(setMessage({ message: err.message }));
      }
    },
    [dispatch, currentSchemeRef.current]
  );

  const handleUploadThumbnail = useCallback(
    async (uploadLater = true) => {
      if (
        stageRef.current &&
        currentSchemeRef.current &&
        !currentSchemeRef.current.thumbnail_updated
      ) {
        try {
          console.log("Uploading Thumbnail");
          dispatch(setSaving(true));
          const { canvas } = await takeScreenshot();
          let dataURL = canvas.toDataURL("image/png");
          if (uploadLater) dispatch(setSaving(false));
          await uploadThumbnail(dataURL);
          if (!uploadLater) dispatch(setSaving(false));
          console.log("Uploaded Thumbnail");
        } catch (err) {
          dispatch(setMessage({ message: err.message }));
        }
      }
    },
    [
      dispatch,
      currentSchemeRef.current,
      !stageRef.current,
      takeScreenshot,
      uploadThumbnail,
    ]
  );

  const handleDownloadTGA = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current) {
      try {
        dispatch(setSaving(true));
        const width =
          currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
        const height =
          currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
        const { canvas, ctx, carMaskLayerImg } = await takeScreenshot(false);
        let imageData = ctx.getImageData(0, 0, width, height);

        dispatch(setSaving(false));

        var tga = new TGA({
          width: width,
          height: height,
          imageType: TGA.Type.RGB,
        });
        tga.setImageData(imageData);

        // get a blob url which can be used to download the file
        var url = tga.getBlobURL();

        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = `car_${userRef.current.id}.tga`;
        a.click();
        window.URL.revokeObjectURL(url);
        ctx.drawImage(carMaskLayerImg, 0, 0, width, height);
        let dataURL = canvas.toDataURL("image/png");
        if (!currentSchemeRef.current.thumbnail_updated)
          await uploadThumbnail(dataURL);
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: err.message }));
      }
    }
  }, [
    dispatch,
    currentSchemeRef.current,
    userRef.current,
    currentCarMakeRef.current,
    frameSizeRef.current,
    !stageRef.current,
    takeScreenshot,
    uploadThumbnail,
  ]);

  const handleGoBack = useCallback(async () => {
    await handleUploadThumbnail(false);
    dispatch(clearFrameSize());
    dispatch(clearSharedUsers());
    dispatch(clearCurrentScheme());
    dispatch(clearCurrentLayer());
    dispatch(setLoadedStatusAll({}));
    dispatch(setLoaded(false));
    history.push("/");
  }, [history, dispatch, handleUploadThumbnail]);

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
    if (editable) {
      const interval = setInterval(() => {
        tick.current += 1;
      }, 200);
      const thumbnailInterval = setInterval(handleUploadThumbnail, 300000);

      return () => {
        clearInterval(interval);
        clearInterval(thumbnailInterval);
      };
    }
  }, [editable]);

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
      dispatch(updateLayerListItem(response.data));
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

  useEffect(() => {
    if (
      !schemeLoaded &&
      Object.keys(loadedStatuses).length &&
      Object.keys(loadedStatuses).every((k) => loadedStatuses[k]) &&
      stageRef.current
    ) {
      dispatch(setLoaded(true));
      handleZoomFit();
      setTimeout(handleUploadThumbnail, 5000);
    }
  }, [loadedStatuses, schemeLoaded]);

  // useEffect(() => {
  //   currentSchemeRef.current = currentScheme;
  // }, [currentScheme]);

  // useEffect(() => {
  //   frameSizeRef.current = frameSize;
  // }, [frameSize]);

  return (
    <>
      <Helmet title={currentScheme ? currentScheme.name : null} />
      {schemeLoading || carMakeLoading || fontLoading || !currentScheme ? (
        <ScreenLoader />
      ) : (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
          <KeyboardEventHandler
            handleKeys={["all"]}
            onKeyEvent={handleKeyEvent}
          />
          <KeyboardEventHandler
            handleKeys={["all"]}
            handleEventType="keyup"
            onKeyEvent={handleKeyEvent}
          />
          <Box
            width="100%"
            height="calc(100% - 50px)"
            display="flex"
            justifyContent="space-between"
          >
            <Sidebar
              dialog={dialog}
              setDialog={setDialog}
              focusBoard={focusBoard}
              editable={editable}
              hoveredLayerJSON={hoveredJSON}
              stageRef={stageRef}
              onBack={handleGoBack}
              onChangeHoverJSONItem={setHoveredJSONItem}
            />
            <Wrapper background="#282828" overflow="hidden" flexGrow="1">
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
            </Wrapper>
            {showProperties ? (
              <PropertyBar
                stageRef={stageRef}
                editable={editable}
                onClone={handleCloneLayer}
                onDelete={handleDeleteLayer}
              />
            ) : (
              <></>
            )}
          </Box>
          <Toolbar
            editable={editable}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomFit={handleZoomFit}
            onChangePaintingGuides={handleChangePaintingGuides}
            onDownloadTGA={handleDownloadTGA}
          />
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
