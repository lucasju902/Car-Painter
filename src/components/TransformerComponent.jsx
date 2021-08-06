import React, { useEffect, useMemo, useCallback } from "react";

import { MouseModes } from "constant";
import { Transformer } from "react-konva";
import { getSnapRotation, rotateAroundCenter } from "helper";

const TransformerComponent = ({
  trRef,
  selectedLayer,
  pressedKey,
  hoveredTransform,
}) => {
  const keepRatio = useMemo(
    () =>
      selectedLayer &&
      (selectedLayer.layer_data.sizeLocked ||
        [
          MouseModes.CIRCLE,
          MouseModes.STAR,
          MouseModes.RING,
          MouseModes.REGULARPOLYGON,
          MouseModes.WEDGE,
          MouseModes.ARC,
        ].includes(selectedLayer.layer_data.type) ||
        pressedKey === "shift"),
    [selectedLayer, pressedKey]
  );

  const checkNode = useCallback(() => {
    if (selectedLayer) {
      const stage = trRef.current.getStage();

      const selectedNode = stage.findOne("." + selectedLayer.id);
      if (selectedNode === trRef.current.node()) {
        return;
      }

      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
      } else {
        trRef.current.detach();
      }
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedLayer]);

  useEffect(() => {
    checkNode();
  }, [checkNode]);

  const boundBoxFunc = useCallback(
    (oldBoundBox, newBoundBox) => {
      const closesSnap = getSnapRotation(newBoundBox.rotation);
      const diff = closesSnap - oldBoundBox.rotation;
      if (pressedKey === "shift") {
        if (newBoundBox.rotation - oldBoundBox.rotation === 0) {
          return newBoundBox;
        }
        if (Math.abs(diff) > 0) {
          return rotateAroundCenter(oldBoundBox, diff);
        }
        return oldBoundBox;
      }
      return newBoundBox;
    },
    [pressedKey, getSnapRotation, rotateAroundCenter]
  );

  if (selectedLayer)
    return (
      <Transformer
        id="defaultTransformer"
        ref={trRef}
        keepRatio={keepRatio}
        enabledAnchors={
          hoveredTransform || pressedKey === "h"
            ? []
            : keepRatio
            ? ["top-left", "top-right", "bottom-left", "bottom-right"]
            : [
                "top-left",
                "top-center",
                "top-right",
                "middle-right",
                "middle-left",
                "bottom-left",
                "bottom-center",
                "bottom-right",
              ]
        }
        borderEnabled={pressedKey !== "h"}
        rotateEnabled={!hoveredTransform && pressedKey !== "h"}
        boundBoxFunc={boundBoxFunc}
        borderStroke={hoveredTransform ? "red" : null}
      />
    );
  return <></>;
};

export default TransformerComponent;
