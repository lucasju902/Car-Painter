import { useRef, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useInterval from "react-useinterval";

import {
  MouseModes,
  LayerTypes,
  DefaultLayer,
  DrawingStatus,
  PaintingGuides,
} from "constant";
import {
  getRelativePointerPosition,
  removeDuplicatedPointFromEnd,
} from "helper";

import { setMouseMode, setPaintingGuides } from "redux/reducers/boardReducer";
import {
  setCurrent as setCurrentLayer,
  createShape,
  setDrawingStatus,
} from "redux/reducers/layerReducer";

export const useDrawHelper = (stageRef) => {
  const [prevPosition, setPrevPosition] = useState({});
  const [previousGuide, setPreviousGuide] = useState([]);
  const [tick, setTick] = useState(0);

  const drawingLayerRef = useRef(null);
  const prevTick = useRef(0);
  const currentTick = useRef(0);

  const dispatch = useDispatch();

  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    [mouseMode, currentScheme.guide_data, drawingLayerRef, stageRef]
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
  }, [mouseMode, drawingLayerRef, stageRef, currentTick]);
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
    [mouseMode, stageRef, dispatch]
  );
  const handleDoubleClick = useCallback(
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
    [stageRef, mouseMode, prevPosition, dispatch]
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

  return [
    drawingLayerRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleContentMouseDown,
    handleDoubleClick,
    handleLayerDragStart,
    handleLayerDragEnd,
  ];
};
