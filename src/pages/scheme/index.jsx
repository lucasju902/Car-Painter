import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components/macro";
import { useSelector, useDispatch } from "react-redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Helmet from "react-helmet";
import { useParams } from "react-router";

import { Box } from "@material-ui/core";

import { LayerTypes } from "constant";
import ScreenLoader from "components/ScreenLoader";
import Toolbar from "./Toolbar";
import Board from "./Board";
import Sidebar from "./sideBar";
import PropertyBar from "./propertyBar";
import ConfirmDialog from "dialogs/ConfirmDialog";
import { MouseModes, PaintingGuides, DialogTypes } from "constant";

import { getScheme } from "redux/reducers/schemeReducer";
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
import { mathRound4, dataURItoBlob } from "helper";
import SchemeService from "services/schemeService";

const Wrapper = styled(Box)`
  background-color: ${(props) => props.background};
`;

const Scheme = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [confirmMessage, setConfirmMessage] = useState("");
  const [dialog, setDialog] = useState(null);

  const tick = useRef(0);
  const prevTick = useRef(0);
  const stageRef = useRef(null);

  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const clipboardLayer = useSelector((state) => state.layerReducer.clipboard);
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

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);
  const fontLoading = useSelector((state) => state.fontReducer.loading);
  const uploadsInitialized = useSelector(
    (state) => state.uploadReducer.initialized
  );

  const handleZoomIn = () => {
    dispatch(setZoom(mathRound4(Math.max(Math.min(zoom * 1.25, 10), 0.25))));
  };
  const handleZoomOut = () => {
    dispatch(setZoom(mathRound4(Math.max(Math.min(zoom / 1.25, 10), 0.25))));
  };
  const handleZoomFit = () => {
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
  };
  const handleChangePaintingGuides = (newFormats) => {
    dispatch(setPaintingGuides(newFormats));
  };
  const handleChangeBoardRotation = (newRotation) => {
    dispatch(setBoardRotate(newRotation));
  };
  const togglePaintingGuides = (guide) => {
    let newPaintingGuides = [...paintingGuides];
    let index = newPaintingGuides.indexOf(guide);
    if (index > -1) {
      newPaintingGuides.splice(index, 1);
    } else {
      newPaintingGuides.push(guide);
    }
    handleChangePaintingGuides(newPaintingGuides);
  };
  const focusBoard = () => {
    setTimeout(() => document.activeElement.blur(), 1000);
  };

  const handleKeyEvent = (key, event) => {
    // Delete Selected Layer
    console.log("KeyEvent: ", key, event);
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
  };
  const handleConfirm = () => {
    dispatch(deleteLayer(currentLayer));
    setConfirmMessage("");
  };

  const handleScreenShot = async () => {
    if (stageRef.current && currentScheme) {
      try {
        let dataURL = stageRef.current.toDataURL({ pixelRatio: 0.5 });
        let blob = dataURItoBlob(dataURL);
        var fileOfBlob = new File([blob], `${currentScheme.id}.png`, {
          type: "image/png",
        });

        let formData = new FormData();
        formData.append("files", fileOfBlob);
        formData.append("schemeID", currentScheme.id);

        await SchemeService.uploadThumbnail(formData);
      } catch (err) {
        dispatch(setMessage({ message: err.message }));
      }
    }
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

  useEffect(() => {
    const interval = setInterval(() => {
      tick.current += 1;
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.addEventListener("unload", handleScreenShot);
    return () => {
      window.removeEventListener("unload", handleScreenShot);
    };
  }, []);

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
            />
            <Wrapper
              width="calc(100% - 350px)"
              background="#282828"
              overflow="hidden"
            >
              <Board
                onChangeBoardRotation={handleChangeBoardRotation}
                stageRef={stageRef}
              />
            </Wrapper>
            <PropertyBar />
          </Box>
          <Toolbar
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomFit={handleZoomFit}
            onChangePaintingGuides={handleChangePaintingGuides}
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
