import React, { useRef, useCallback, useEffect, useState } from "react";

import _ from "lodash";

import { useSelector, useDispatch } from "react-redux";

import {
  MouseModes,
  PaintingGuides,
  DialogTypes,
  LayerTypes,
  DrawingStatus,
} from "constant";

import {
  setCurrent as setCurrentLayer,
  updateLayer,
  updateLayerOnly,
  setClipboard as setLayerClipboard,
  setDrawingStatus,
  deleteLayer,
  cloneLayer,
} from "redux/reducers/layerReducer";
import {
  setZoom,
  setMouseMode,
  setPressedKey,
  setPressedEventKey,
  historyActionUp,
  historyActionBack,
  setPaintingGuides,
} from "redux/reducers/boardReducer";
import { useZoom } from "hooks";
import { getZoomedCenterPosition, focusBoard, isInSameSideBar } from "helper";

import LayerDeleteDialog from "components/dialogs/LayerDeleteDialog";
import SchemeService from "services/schemeService";
import { deleteUpload } from "redux/reducers/uploadReducer";
import { setAskingSimPreviewByLatest } from "redux/reducers/downloaderReducer";

export const withKeyEvent = (Component) =>
  React.memo((props) => {
    const dispatch = useDispatch();
    const { editable, stageRef } = props;
    const [, onZoomIn, onZoomOut, onZoomFit] = useZoom(stageRef);
    const [deleteLayerState, setDeleteLayerState] = useState({});
    const [dialog, setDialog] = useState(null);

    const tick = useRef(0);
    const prevTick = useRef(0);

    const currentLayer = useSelector((state) => state.layerReducer.current);
    const clipboardLayer = useSelector((state) => state.layerReducer.clipboard);
    const layerList = useSelector((state) => state.layerReducer.list);

    const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
    const pressedEventKey = useSelector(
      (state) => state.boardReducer.pressedEventKey
    );
    const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
    const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
    const zoom = useSelector((state) => state.boardReducer.zoom);
    const frameSize = useSelector((state) => state.boardReducer.frameSize);
    const paintingGuides = useSelector(
      (state) => state.boardReducer.paintingGuides
    );

    const unsetDeleteLayerState = useCallback(() => {
      dispatch(setPressedKey(null));
      dispatch(setPressedEventKey(null));
      setDeleteLayerState({});
    }, [dispatch]);

    const togglePaintingGuides = useCallback(
      (guide) => {
        let newPaintingGuides = [...paintingGuides];
        let index = newPaintingGuides.indexOf(guide);
        if (index > -1) {
          newPaintingGuides.splice(index, 1);
        } else {
          newPaintingGuides.push(guide);
        }
        dispatch(setPaintingGuides(newPaintingGuides));
      },
      [dispatch, paintingGuides]
    );

    const handleCloneLayer = useCallback(
      (layer, samePosition = false, pushingToHistory = true) => {
        dispatch(
          cloneLayer(
            layer,
            samePosition,
            pushingToHistory,
            getZoomedCenterPosition(stageRef, frameSize, zoom, boardRotate)
          )
        );
        focusBoard();
      },
      [dispatch, stageRef, frameSize, zoom, boardRotate]
    );
    const handleDeleteLayer = useCallback(
      async (layer) => {
        let nothingLeft = false;
        if (layer.layer_type === LayerTypes.UPLOAD) {
          let schemes = await SchemeService.getSchemeListByUploadID(
            layer.layer_data.id
          );
          if (schemes.length <= 1) {
            nothingLeft = true;
          }
        }
        dispatch(setPressedKey(null));
        dispatch(setPressedEventKey(null));
        setDeleteLayerState({
          show: true,
          nothingLeft,
          message: `Are you sure you want to delete "${layer.layer_data.name}"?`,
        });
      },
      [dispatch]
    );

    const handleConfirm = useCallback(
      (gonnaDeleteAll) => {
        if (currentLayer) {
          dispatch(setPressedKey(null));
          dispatch(setPressedEventKey(null));
          dispatch(deleteLayer(currentLayer));
          if (gonnaDeleteAll) {
            // This is Uploads Layer, and gonna Delete it from uploads
            dispatch(deleteUpload({ id: currentLayer.layer_data.id }, false));
          }
          setDeleteLayerState({});
        }
      },
      [dispatch, currentLayer, setDeleteLayerState]
    );

    const handleChangeSelectedLayerOrder = useCallback(
      (isUpper = true) => {
        if (currentLayer && currentLayer.layer_type !== LayerTypes.CAR) {
          let exchangableLayers = _.orderBy(
            layerList.filter(
              (layer) =>
                (isUpper
                  ? layer.layer_order < currentLayer.layer_order
                  : layer.layer_order > currentLayer.layer_order) &&
                isInSameSideBar(currentLayer.layer_type, layer.layer_type)
            ),
            ["layer_order"],
            isUpper ? ["desc"] : ["asc"]
          );
          if (exchangableLayers.length) {
            let layerToExchange = exchangableLayers[0];
            dispatch(
              updateLayer({
                id: layerToExchange.id,
                layer_order: parseInt(currentLayer.layer_order),
              })
            );
            dispatch(
              updateLayer({
                id: currentLayer.id,
                layer_order: parseInt(layerToExchange.layer_order),
              })
            );
          }
        }
      },
      [currentLayer, dispatch, layerList]
    );

    const handleKeyEvent = useCallback(
      (key, event) => {
        event.preventDefault();
        // Delete Selected Layer
        console.log("KeyEvent: ", key, event);
        if (event.target.tagName !== "INPUT" && event.type === "keydown") {
          if (pressedKey === key && pressedEventKey === event.key) {
            return;
          }
          if (pressedKey !== key) {
            dispatch(setPressedKey(key));
          }
          if (pressedEventKey !== event.key) {
            dispatch(setPressedEventKey(event.key));
          }
          if (
            (key === "del" || key === "backspace") &&
            currentLayer &&
            currentLayer.layer_type !== LayerTypes.CAR &&
            editable
          ) {
            handleDeleteLayer(currentLayer);
          } else if (key === "esc") {
            if (currentLayer) {
              dispatch(setCurrentLayer(null));
            } else if (mouseMode !== MouseModes.DEFAULT) {
              dispatch(setMouseMode(MouseModes.DEFAULT));
              dispatch(setDrawingStatus(DrawingStatus.CLEAR_COMMAND));
            }
          } else if (event.key === "+" && event.shiftKey) {
            onZoomIn();
          } else if (event.key === "_" && event.shiftKey) {
            onZoomOut();
          } else if (event.key === ")" && event.shiftKey) {
            dispatch(setZoom(1));
          } else if (event.key === "(" && event.shiftKey) {
            onZoomFit();
          } else if (event.key === "{" && event.shiftKey && editable) {
            handleChangeSelectedLayerOrder(false);
          } else if (event.key === "}" && event.shiftKey && editable) {
            handleChangeSelectedLayerOrder(true);
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
          } else if (key === "t" && editable) {
            setDialog(DialogTypes.TEXT);
          } else if (key === "p" && editable) {
            dispatch(setAskingSimPreviewByLatest(true));
          } else if (key === "s" && editable) {
            setDialog(DialogTypes.SHAPE);
          } else if (key === "l" && editable) {
            setDialog(DialogTypes.LOGO);
          } else if (key === "b" && editable) {
            setDialog(DialogTypes.BASEPAINT);
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
          } else if (
            event.key === "j" &&
            (event.ctrlKey || event.metaKey) &&
            editable
          ) {
            if (currentLayer) {
              handleCloneLayer(currentLayer);
            }
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
            dispatch(setPressedEventKey(null));
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
                  id: currentLayer.id,
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
        editable,
        pressedKey,
        pressedEventKey,
        currentLayer,
        clipboardLayer,
        dispatch,
        handleDeleteLayer,
        mouseMode,
        onZoomIn,
        onZoomOut,
        onZoomFit,
        handleChangeSelectedLayerOrder,
        handleCloneLayer,
        togglePaintingGuides,
        boardRotate,
      ]
    );

    useEffect(() => {
      if (editable) {
        const interval = setInterval(() => {
          tick.current += 1;
        }, 200);

        return () => {
          clearInterval(interval);
        };
      }
    }, [editable]);

    return (
      <>
        <Component
          {...props}
          dialog={dialog}
          setDialog={setDialog}
          onKeyEvent={handleKeyEvent}
          onDeleteLayer={handleDeleteLayer}
          onCloneLayer={handleCloneLayer}
          onTogglePaintingGuides={togglePaintingGuides}
        />
        <LayerDeleteDialog
          text={deleteLayerState && deleteLayerState.message}
          open={deleteLayerState && deleteLayerState.show}
          nothingLeft={deleteLayerState && deleteLayerState.nothingLeft}
          onCancel={unsetDeleteLayerState}
          onConfirm={handleConfirm}
        />
      </>
    );
  });
