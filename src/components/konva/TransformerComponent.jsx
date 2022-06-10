import React, { useEffect, useMemo, useCallback } from "react";

import { Transformer } from "react-konva";
import {
  getSnapRotation,
  rotateAroundCenter,
  isCenterBasedShape,
} from "helper";
import { LayerTypes } from "constant";
import useImage from "use-image";
import { rgb } from "color";
import RotateIcon from "assets/rotate-left.svg";

export const TransformerComponent = React.memo(
  ({ trRef, selectedLayer, pressedKey, hoveredTransform, zoom }) => {
    const minScaledSize = useMemo(
      () =>
        selectedLayer
          ? Math.max(
              Math.min(
                selectedLayer.layer_data.width / 3,
                selectedLayer.layer_data.height / 3
              ) * zoom,
              5
            )
          : 0,
      [zoom, selectedLayer]
    );

    const anchorSize = useMemo(() => Math.min(15, minScaledSize || 15), [
      minScaledSize,
    ]);
    const [icon] = useImage(RotateIcon);
    const keepRatio = useMemo(
      () =>
        selectedLayer &&
        (selectedLayer.layer_data.sizeLocked ||
          isCenterBasedShape(selectedLayer.layer_data.type) ||
          pressedKey === "shift"),
      [selectedLayer, pressedKey]
    );
    const rotatorCanvas = useMemo(() => {
      if (!icon) {
        return null;
      }
      const canvas = document.createElement("canvas");
      canvas.width = anchorSize;
      canvas.height = anchorSize;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(icon, 0, 0, canvas.width, canvas.height);

      return canvas;
    }, [icon]);

    const centeredScaling = useMemo(() => pressedKey === "alt", [pressedKey]);

    const checkNode = useCallback(() => {
      if (!rotatorCanvas) {
        return;
      }

      if (selectedLayer && trRef.current) {
        const tr = trRef.current;
        const stage = tr.getStage();

        const selectedNode = stage.findOne("." + selectedLayer.id);
        if (selectedNode === tr.node()) {
          return;
        }

        if (selectedNode) {
          tr.nodes([selectedNode]);
        } else {
          tr.detach();
        }

        var rotater = tr.findOne(".rotater");
        rotater.fillPriority("pattern");
        rotater.fillPatternImage(rotatorCanvas);

        tr.getLayer().batchDraw();
      }
    }, [selectedLayer, trRef, rotatorCanvas]);

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
      [pressedKey]
    );

    if (
      selectedLayer &&
      ![LayerTypes.CAR, LayerTypes.BASE].includes(selectedLayer.layer_type)
    )
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
          borderStroke={hoveredTransform ? "red" : rgb(77, 158, 224)}
          borderStrokeWidth={3}
          centeredScaling={centeredScaling}
          anchorStroke="gray"
          anchorStrokeWidth={2}
          anchorFill="white"
          anchorSize={anchorSize}
          anchorCornerRadius={anchorSize}
        />
      );
    return <></>;
  }
);

export default TransformerComponent;
