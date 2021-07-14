import React, { useRef, useState, useEffect, useCallback } from "react";
import useInterval from "react-useinterval";
import { Stage, Layer, Rect } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { useResizeDetector } from "react-resize-detector";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import { Box, IconButton as MuiIconButton } from "@material-ui/core";
import {
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
} from "@material-ui/icons";

import PaintingGuideTop from "./guides/PaintingGuideTop";
import PaintingGuideCarMask from "./guides/PaintingGuideCarMask";
import PaintingGuideBottom from "./guides/PaintingGuideBottom";
import CarParts from "./layers/CarParts";
import BasePaints from "./layers/BasePaints";
import Overlays from "./layers/Overlays";
import LogosAndTexts from "./layers/LogosAndTexts";
import Shapes from "./layers/Shapes";
import TransformerComponent from "components/TransformerComponent";
import LightTooltip from "components/LightTooltip";
import ScreenLoader from "components/ScreenLoader";

import {
  setFrameSizeToMax,
  setMouseMode,
  setPaintingGuides,
  setZoom,
} from "redux/reducers/boardReducer";
import { insertToLoadedList as insertToLoadedFontList } from "redux/reducers/fontReducer";
import {
  setCurrent as setCurrentLayer,
  updateLayer,
  createShape,
  setDrawingStatus,
  DrawingStatus,
  setLoadedStatus,
} from "redux/reducers/layerReducer";
import { MouseModes, LayerTypes, DefaultLayer, PaintingGuides } from "constant";
import {
  getRelativePointerPosition,
  removeDuplicatedPointFromEnd,
} from "helper";

const IconButton = styled(MuiIconButton)(spacing);
const RotationButton = styled(IconButton)`
  background: black;
  border-radius: 0;
  &:hover {
    background: #444;
  }
`;

