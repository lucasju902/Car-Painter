import React, { useEffect, useState, useRef, useCallback } from "react";
import _ from "lodash";
import styled from "styled-components/macro";
import { useSelector, useDispatch } from "react-redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Helmet from "react-helmet";
import { useParams } from "react-router";
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

import { getScheme, setSaving, setLoaded } from "redux/reducers/schemeReducer";
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
} from "redux/reducers/layerReducer";
import {
  setPaintingGuides,
  setZoom,
  setMouseMode,
  setPressedKey,
  setBoardRotate,
  historyActionUp,
  historyActionBack,
} from "redux/reducers/boardReducer";
import { getUploadListByUserID } from "redux/reducers/uploadReducer";
import { mathRound4, dataURItoBlob, addImageProcess } from "helper";
import SchemeService from "services/schemeService";

const Wrapper = styled(Box)`
  background-color: ${(props) => props.background};
`;

const Scheme = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [confirmMessage, setConfirmMessage] = useState("");
  const [dialog, setDialog] = useState(null);
  const [hoveredJSON, setHoveredJSON] = useState({});
  const pixelRatio = 0.5;

  const tick = useRef(0);
  const prevTick = useRef(0);
  const stageRef = useRef(null);
  const baseLayerRef = useRef(null);
  const mainLayerRef = useRef(null);
  const carMaskLayerRef = useRef(null);

  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const schemeLoaded = useSelector((state) => state.schemeReducer.loaded);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const clipboardLayer = useSelector((state) => state.layerReducer.clipboard);
  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const logoList = useSelector((state) => state.logoReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);
  const zoom = useSelector((state) => state.boardReducer.zoom);
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );

  const currentSchemeRef = useRef(null);
  const frameSizeRef = useRef(null);

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);
  const fontLoading = useSelector((state) => state.fontReducer.loading);
  const uploadsInitialized = useSelector(
    (state) => state.uploadReducer.initialized
  );

  const setHoveredJSONItem = useCallback(
    (key, value) => {
      setHoveredJSON((origin) => ({ ...origin, [key]: value }));
    },
    [setHoveredJSON]
  );

  const handleZoomIn = useCallback(() => {
    dispatch(setZoom(mathRound4(Math.max(Math.min(zoom * 1.25, 10), 0.25))));
  }, [dispatch, zoom]);
  const handleZoomOut = useCallback(() => {
    dispatch(setZoom(mathRound4(Math.max(Math.min(zoom / 1.25, 10), 0.25))));
  }, [dispatch, zoom]);
  const handleZoomFit = useCallback(() => {
    let width = stageRef.current.attrs.width;
    let height = stageRef.current.attrs.height;
    const newZoom = mathRound4(
      Math.min(width / frameSize.width, height / frameSize.height)
    );
    stageRef.current.x((width / 2 - frameSize.width / 2) * newZoom + width / 2);
    stageRef.current.y(
      (height / 2 - frameSize.height / 2) * newZoom + height / 2
    );
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
          currentLayer.layer_type !== LayerTypes.CAR
        ) {
          setConfirmMessage(
            `Are you sure to delete "${currentLayer.layer_data.name}"?`
          );
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
        } else if (event.key === "D" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.DEFAULT));
        } else if (event.key === "B" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.PEN));
        } else if (event.key === "R" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.RECT));
        } else if (event.key === "C" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.CIRCLE));
        } else if (event.key === "E" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.ELLIPSE));
        } else if (event.key === "S" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.STAR));
        } else if (event.key === "G" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.RING));
        } else if (event.key === "O" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.REGULARPOLYGON));
        } else if (event.key === "W" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.WEDGE));
        } else if (event.key === "A" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.ARC));
        } else if (event.key === "P" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.POLYGON));
        } else if (event.key === "L" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.LINE));
        } else if (event.key === ">" && event.shiftKey) {
          dispatch(setMouseMode(MouseModes.ARROW));
        } else if (
          event.key === "c" &&
          (event.ctrlKey || event.metaKey) &&
          currentLayer
        ) {
          dispatch(setLayerClipboard(currentLayer));
        } else if (
          event.key === "v" &&
          (event.ctrlKey || event.metaKey) &&
          clipboardLayer
        ) {
          dispatch(cloneLayer(clipboardLayer));
        } else if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
          dispatch(historyActionBack());
        } else if (event.key === "y" && (event.ctrlKey || event.metaKey)) {
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
        } else if (key === "t") {
          setDialog(DialogTypes.TEXT);
        } else if (key === "s") {
          setDialog(DialogTypes.SHAPE);
        } else if (key === "l") {
          setDialog(DialogTypes.LOGO);
        } else if (key === "b") {
          setDialog(DialogTypes.BASEPAINT);
        } else if (key === "enter") {
          if (
            [
              MouseModes.DEFAULT,
              MouseModes.LINE,
              MouseModes.ARROW,
              MouseModes.POLYGON,
            ].includes(mouseMode)
          ) {
            dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
          }
        }
      }

      // Arrow Keys
      if (event.target.tagName !== "INPUT") {
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

      let width = frameSizeRef.current.width * pixelRatio;
      let height = frameSizeRef.current.height * pixelRatio;
      let baseLayerImg, mainLayerImg, carMaskLayerImg;
      let attrs = { ...stageRef.current.attrs };
      stageRef.current.setAttrs({
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        width: frameSizeRef.current.width,
        height: frameSizeRef.current.height,
      });
      stageRef.current.draw();

      if (baseLayerRef.current) {
        let baseLayerURL = baseLayerRef.current.toDataURL({ pixelRatio });
        baseLayerImg = await addImageProcess(baseLayerURL);
      }
      if (mainLayerRef.current) {
        let mainLayerURL = mainLayerRef.current.toDataURL({ pixelRatio });
        mainLayerImg = await addImageProcess(mainLayerURL);
      }
      if (carMaskLayerRef.current && isPNG) {
        let carMaskLayerURL = carMaskLayerRef.current.toDataURL({
          pixelRatio,
        });
        carMaskLayerImg = await addImageProcess(carMaskLayerURL);
      }

      stageRef.current.setAttrs(_.omit(attrs, ["container"]));
      stageRef.current.draw();
      canvas.width = width;
      canvas.height = height;

      if (baseLayerImg) {
        ctx.drawImage(
          baseLayerImg,
          0,
          0,
          baseLayerImg.width,
          baseLayerImg.height
        );
      }
      if (mainLayerImg) {
        ctx.drawImage(
          mainLayerImg,
          0,
          0,
          mainLayerImg.width,
          mainLayerImg.height
        );
      }
      if (carMaskLayerImg) {
        ctx.drawImage(
          carMaskLayerImg,
          0,
          0,
          carMaskLayerImg.width,
          carMaskLayerImg.height
        );
      }
      if (isPNG) return canvas.toDataURL("image/png");
      var imageData = ctx.getImageData(0, 0, width, height);
      return imageData;
    },
    [
      frameSizeRef.current,
      stageRef.current,
      baseLayerRef.current,
      mainLayerRef.current,
      carMaskLayerRef.current,
    ]
  );

  const handleUploadThumbnail = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current) {
      try {
        dispatch(setSaving(true));
        let dataURL = await takeScreenshot();
        dispatch(setSaving(false));
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

        await SchemeService.uploadThumbnail(formData);
      } catch (err) {
        dispatch(setMessage({ message: err.message }));
      }
    }
  }, [
    dispatch,
    currentSchemeRef.current && currentSchemeRef.current.id,
    !stageRef.current,
    takeScreenshot,
  ]);

  const handleDownloadTGA = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current) {
      try {
        dispatch(setSaving(true));
        let imageData = await takeScreenshot(false);
        dispatch(setSaving(false));
        var tga = new TGA({
          width: frameSizeRef.current.width * pixelRatio,
          height: frameSizeRef.current.height * pixelRatio,
          imageType: TGA.Type.RLE_RGB,
        });
        tga.setImageData(imageData);

        // get a blob url which can be used to download the file
        var url = tga.getBlobURL();

        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = `${currentSchemeRef.current.id}.tga`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: err.message }));
      }
    }
  }, [
    dispatch,
    currentSchemeRef.current && currentSchemeRef.current.id,
    !stageRef.current,
    takeScreenshot,
  ]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      tick.current += 1;
    }, 200);
    const startTimout = setTimeout(handleUploadThumbnail, 7000);
    const thumbnailInterval = setInterval(handleUploadThumbnail, 300000);

    return () => {
      clearInterval(interval);
      clearInterval(thumbnailInterval);
      clearTimeout(startTimout);
    };
  }, []);

  useEffect(() => {
    if (
      !schemeLoaded &&
      Object.keys(loadedStatuses).every((k) => loadedStatuses[k]) &&
      stageRef.current
    ) {
      dispatch(setLoaded(true));
      handleZoomFit();
    }
  }, [loadedStatuses]);

  useEffect(() => {
    currentSchemeRef.current = currentScheme;
  }, [currentScheme]);

  useEffect(() => {
    frameSizeRef.current = frameSize;
  }, [frameSize]);

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
          <Box width="100%" height="calc(100% - 50px)" display="flex">
            <Sidebar
              dialog={dialog}
              setDialog={setDialog}
              focusBoard={focusBoard}
              hoveredLayerJSON={hoveredJSON}
              onChangeHoverJSONItem={setHoveredJSONItem}
            />
            <Wrapper
              width="calc(100% - 350px)"
              background="#282828"
              overflow="hidden"
            >
              <Board
                hoveredLayerJSON={hoveredJSON}
                onChangeHoverJSONItem={setHoveredJSONItem}
                onChangeBoardRotation={handleChangeBoardRotation}
                stageRef={stageRef}
                baseLayerRef={baseLayerRef}
                mainLayerRef={mainLayerRef}
                carMaskLayerRef={carMaskLayerRef}
              />
            </Wrapper>
            <PropertyBar />
          </Box>
          <Toolbar
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
