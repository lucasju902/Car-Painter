import { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { AllowedLayerProps, LayerTypes, MouseModes } from "constant";
import { mathRound2 } from "helper";

export const useTransform = ({
  shapeRef,
  imageshapeRef,
  layer,
  offsetsFromStroke,
  frameSize,
  onChange,
  onDragStart,
  onDragEnd,
  applyCaching,
}) => {
  const [transforming, setTransforming] = useState(false);
  const AllowedLayerTypes = useMemo(
    () =>
      !layer || !layer.layer_type
        ? []
        : layer.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[layer.layer_type]
        : AllowedLayerProps[layer.layer_type][layer.layer_data.type],
    [layer]
  );

  const getShapeClientRect = useCallback((node) => {
    return node.getClientRect({
      relativeTo: node.getParent().getParent(),
      skipShadow: true,
    });
  }, []);

  const handleTransformStart = useCallback(
    (e) => {
      setTransforming(true);
      if (onDragStart) onDragStart();
    },
    [onDragStart]
  );

  const handleTransformEnd = useCallback(
    (e) => {
      setTransforming(false);
      const opacity = layer ? layer.layer_data.opacity : 1;
      e.target.opacity(opacity);
      if (onChange) {
        var transform = {};
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const width =
          layer.layer_data.type !== MouseModes.ELLIPSE
            ? node.width()
            : node.radiusX();
        const height =
          layer.layer_data.type !== MouseModes.ELLIPSE
            ? node.height()
            : node.radiusY();
        const xyScale = Math.abs(
          Math.abs(mathRound2(scaleY)) !== 1 ? scaleY : scaleX
        );

        transform = {
          left: mathRound2(
            node.x() - (offsetsFromStroke ? offsetsFromStroke.x : 0)
          ),
          top: mathRound2(
            node.y() - (offsetsFromStroke ? offsetsFromStroke.y : 0)
          ),
          rotation: mathRound2(node.rotation()) || 0,
          flop: scaleX > 0 ? 0 : 1,
          flip: scaleY > 0 ? 0 : 1,
        };
        if (imageshapeRef) {
          transform.shadowBlur = mathRound2(
            imageshapeRef.current.shadowBlur() * xyScale
          );
        } else {
          transform.shadowBlur = mathRound2(node.shadowBlur() * xyScale);
        }
        if (layer.layer_data.shadowOffsetX || layer.layer_data.shadowOffsetY) {
          transform.shadowOffsetX = mathRound2(
            layer.layer_data.shadowOffsetX * Math.abs(scaleX)
          );
          transform.shadowOffsetY = mathRound2(
            layer.layer_data.shadowOffsetY * Math.abs(scaleY)
          );
        }
        if (node.radius) {
          transform.radius = mathRound2(
            Math.max(1, node.radius() * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.radius : 0)
          );
        }
        if (node.innerRadius) {
          transform.innerRadius = mathRound2(
            Math.max(1, node.innerRadius() * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.innerRadius : 0)
          );
        }

        if (node.outerRadius) {
          transform.outerRadius = mathRound2(
            Math.max(1, node.outerRadius() * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.outerRadius : 0)
          );
        }
        if (
          layer.layer_data.cornerTopLeft ||
          layer.layer_data.cornerTopRight ||
          layer.layer_data.cornerBottomLeft ||
          layer.layer_data.cornerBottomRight
        ) {
          transform.cornerTopLeft = mathRound2(
            layer.layer_data.cornerTopLeft * xyScale
          );
          transform.cornerTopRight = mathRound2(
            layer.layer_data.cornerTopRight * xyScale
          );
          transform.cornerBottomLeft = mathRound2(
            layer.layer_data.cornerBottomLeft * xyScale
          );
          transform.cornerBottomRight = mathRound2(
            layer.layer_data.cornerBottomRight * xyScale
          );
        }
        if (layer.layer_data.points) {
          transform.points = layer.layer_data.points.map((point, index) =>
            index % 2 === 0
              ? mathRound2(point * Math.abs(scaleX))
              : mathRound2(point * Math.abs(scaleY))
          );
        }

        if (layer.layer_data.paddingX || layer.layer_data.paddingY) {
          transform.paddingX = mathRound2(
            (layer.layer_data.paddingX || 0) * Math.abs(scaleX)
          );
          transform.paddingY = mathRound2(
            (layer.layer_data.paddingY || 0) * Math.abs(scaleY)
          );
        }

        if (layer.layer_type === LayerTypes.TEXT) {
          transform.scaleX = mathRound2(Math.max(0.01, scaleX));
          transform.scaleY = mathRound2(Math.max(0.01, scaleY));
          transform.width = mathRound2(Math.max(5, node.width()));
          transform.height = mathRound2(Math.max(5, node.height()));
        } else {
          // we will reset it back
          node.scaleX(scaleX > 0 ? 1 : -1);
          node.scaleY(scaleY > 0 ? 1 : -1);
          transform.width = mathRound2(
            Math.max(1, width * Math.abs(scaleX)) -
              (offsetsFromStroke ? offsetsFromStroke.width : 0)
          );
          transform.height = mathRound2(
            Math.max(1, height * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.height : 0)
          );
          if (node.strokeWidth) {
            transform.stroke = mathRound2(node.strokeWidth() * xyScale);
          }
        }

        onChange(
          _.pick(
            transform,
            AllowedLayerTypes.filter((item) =>
              item.includes("layer_data.")
            ).map((item) => item.replace("layer_data.", ""))
          )
        );
        if (applyCaching) applyCaching();
        if (onDragEnd) onDragEnd();
      }
    },
    [
      offsetsFromStroke,
      AllowedLayerTypes,
      shapeRef,
      imageshapeRef,
      layer,
      onChange,
      onDragEnd,
      applyCaching,
    ]
  );

  const handleTransform = useCallback(
    (e) => {
      let opacity = layer ? layer.layer_data.opacity : 1;
      var box = getShapeClientRect(e.target);
      if (
        box.x < 0 ||
        box.y < 0 ||
        box.x + box.width > frameSize.width ||
        box.y + box.height > frameSize.height
      ) {
        e.target.opacity(opacity / 2);
      } else {
        e.target.opacity(opacity);
      }
    },
    [frameSize, getShapeClientRect, layer]
  );

  return [
    transforming,
    handleTransformStart,
    handleTransformEnd,
    handleTransform,
  ];
};
