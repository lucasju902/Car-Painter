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
    [dispatch, currentLayer, stageRef]
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
    let width = stageRef.current.attrs.width || 1024;
    let height = stageRef.current.attrs.height || 1024;
    const newZoom = mathRound4(
      Math.min(
        width / (frameSize.width || 1024),
        height / (frameSize.height || 1024)
      )
    );

    stageRef.current.x(width / 2);
    stageRef.current.y(height / 2);
    dispatch(setZoom(newZoom));
  }, [dispatch, stageRef, frameSize]);

  return [zoom, handleZoomIn, handleZoomOut, handleZoomFit];
};