const Board = ({
  hoveredLayerJSON,
  onChangeHoverJSONItem,
  onChangeBoardRotation,
  stageRef,
  baseLayerRef,
  mainLayerRef,
  carMaskLayerRef,
  activeTransformerRef,
  hoveredTransformerRef,
}) => {
  const scaleBy = 1.2;
  const [prevPosition, setPrevPosition] = useState({});
  const drawingLayerRef = useRef(null);
  const prevTick = useRef(0);
  const currentTick = useRef(0);
  const [tick, setTick] = useState(0);
  const [previousGuide, setPreviousGuide] = useState([]);

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
  const schemeSaving = useSelector((state) => state.schemeReducer.saving);
  const schemeLoaded = useSelector((state) => state.schemeReducer.loaded);
  const fontList = useSelector((state) => state.fontReducer.list);
  const loadedFontList = useSelector((state) => state.fontReducer.loadedList);
  const layerList = useSelector((state) => state.layerReducer.list);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );
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

  const handleMouseDown = useCallback(
    (e) => {
      // console.log("Mouse Down");
      if (mouseMode === MouseModes.DEFAULT) {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty && currentLayer) {
          dispatch(setCurrentLayer(null));
        }
      }
    },
    [dispatch, mouseMode, currentLayer]
  );
  const handleContentMouseDown = useCallback(
    (e) => {
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
              color: currentScheme.guide_data.default_shape_color || "#000000",
              opacity: currentScheme.guide_data.default_shape_opacity || 1,
              scolor:
                currentScheme.guide_data.default_shape_scolor || "#000000",
              stroke: currentScheme.guide_data.default_shape_stroke || 0,
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
    },
    [
      mouseMode,
      currentScheme.guide_data,
      getRelativePointerPosition,
      drawingLayerRef.current,
      stageRef.current,
    ]
  );
  const handleMouseMove = useCallback(() => {
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
              width:
                MouseModes.ELLIPSE !== drawingLayerRef.current.layer_type &&
                width > 0
                  ? width
                  : 0,
              height:
                MouseModes.ELLIPSE !== drawingLayerRef.current.layer_type &&
                height > 0
                  ? height
                  : 0,
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
  }, [
    mouseMode,
    drawingLayerRef.current,
    getRelativePointerPosition,
    stageRef.current,
    currentTick.current,
  ]);
  const handleMouseUp = useCallback(
    (e) => {
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
    },
    [dispatch, mouseMode, getRelativePointerPosition, setPrevPosition]
  );
  const handleContentDoubleClick = useCallback(
    (e) => {
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
    },
    [
      dispatch,
      mouseMode,
      getRelativePointerPosition,
      drawingLayerRef.current,
      prevPosition,
    ]
  );
  const handleZoomStage = useCallback(
    (event) => {
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
    },
    [dispatch, stageRef.current]
  );
  const handleImageSize = useCallback(
    (size) => {
      if (frameSize.width < size.width || frameSize.height < size.height) {
        dispatch(
          setFrameSizeToMax({
            width: Math.max(frameSize.width, size.width),
            height: Math.max(frameSize.height, size.height),
          })
        );
      }
    },
    [dispatch, frameSize]
  );
  const handleLayerDataChange = useCallback(
    (layer, values) => {
      dispatch(
        updateLayer({
          ...layer,
          layer_data: {
            ...layer.layer_data,
            ...values,
          },
        })
      );
    },
    [dispatch]
  );
  const handleLayerSelect = useCallback(
    (layer) => {
      dispatch(setCurrentLayer(layer));
    },
    [dispatch]
  );
  const handleHoverLayer = useCallback(
    (layer, flag) => {
      onChangeHoverJSONItem(layer.id, flag);
    },
    [onChangeHoverJSONItem]
  );
  const handleAddFont = useCallback(
    (fontFamily) => {
      dispatch(insertToLoadedFontList(fontFamily));
    },
    [dispatch]
  );

  const handleChangeBoardRotation = useCallback(
    (isRight = true) => {
      let newBoardRotate;
      if (isRight) {
        newBoardRotate = boardRotate + 90;
        if (newBoardRotate >= 360) newBoardRotate = 0;
      } else {
        newBoardRotate = boardRotate - 90;
        if (newBoardRotate < 0) newBoardRotate = 270;
      }
      onChangeBoardRotation(newBoardRotate);
    },
    [boardRotate, onChangeBoardRotation]
  );
  const handleLoadLayer = useCallback(
    (layerID, flag) => {
      dispatch(setLoadedStatus({ key: layerID, value: flag }));
    },
    [dispatch]
  );

  const showGuideForRepositioning = useCallback(
    (show = true) => {
      if (!show) {
        dispatch(setPaintingGuides([...previousGuide]));
        setPreviousGuide([]);
      } else if (!previousGuide.length) {
        setPreviousGuide([...paintingGuides]);
        let newPaintingGuides = [...paintingGuides];
        if (
          currentScheme.guide_data.show_wireframe &&
          !newPaintingGuides.includes(PaintingGuides.WIREFRAME)
        ) {
          newPaintingGuides.push(PaintingGuides.WIREFRAME);
        }
        if (
          currentScheme.guide_data.show_numberBlocks &&
          !newPaintingGuides.includes(PaintingGuides.NUMBERBLOCKS)
        ) {
          newPaintingGuides.push(PaintingGuides.NUMBERBLOCKS);
        }
        if (
          currentScheme.guide_data.show_sponsor &&
          !newPaintingGuides.includes(PaintingGuides.SPONSORBLOCKS)
        ) {
          newPaintingGuides.push(PaintingGuides.SPONSORBLOCKS);
        }
        if (
          currentScheme.guide_data.show_grid &&
          !newPaintingGuides.includes(PaintingGuides.GRID)
        ) {
          newPaintingGuides.push(PaintingGuides.GRID);
        }
        dispatch(setPaintingGuides(newPaintingGuides));
      }
    },
    [dispatch, paintingGuides, previousGuide, setPreviousGuide, currentScheme]
  );
  const handleLayerDragStart = useCallback(() => {
    if (
      currentScheme.guide_data.show_wireframe ||
      currentScheme.guide_data.show_numberBlocks ||
      currentScheme.guide_data.show_sponsor ||
      currentScheme.guide_data.show_grid
    )
      showGuideForRepositioning(true);
  }, [showGuideForRepositioning, currentScheme]);
  const handleLayerDragEnd = useCallback(() => {
    if (
      currentScheme.guide_data.show_wireframe ||
      currentScheme.guide_data.show_numberBlocks ||
      currentScheme.guide_data.show_sponsor ||
      currentScheme.guide_data.show_grid
    )
      showGuideForRepositioning(false);
  }, [showGuideForRepositioning, currentScheme]);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      margin="auto"
      position="relative"
      id="board-wrapper"
      position="relative"
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
        offsetX={frameSize.width / 2}
        offsetY={frameSize.height / 2}
        ref={stageRef}
        draggable={mouseMode === MouseModes.DEFAULT}
        style={{
          cursor: mouseMode === MouseModes.DEFAULT ? "default" : "crosshair",
        }}
      >
        <Layer ref={baseLayerRef} listening={false}>
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
          <BasePaints
            legacyMode={currentScheme.legacy_mode}
            carMake={currentCarMake}
            layers={layerList}
            loadedStatuses={loadedStatuses}
            handleImageSize={handleImageSize}
            onLoadLayer={handleLoadLayer}
          />
        </Layer>
        <Layer listening={false}>
          <PaintingGuideBottom
            legacyMode={currentScheme.legacy_mode}
            carMake={currentCarMake}
            paintingGuides={paintingGuides}
            guideData={currentScheme.guide_data}
            loadedStatuses={loadedStatuses}
            handleImageSize={handleImageSize}
            onLoadLayer={handleLoadLayer}
          />
        </Layer>
        <Layer ref={mainLayerRef}>
          {!currentScheme.guide_data.show_carparts_on_top ? (
            <CarParts
              layers={layerList}
              legacyMode={currentScheme.legacy_mode}
              carMake={currentCarMake}
              loadedStatuses={loadedStatuses}
              handleImageSize={handleImageSize}
              onLoadLayer={handleLoadLayer}
            />
          ) : (
            <></>
          )}

          <Overlays
            layers={layerList}
            frameSize={frameSize}
            boardRotate={boardRotate}
            currentLayer={currentLayer}
            mouseMode={mouseMode}
            loadedStatuses={loadedStatuses}
            handleImageSize={handleImageSize}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
            onHover={handleHoverLayer}
            onLoadLayer={handleLoadLayer}
            onDragStart={handleLayerDragStart}
            onDragEnd={handleLayerDragEnd}
          />
          <Shapes
            layers={layerList}
            drawingLayer={drawingLayerRef.current}
            boardRotate={boardRotate}
            mouseMode={mouseMode}
            currentLayer={currentLayer}
            loadedStatuses={loadedStatuses}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
            onHover={handleHoverLayer}
            onLoadLayer={handleLoadLayer}
            onDragStart={handleLayerDragStart}
            onDragEnd={handleLayerDragEnd}
          />
          <LogosAndTexts
            layers={layerList}
            fonts={fontList}
            loadedFontList={loadedFontList}
            frameSize={frameSize}
            mouseMode={mouseMode}
            boardRotate={boardRotate}
            loadedStatuses={loadedStatuses}
            currentLayer={currentLayer}
            setCurrentLayer={handleLayerSelect}
            onChange={handleLayerDataChange}
            onFontLoad={handleAddFont}
            onHover={handleHoverLayer}
            onLoadLayer={handleLoadLayer}
            onDragStart={handleLayerDragStart}
            onDragEnd={handleLayerDragEnd}
          />
          {currentScheme.guide_data.show_carparts_on_top ? (
            <CarParts
              layers={layerList}
              legacyMode={currentScheme.legacy_mode}
              carMake={currentCarMake}
              loadedStatuses={loadedStatuses}
              handleImageSize={handleImageSize}
              onLoadLayer={handleLoadLayer}
            />
          ) : (
            <></>
          )}
        </Layer>
        <Layer ref={carMaskLayerRef} listening={false}>
          <PaintingGuideCarMask
            legacyMode={currentScheme.legacy_mode}
            carMake={currentCarMake}
            paintingGuides={paintingGuides}
            loadedStatuses={loadedStatuses}
            guideData={currentScheme.guide_data}
            handleImageSize={handleImageSize}
            onLoadLayer={handleLoadLayer}
          />
        </Layer>
        <Layer>
          <PaintingGuideTop
            legacyMode={currentScheme.legacy_mode}
            carMake={currentCarMake}
            paintingGuides={paintingGuides}
            loadedStatuses={loadedStatuses}
            frameSize={frameSize}
            guideData={currentScheme.guide_data}
            handleImageSize={handleImageSize}
            onLoadLayer={handleLoadLayer}
          />
          <TransformerComponent
            trRef={activeTransformerRef}
            selectedLayer={currentLayer}
            pressedKey={pressedKey}
          />
          {hoveredLayerJSON &&
          (!currentLayer || !hoveredLayerJSON[currentLayer.id]) ? (
            <TransformerComponent
              trRef={hoveredTransformerRef}
              selectedLayer={layerList.find(
                (item) => hoveredLayerJSON[item.id]
              )}
              hoveredTransform={true}
            />
          ) : (
            <></>
          )}
        </Layer>
      </Stage>
      <Box position="absolute" right={0} top={0}>
        <LightTooltip title="Rotate Left" position="bottom" arrow>
          <RotationButton onClick={() => handleChangeBoardRotation(false)}>
            <RotateLeftIcon />
          </RotationButton>
        </LightTooltip>
        <LightTooltip title="Rotate Right" position="bottom" arrow>
          <RotationButton onClick={() => handleChangeBoardRotation(true)}>
            <RotateRightIcon />
          </RotationButton>
        </LightTooltip>
      </Box>
      {schemeSaving || !schemeLoaded ? (
        <Box
          width="100%"
          height="100%"
          bgcolor="#282828"
          position="absolute"
          left="0"
          top="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ScreenLoader />
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Board;
