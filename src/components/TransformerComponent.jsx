import React, { useRef, useEffect, useMemo, useCallback } from "react";

import { MouseModes } from "constant";
import { Transformer } from "react-konva";

const TransformerComponent = ({
  selectedLayer,
  pressedKey,
  hoveredTransform,
}) => {
  const trRef = useRef();
  const keepRatio = useMemo(
    () =>
      selectedLayer &&
      (selectedLayer.layer_data.sizeLocked ||
        selectedLayer.layer_data.scaleLocked ||
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

  const getCenter = useCallback((shape) => {
    return {
      x:
        shape.x +
        (shape.width / 2) * Math.cos(shape.rotation) +
        (shape.height / 2) * Math.sin(-shape.rotation),
      y:
        shape.y +
        (shape.height / 2) * Math.cos(shape.rotation) +
        (shape.width / 2) * Math.sin(shape.rotation),
    };
  }, []);

  const rotateAroundPoint = useCallback((shape, deltaDeg, point) => {
    const x = Math.round(
      point.x +
        (shape.x - point.x) * Math.cos(deltaDeg) -
        (shape.y - point.y) * Math.sin(deltaDeg)
    );
    const y = Math.round(
      point.y +
        (shape.x - point.x) * Math.sin(deltaDeg) +
        (shape.y - point.y) * Math.cos(deltaDeg)
    );

    return {
      ...shape,
      rotation: shape.rotation + deltaDeg,
      x,
      y,
    };
  }, []);

  const rotateAroundCenter = useCallback(
    (shape, deltaDeg) => {
      const center = getCenter(shape);
      return rotateAroundPoint(shape, deltaDeg, center);
    },
    [getCenter, rotateAroundPoint]
  );

  const getSnapRotation = useCallback((rot) => {
    const rotation = rot < 0 ? 2 * Math.PI + rot : rot;
    const son = Math.PI / 12;
    return Math.round(rotation / son) * son;
  }, []);

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
    [pressedKey, getSnapRotation]
  );

  if (selectedLayer)
    return (
      <Transformer
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
