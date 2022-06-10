import React, { useCallback, useMemo } from "react";
import { Stage, Layer, Rect, Shape } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { useResizeDetector } from "react-resize-detector";

import { MouseModes, ViewModes, FinishOptions } from "constant";

import { Box } from "@material-ui/core";
import { ScreenLoader } from "components/common";
import {
  PaintingGuideTop,
  PaintingGuideCarMask,
  PaintingGuideNumber,
  PaintingGuideSponsor,
  SpecPaintingGuideCarMask,
} from "./Guides";
import {
  BasePaints,
  CarParts,
  Overlays,
  LogosAndTexts,
  Shapes,
} from "./Layers";
import { TransformerComponent } from "components/konva";

import {
  setFrameSizeToMax,
  setShowProperties,
  setZoom,
} from "redux/reducers/boardReducer";
import { insertToLoadedList as insertToLoadedFontList } from "redux/reducers/fontReducer";
import {
  setCurrent as setCurrentLayer,
  updateLayer,
  setLoadedStatus,
  setCloningLayer,
  cloneLayer,
  insertToCloningQueue,
  deleteCloningQueueByID,
} from "redux/reducers/layerReducer";
import { useDrawHelper } from "hooks";
import { v4 as uuidv4 } from "uuid";

export const Board = React.memo(
  ({
    hoveredLayerJSON,
    editable,
    onChangeHoverJSONItem,
    stageRef,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    activeTransformerRef,
    hoveredTransformerRef,
  }) => {
    const scaleBy = 1.2;
    const [
      drawingLayerRef,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onContentMouseDown,
      onDoubleClick,
      onLayerDragStart,
      onLayerDragEnd,
      onDragEnd,
    ] = useDrawHelper(stageRef);

    const dispatch = useDispatch();

    const frameSize = useSelector((state) => state.boardReducer.frameSize);
    const zoom = useSelector((state) => state.boardReducer.zoom);
    const paintingGuides = useSelector(
      (state) => state.boardReducer.paintingGuides
    );
    const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
    const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
    const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
    const viewMode = useSelector((state) => state.boardReducer.viewMode);
    const currentCarMake = useSelector((state) => state.carMakeReducer.current);
    const currentScheme = useSelector((state) => state.schemeReducer.current);
    const schemeSaving = useSelector((state) => state.schemeReducer.saving);
    const schemeLoaded = useSelector((state) => state.schemeReducer.loaded);
    const fontList = useSelector((state) => state.fontReducer.list);
    const loadedFontList = useSelector((state) => state.fontReducer.loadedList);
    const layerList = useSelector((state) => state.layerReducer.list);
    const currentLayer = useSelector((state) => state.layerReducer.current);
    const cloningLayer = useSelector(
      (state) => state.layerReducer.cloningLayer
    );
    const cloningQueue = useSelector(
      (state) => state.layerReducer.cloningQueue
    );
    const loadedStatuses = useSelector(
      (state) => state.layerReducer.loadedStatuses
    );

    const {
      width: wrapperWidth,
      height: wrapperHeight,
      ref: wrapperRef,
    } = useResizeDetector();

    const schemeFinishBase = useMemo(() => {
      const foundFinish = FinishOptions.find(
        (item) => item.value === currentScheme.finish
      );
      if (foundFinish) return foundFinish.base;
      return FinishOptions[0].base;
    }, [currentScheme.finish]);

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
      [dispatch, stageRef]
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
      (layer, values, pushingToHistory = true) => {
        dispatch(
          updateLayer(
            {
              id: layer.id,
              layer_data: {
                ...layer.layer_data,
                ...values,
              },
            },
            pushingToHistory
          )
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

    const handleLoadLayer = useCallback(
      (layerID, flag) => {
        dispatch(setLoadedStatus({ key: layerID, value: flag }));
      },
      [dispatch]
    );

    const handleDblClickLayer = useCallback(() => {
      dispatch(setShowProperties(true));
    }, [dispatch]);

    const handleCloneMoveLayer = useCallback(
      (movedLayer) => {
        const newQueueID = `cloning-layer-${uuidv4()}`;
        dispatch(setCloningLayer(null));
        dispatch(insertToCloningQueue({ ...movedLayer, id: newQueueID }));
        dispatch(
          cloneLayer(movedLayer, true, true, {}, () => {
            dispatch(deleteCloningQueueByID(newQueueID));
          })
        );
      },
      [dispatch]
    );

    return (
      <Box width="100%" height="calc(100% - 50px)" position="relative">
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          margin="auto"
          id="board-wrapper"
          position="relative"
          ref={wrapperRef}
        >
          <Stage
            width={wrapperWidth}
            height={wrapperHeight}
            onMousedown={onMouseDown}
            onTouchStart={onMouseDown}
            onContentMousedown={onContentMouseDown}
            onContentMousemove={onMouseMove}
            onContentMouseup={onMouseUp}
            onDblClick={onDoubleClick}
            onWheel={handleZoomStage}
            scaleX={zoom || 1}
            scaleY={zoom || 1}
            rotation={boardRotate}
            x={wrapperWidth / 2 || 0}
            y={wrapperHeight / 2 || 0}
            offsetX={frameSize.width / 2}
            offsetY={frameSize.height / 2}
            ref={stageRef}
            draggable={mouseMode === MouseModes.DEFAULT}
            onDragEnd={onDragEnd}
            style={{
              cursor:
                mouseMode === MouseModes.DEFAULT ? "default" : "crosshair",
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
              {viewMode === ViewModes.SPEC_VIEW && (
                <SpecPaintingGuideCarMask
                  legacyMode={currentScheme.legacy_mode}
                  carMake={currentCarMake}
                  loadedStatuses={loadedStatuses}
                  finishBase={schemeFinishBase}
                  handleImageSize={handleImageSize}
                  onLoadLayer={handleLoadLayer}
                />
              )}
              <BasePaints
                specMode={viewMode === ViewModes.SPEC_VIEW}
                legacyMode={currentScheme.legacy_mode}
                carMake={currentCarMake}
                layers={layerList}
                loadedStatuses={loadedStatuses}
                handleImageSize={handleImageSize}
                onLoadLayer={handleLoadLayer}
              />
            </Layer>
            {!currentScheme.guide_data.show_sponsor_block_on_top ||
            !currentScheme.guide_data.show_number_block_on_top ? (
              <Layer listening={false}>
                {!currentScheme.guide_data.show_sponsor_block_on_top ? (
                  <PaintingGuideSponsor
                    legacyMode={currentScheme.legacy_mode}
                    carMake={currentCarMake}
                    paintingGuides={paintingGuides}
                    guideData={currentScheme.guide_data}
                    loadedStatuses={loadedStatuses}
                    handleImageSize={handleImageSize}
                    onLoadLayer={handleLoadLayer}
                  />
                ) : (
                  <></>
                )}
                {!currentScheme.guide_data.show_number_block_on_top ? (
                  <PaintingGuideNumber
                    legacyMode={currentScheme.legacy_mode}
                    carMake={currentCarMake}
                    paintingGuides={paintingGuides}
                    guideData={currentScheme.guide_data}
                    loadedStatuses={loadedStatuses}
                    handleImageSize={handleImageSize}
                    onLoadLayer={handleLoadLayer}
                  />
                ) : (
                  <></>
                )}
              </Layer>
            ) : (
              <></>
            )}

            <Layer ref={mainLayerRef}>
              {!currentScheme.guide_data.show_carparts_on_top ? (
                <CarParts
                  layers={layerList}
                  specMode={viewMode === ViewModes.SPEC_VIEW}
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
                stageRef={stageRef}
                editable={editable}
                specMode={viewMode === ViewModes.SPEC_VIEW}
                layers={layerList}
                frameSize={frameSize}
                boardRotate={boardRotate}
                currentLayer={currentLayer}
                cloningLayer={cloningLayer}
                cloningQueue={cloningQueue}
                mouseMode={mouseMode}
                loadedStatuses={loadedStatuses}
                paintingGuides={paintingGuides}
                guideData={currentScheme.guide_data}
                handleImageSize={handleImageSize}
                onSelect={handleLayerSelect}
                onChange={handleLayerDataChange}
                onHover={handleHoverLayer}
                onLoadLayer={handleLoadLayer}
                onDragStart={onLayerDragStart}
                onDragEnd={onLayerDragEnd}
                onCloneMove={handleCloneMoveLayer}
                onDblClick={handleDblClickLayer}
              />
              <Shapes
                stageRef={stageRef}
                editable={editable}
                frameSize={frameSize}
                specMode={viewMode === ViewModes.SPEC_VIEW}
                layers={layerList}
                drawingLayer={drawingLayerRef.current}
                boardRotate={boardRotate}
                mouseMode={mouseMode}
                currentLayer={currentLayer}
                cloningLayer={cloningLayer}
                cloningQueue={cloningQueue}
                loadedStatuses={loadedStatuses}
                paintingGuides={paintingGuides}
                guideData={currentScheme.guide_data}
                onSelect={handleLayerSelect}
                onChange={handleLayerDataChange}
                onHover={handleHoverLayer}
                onLoadLayer={handleLoadLayer}
                onDragStart={onLayerDragStart}
                onDragEnd={onLayerDragEnd}
                onDblClick={handleDblClickLayer}
                onCloneMove={handleCloneMoveLayer}
              />
              <LogosAndTexts
                stageRef={stageRef}
                editable={editable}
                specMode={viewMode === ViewModes.SPEC_VIEW}
                layers={layerList}
                fonts={fontList}
                loadedFontList={loadedFontList}
                frameSize={frameSize}
                mouseMode={mouseMode}
                boardRotate={boardRotate}
                loadedStatuses={loadedStatuses}
                currentLayer={currentLayer}
                cloningLayer={cloningLayer}
                cloningQueue={cloningQueue}
                paintingGuides={paintingGuides}
                guideData={currentScheme.guide_data}
                onSelect={handleLayerSelect}
                onChange={handleLayerDataChange}
                onFontLoad={handleAddFont}
                onHover={handleHoverLayer}
                onLoadLayer={handleLoadLayer}
                onDragStart={onLayerDragStart}
                onDragEnd={onLayerDragEnd}
                onDblClick={handleDblClickLayer}
                onCloneMove={handleCloneMoveLayer}
              />
              {currentScheme.guide_data.show_carparts_on_top ? (
                <CarParts
                  layers={layerList}
                  specMode={viewMode === ViewModes.SPEC_VIEW}
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
                specMode={viewMode === ViewModes.SPEC_VIEW}
                legacyMode={currentScheme.legacy_mode}
                carMake={currentCarMake}
                paintingGuides={paintingGuides}
                loadedStatuses={loadedStatuses}
                guideData={currentScheme.guide_data}
                handleImageSize={handleImageSize}
                onLoadLayer={handleLoadLayer}
              />
            </Layer>
            {currentScheme.guide_data.show_sponsor_block_on_top ||
            currentScheme.guide_data.show_number_block_on_top ? (
              <Layer listening={false}>
                {currentScheme.guide_data.show_sponsor_block_on_top ? (
                  <PaintingGuideSponsor
                    legacyMode={currentScheme.legacy_mode}
                    carMake={currentCarMake}
                    paintingGuides={paintingGuides}
                    guideData={currentScheme.guide_data}
                    loadedStatuses={loadedStatuses}
                    handleImageSize={handleImageSize}
                    onLoadLayer={handleLoadLayer}
                  />
                ) : (
                  <></>
                )}
                {currentScheme.guide_data.show_number_block_on_top ? (
                  <PaintingGuideNumber
                    legacyMode={currentScheme.legacy_mode}
                    carMake={currentCarMake}
                    paintingGuides={paintingGuides}
                    guideData={currentScheme.guide_data}
                    loadedStatuses={loadedStatuses}
                    handleImageSize={handleImageSize}
                    onLoadLayer={handleLoadLayer}
                  />
                ) : (
                  <></>
                )}
              </Layer>
            ) : (
              <></>
            )}
            <Layer name="layer-guide-top">
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
            </Layer>

            {/* Clipping/Transforming Layer */}
            <Layer>
              <Shape
                x={-frameSize.width}
                y={-frameSize.height}
                width={frameSize.width * 3}
                height={frameSize.height * 3}
                sceneFunc={(ctx) => {
                  // draw background
                  ctx.fillStyle = "rgba(40, 40, 40, 0.7)";
                  ctx.fillRect(0, 0, frameSize.width * 3, frameSize.height * 3);

                  ctx.globalCompositeOperation = "destination-out";
                  ctx.fillStyle = "black";
                  ctx.fillRect(
                    frameSize.width,
                    frameSize.height,
                    frameSize.width,
                    frameSize.height
                  );
                }}
                listening={false}
              />

              {editable ? (
                <TransformerComponent
                  trRef={activeTransformerRef}
                  selectedLayer={currentLayer}
                  pressedKey={pressedKey}
                  zoom={zoom}
                />
              ) : (
                <></>
              )}

              {hoveredLayerJSON &&
              (!currentLayer ||
                !hoveredLayerJSON[currentLayer.id] ||
                !editable) ? (
                <TransformerComponent
                  trRef={hoveredTransformerRef}
                  selectedLayer={layerList.find(
                    (item) => hoveredLayerJSON[item.id]
                  )}
                  hoveredTransform={true}
                  pressedKey={pressedKey}
                  zoom={zoom}
                />
              ) : (
                <></>
              )}
            </Layer>
          </Stage>
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
  }
);

export default Board;
