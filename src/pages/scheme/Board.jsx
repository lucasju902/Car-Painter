import React, { useRef, useState, useEffect } from "react";
import useInterval from "react-useinterval";
import { Stage, Layer, Rect } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { useResizeDetector } from "react-resize-detector";

import { Box } from "@material-ui/core";

import PaintingGuideTop from "./guides/PaintingGuideTop";
import PaintingGuideBottom from "./guides/PaintingGuideBottom";
import CarParts from "./layers/CarParts";
import BasePaints from "./layers/BasePaints";
import Overlays from "./layers/Overlays";
import LogosAndTexts from "./layers/LogosAndTexts";
import Shapes from "./layers/Shapes";
import TransformerComponent from "components/TransformerComponent";

import {
  setFrameSizeToMax,
  setMouseMode,
  setZoom,
} from "redux/reducers/boardReducer";
import { insertToLoadedList as insertToLoadedFontList } from "redux/reducers/fontReducer";
import {
  setCurrent as setCurrentLayer,
  updateLayer,
  createShape,
  setDrawingStatus,
  DrawingStatus,
} from "redux/reducers/layerReducer";
import { MouseModes, LayerTypes, DefaultLayer } from "constant";
import {
  getRelativePointerPosition,
  removeDuplicatedPointFromEnd,
} from "helper";

