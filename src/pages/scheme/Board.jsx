import React, { useRef } from "react";
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
import TransformerComponent from "components/TransformerComponent";

import { setFrameSizeToMax, setZoom } from "redux/reducers/boardReducer";
import { insertToLoadedList as insertToLoadedFontList } from "redux/reducers/fontReducer";
import {
  setCurrent as setCurrentLayer,
  updateLayer,
} from "redux/reducers/layerReducer";

const Board = () => {
  const stageRef = useRef(null);
  const dispatch = useDispatch();
  const { width, height, ref } = useResizeDetector();
  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const zoom = useSelector((state) => state.boardReducer.zoom);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const layerList = useSelector((state) => state.layerReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);
  const loadedFontList = useSelector((state) => state.fontReducer.loadedList);
  const currentLayer = useSelector((state) => state.layerReducer.current);

  const scaleBy = 1.2;

  const handleMouseDown = (e) => {
    // console.log("Mouse Down");
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty && currentLayer) {
      dispatch(setCurrentLayer(null));
    }
  };
  const handleMouseMove = (e) => {
    // console.log("Mouse Move");
  };
  const handleMouseUp = (e) => {
    // console.log("Mouse Up");
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
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
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
        draggable
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
            currentLayer={currentLayer}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
          />

          <LogosAndTexts
            layers={layerList}
            fonts={fontList}
            loadedFontList={loadedFontList}
            currentLayer={currentLayer}
            frameSize={frameSize}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
            onFontLoad={handleAddFont}
          />

          <PaintingGuideTop
            currentCarMake={currentCarMake}
            paintingGuides={paintingGuides}
            handleImageSize={handleImageSize}
            frameSize={frameSize}
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
