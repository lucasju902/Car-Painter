import { useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setZoom } from "redux/reducers/boardReducer";
import { mathRound4 } from "helper";

export const useZoom = (stageRef) => {
  const dispatch = useDispatch();

  const zoom = useSelector((state) => state.boardReducer.zoom);
  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const currentLayer = useSelector((state) => state.layerReducer.current);

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

  return [zoom, handleZoomIn, handleZoomOut, handleZoomFit];
};