const Board = () => {
  const scaleBy = 1.2;
  const stageRef = useRef(null);
  const [prevPosition, setPrevPosition] = useState({});
  const drawingLayerRef = useRef(null);
  const prevTick = useRef(0);
  const currentTick = useRef(0);
  const [tick, setTick] = useState(0);

  const dispatch = useDispatch();
  const { width, height, ref } = useResizeDetector();

  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const zoom = useSelector((state) => state.boardReducer.zoom);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const fontList = useSelector((state) => state.fontReducer.list);
  const loadedFontList = useSelector((state) => state.fontReducer.loadedList);
  const layerList = useSelector((state) => state.layerReducer.list);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const drawingStatus = useSelector(
    (state) => state.layerReducer.drawingStatus
  );

  useEffect(() => {
    switch (drawingStatus) {
      case DrawingStatus.ADD_TO_SHAPE:
        if (drawingLayerRef.current) {
          let layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerRef.current.layer_data,
              points: removeDuplicatedPointFromEnd(
                drawingLayerRef.current.layer_data.points
              ),
            },
          };
          dispatch(createShape(currentScheme.id, layer));
          dispatch(setMouseMode(MouseModes.DEFAULT));
        }
        break;
      case DrawingStatus.CLEAR_COMMAND:
        // setDrawingLayer(null);
        drawingLayerRef.current = null;
        dispatch(setDrawingStatus(null));
        break;
      default:
        break;
    }
  }, [drawingStatus]);

  useInterval(() => {
    if (mouseMode !== MouseModes.DEFAULT) {
      setTick(tick + 1);
    }
  }, 50 * (Math.min(currentTick.current - prevTick.current > 4 ? currentTick.current - prevTick.current : (currentTick.current - prevTick.current) / 2, 20) || 1));

  useInterval(() => {
    if (mouseMode !== MouseModes.DEFAULT) {
      currentTick.current = currentTick.current + 1;
    }
  }, 5);

  const handleMouseDown = (e) => {
    // console.log("Mouse Down");
    if (mouseMode === MouseModes.DEFAULT) {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty && currentLayer) {
        dispatch(setCurrentLayer(null));
      }
    }
  };
  const handleContentMouseDown = (e) => {
    if (mouseMode !== MouseModes.DEFAULT) {
      const position = getRelativePointerPosition(stageRef.current);
      if (!drawingLayerRef.current) {
        let newLayer = {
          ...DefaultLayer,
          layer_type: LayerTypes.SHAPE,
          layer_data: {
            ...DefaultLayer.layer_data,
            type: mouseMode,
            name: mouseMode,
            left: position.x,
            top: position.y,
            color: "#000000",
            scolor: "#000000",
            stroke: 1,
          },
        };

        if (
          [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
            mouseMode
          )
        ) {
          newLayer.layer_data.stroke = 5;
          newLayer.layer_data.points = [0, 0, 0, 0];
        }
        if (mouseMode === MouseModes.PEN) {
          newLayer.layer_data.stroke = 5;
          newLayer.layer_data.points = [0, 0];
        }
        drawingLayerRef.current = newLayer;
      } else {
        if (
          [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
            mouseMode
          )
        ) {
          let layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerRef.current.layer_data,
              points: removeDuplicatedPointFromEnd(
                drawingLayerRef.current.layer_data.points
              ),
            },
          };
          layer.layer_data.points = layer.layer_data.points.concat([
            position.x - drawingLayerRef.current.layer_data.left,
            position.y - drawingLayerRef.current.layer_data.top,
            position.x - drawingLayerRef.current.layer_data.left,
            position.y - drawingLayerRef.current.layer_data.top,
          ]);

          drawingLayerRef.current = layer;
        }
      }
    }
  };
  const handleMouseMove = () => {
    // console.log("Mouse Move");

    if (mouseMode !== MouseModes.DEFAULT && drawingLayerRef.current) {
      const position = getRelativePointerPosition(stageRef.current);
      const width = position.x - drawingLayerRef.current.layer_data.left;
      const height = position.y - drawingLayerRef.current.layer_data.top;
      const positionX = position.x - drawingLayerRef.current.layer_data.left;
      const positionY = position.y - drawingLayerRef.current.layer_data.top;
      if (
        drawingLayerRef.current.layer_data.points.length < 2 ||
        positionX !==
          drawingLayerRef.current.layer_data.points[
            drawingLayerRef.current.layer_data.points.length - 2
          ] ||
        positionY !==
          drawingLayerRef.current.layer_data.points[
            drawingLayerRef.current.layer_data.points.length - 1
          ]
      ) {
        if (
          currentTick.current - prevTick.current > 1 ||
          drawingLayerRef.current.layer_data.points.length < 2 ||
          Math.abs(
            positionX -
              drawingLayerRef.current.layer_data.points[
                drawingLayerRef.current.layer_data.points.length - 2
              ]
          ) > 10 ||
          Math.abs(
            positionY -
              drawingLayerRef.current.layer_data.points[
                drawingLayerRef.current.layer_data.points.length - 1
              ]
          ) > 10
        ) {
          let layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerRef.current.layer_data,
              points: [...drawingLayerRef.current.layer_data.points],
              width: width,
              height: height,
              radius: Math.abs(width),
              innerRadius: Math.abs(width) / 2.5,
              outerRadius: Math.abs(width),
            },
          };
          if (
            [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
              mouseMode
            )
          ) {
            layer.layer_data.points.splice(-2, 2, positionX, positionY);
          }
          if (mouseMode === MouseModes.PEN) {
            layer.layer_data.points.push(positionX);
            layer.layer_data.points.push(positionY);
          }
          drawingLayerRef.current = layer;
        }
      }
      prevTick.current = currentTick.current;
    }
  };
  const handleMouseUp = (e) => {
    // console.log("Mouse Up");
    if (
      ![
        MouseModes.DEFAULT,
        MouseModes.LINE,
        MouseModes.ARROW,
        MouseModes.POLYGON,
      ].includes(mouseMode)
    ) {
      dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
    }
    const position = getRelativePointerPosition(stageRef.current);
    setPrevPosition(position);
  };
  const handleContentDoubleClick = (e) => {
    const position = getRelativePointerPosition(stageRef.current);
    if (
      [
        MouseModes.DEFAULT,
        MouseModes.LINE,
        MouseModes.ARROW,
        MouseModes.POLYGON,
      ].includes(mouseMode) &&
      drawingLayerRef.current &&
      prevPosition.x === position.x &&
      prevPosition.y === position.y
    ) {
      dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
    }
  };
  const handleZoomStage = (event) => {
    event.evt.preventDefault();
    if (stageRef.current !== null && event.evt.ctrlKey) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = Math.max(
        Math.min(
          event.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy,
          10
        ),
        0.25
      );
      dispatch(setZoom(newScale));
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  };
  const handleImageSize = (size) => {
    if (frameSize.width < size.width || frameSize.height < size.height) {
      dispatch(
        setFrameSizeToMax({
          width: Math.max(frameSize.width, size.width),
          height: Math.max(frameSize.height, size.height),
        })
      );
    }
  };
  const handleLayerDataChange = (layer, values) => {
    dispatch(
      updateLayer({
        ...layer,
        layer_data: {
          ...layer.layer_data,
          ...values,
        },
      })
    );
  };
  const handleLayerSelect = (layer) => {
    dispatch(setCurrentLayer(layer));
  };
  const handleAddFont = (fontFamily) => {
    dispatch(insertToLoadedFontList(fontFamily));
  };

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      margin="auto"
      ref={ref}
    >
      <Stage
        width={width}
        height={height}
        onMousedown={handleMouseDown}
        onContentMousedown={handleContentMouseDown}
        onContentMousemove={handleMouseMove}
        onContentMouseup={handleMouseUp}
        onDblClick={handleContentDoubleClick}
        onTouchStart={handleMouseDown}
        onWheel={handleZoomStage}
        scaleX={zoom || 1}
        scaleY={zoom || 1}
        rotation={boardRotate}
        x={width / 2}
        y={height / 2}
        offsetX={width / 2}
        offsetY={height / 2}
        ref={stageRef}
        draggable={mouseMode === MouseModes.DEFAULT}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={frameSize.width}
            height={frameSize.height}
            fill={
              currentScheme.base_color === "transparent"
                ? currentScheme.base_color
                : "#" + currentScheme.base_color
            }
            listening={false}
          />
          <BasePaints layers={layerList} handleImageSize={handleImageSize} />

          <PaintingGuideBottom
            currentCarMake={currentCarMake}
            paintingGuides={paintingGuides}
            handleImageSize={handleImageSize}
            guideData={currentScheme.guide_data}
          />

          <CarParts
            layers={layerList}
            currentCarMake={currentCarMake}
            handleImageSize={handleImageSize}
          />
          <Overlays
            layers={layerList}
            handleImageSize={handleImageSize}
            frameSize={frameSize}
            boardRotate={boardRotate}
            mouseMode={mouseMode}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
          />
          <Shapes
            layers={layerList}
            drawingLayer={drawingLayerRef.current}
            boardRotate={boardRotate}
            mouseMode={mouseMode}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
          />
          <LogosAndTexts
            layers={layerList}
            fonts={fontList}
            loadedFontList={loadedFontList}
            frameSize={frameSize}
            mouseMode={mouseMode}
            boardRotate={boardRotate}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
            onFontLoad={handleAddFont}
          />
          <PaintingGuideTop
            currentCarMake={currentCarMake}
            paintingGuides={paintingGuides}
            handleImageSize={handleImageSize}
            frameSize={frameSize}
            guideData={currentScheme.guide_data}
          />
          <TransformerComponent
            selectedLayer={currentLayer}
            pressedKey={pressedKey}
          />
        </Layer>
      </Stage>
    </Box>
  );
};

export default Board;
