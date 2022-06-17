import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import { FinishOptions, LayerTypes, MouseModes } from "constant";
import { getRelativeShadowOffset, removeDuplicatedPointFromEnd } from "helper";

import { Shape } from "components/konva";

export const Shapes = React.memo((props) => {
  const {
    stageRef,
    editable,
    layers,
    frameSize,
    drawingLayer,
    boardRotate,
    mouseMode,
    specMode,
    loadedStatuses,
    paintingGuides,
    guideData,
    cloningLayer,
    cloningQueue,
    onSelect,
    onChange,
    onHover,
    onLoadLayer,
    onDragStart,
    onDragEnd,
    onDblClick,
    onCloneMove,
    onSetTransformingLayer,
  } = props;

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layers.filter((item) => item.layer_type === LayerTypes.SHAPE),
        ["layer_order"],
        ["desc"]
      ),
    [layers]
  );
  const resultLayers = useMemo(() => {
    let newLayers = [...filteredLayers];
    if (cloningLayer) {
      newLayers = [...newLayers, cloningLayer];
    }
    if (cloningQueue.length) {
      newLayers = [...newLayers, ...cloningQueue];
    }
    return newLayers;
  }, [cloningLayer, cloningQueue, filteredLayers]);

  const getShadowOffset = useCallback(
    (layer) => {
      return getRelativeShadowOffset(boardRotate, {
        x: layer.layer_data.shadowOffsetX,
        y: layer.layer_data.shadowOffsetY,
      });
    },
    [boardRotate]
  );
  const getOffsetsFromStroke = useCallback((layer) => {
    if (layer.layer_data.strokeType === "inside")
      return {
        x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? layer.layer_data.stroke / 2.0
          : 0,
        y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? layer.layer_data.stroke / 2.0
          : 0,
        height: -layer.layer_data.stroke / 2.0,
        width: -layer.layer_data.stroke / 2.0,
        radius: -layer.layer_data.stroke / 2.0,
        pointerLength: -layer.layer_data.stroke / 2.0,
        pointerWidth: -layer.layer_data.stroke / 2.0,
        innerRadius: layer.layer_data.stroke / 2.0,
        outerRadius: -layer.layer_data.stroke / 2.0,
      };
    if (layer.layer_data.strokeType === "outside")
      return {
        x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? -layer.layer_data.stroke / 2.0
          : 0,
        y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? -layer.layer_data.stroke / 2.0
          : 0,
        height: layer.layer_data.stroke / 2.0,
        width: layer.layer_data.stroke / 2.0,
        radius: layer.layer_data.stroke / 2.0,
        pointerLength: layer.layer_data.stroke / 2.0,
        pointerWidth: layer.layer_data.stroke / 2.0,
        innerRadius: -layer.layer_data.stroke / 2.0,
        outerRadius: layer.layer_data.stroke / 2.0,
      };
    return {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      radius: 0,
      pointerLength: 0,
      pointerWidth: 0,
      innerRadius: 0,
      outerRadius: 0,
    };
  }, []);

  return (
    <>
      {resultLayers.map((layer) => {
        let shadowOffset = getShadowOffset(layer);
        let offsetsFromStroke = getOffsetsFromStroke(layer);
        const newWidth =
          (layer.layer_data.width || 0) + offsetsFromStroke.width;
        const newHeight =
          (layer.layer_data.height || 0) + offsetsFromStroke.height;

        return (
          <Shape
            key={layer.id}
            id={layer.id}
            name={layer.id ? layer.id.toString() : null}
            layer={layer}
            cloningLayer={cloningLayer}
            stageRef={stageRef}
            editable={editable}
            frameSize={frameSize}
            type={layer.layer_data.type}
            x={parseFloat(layer.layer_data.left + offsetsFromStroke.x || 0)}
            y={parseFloat(layer.layer_data.top + offsetsFromStroke.y || 0)}
            width={Math.abs(newWidth)}
            height={Math.abs(newHeight)}
            radius={Math.abs(
              layer.layer_data.radius + offsetsFromStroke.radius
            )}
            offsetsFromStroke={offsetsFromStroke}
            points={
              layer.layer_data.points
                ? removeDuplicatedPointFromEnd(layer.layer_data.points)
                : []
            }
            loadedStatus={loadedStatuses[layer.id]}
            pointerLength={Math.abs(
              layer.layer_data.pointerLength + offsetsFromStroke.pointerLength
            )}
            pointerWidth={Math.abs(
              layer.layer_data.pointerWidth + offsetsFromStroke.pointerWidth
            )}
            lineCap={layer.layer_data.lineCap}
            lineJoin={layer.layer_data.lineJoin}
            innerRadius={Math.abs(
              layer.layer_data.innerRadius + offsetsFromStroke.innerRadius
            )}
            outerRadius={Math.abs(
              layer.layer_data.outerRadius + offsetsFromStroke.outerRadius
            )}
            numPoints={layer.layer_data.numPoints}
            cornerRadius={[
              layer.layer_data.cornerTopLeft,
              layer.layer_data.cornerTopRight,
              layer.layer_data.cornerBottomLeft,
              layer.layer_data.cornerBottomRight,
            ]}
            rotation={layer.layer_data.rotation}
            angle={layer.layer_data.angle}
            opacity={layer.layer_data.opacity}
            scaleX={layer.layer_data.flop === 1 ? -1 : 1}
            scaleY={layer.layer_data.flip === 1 ? -1 : 1}
            shadowColor={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.shadowColor
            }
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffset.x}
            shadowOffsetY={shadowOffset.y}
            skewX={
              Math.abs(layer.layer_data.skewX) >= 1
                ? layer.layer_data.skewX / 10
                : layer.layer_data.skewX
            }
            skewY={
              Math.abs(layer.layer_data.skewY) >= 1
                ? layer.layer_data.skewY / 10
                : layer.layer_data.skewY
            }
            fill={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.color
            }
            strokeWidth={layer.layer_data.stroke}
            stroke={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.scolor
            }
            strokeScale={layer.layer_data.stroke_scale}
            strokeEnabled={true}
            globalCompositeOperation={
              layer.layer_data.blendType === "normal"
                ? null
                : layer.layer_data.blendType
            }
            visible={layer.layer_visible ? true : false}
            perfectDrawEnabled={false}
            paintingGuides={paintingGuides}
            guideData={guideData}
            onSelect={() => onSelect(layer)}
            onDblClick={onDblClick}
            listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
            onChange={(values) => onChange(layer, values)}
            onHover={(flag) => onHover(layer, flag)}
            onLoadLayer={onLoadLayer}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onCloneMove={onCloneMove}
            onSetTransformingLayer={onSetTransformingLayer}
          />
        );
      })}
      {drawingLayer ? (
        <Shape
          layer={drawingLayer}
          cloningLayer={cloningLayer}
          type={drawingLayer.layer_data.type}
          x={parseFloat(drawingLayer.layer_data.left || 0)}
          y={parseFloat(drawingLayer.layer_data.top || 0)}
          width={drawingLayer.layer_data.width}
          height={drawingLayer.layer_data.height}
          radius={Math.abs(drawingLayer.layer_data.radius)}
          angle={drawingLayer.layer_data.angle}
          points={
            drawingLayer.layer_data.points
              ? removeDuplicatedPointFromEnd(drawingLayer.layer_data.points)
              : []
          }
          pointerLength={drawingLayer.layer_data.pointerLength}
          pointerWidth={drawingLayer.layer_data.pointerWidth}
          lineCap={drawingLayer.layer_data.lineCap}
          lineJoin={drawingLayer.layer_data.lineJoin}
          innerRadius={Math.abs(drawingLayer.layer_data.innerRadius)}
          outerRadius={Math.abs(drawingLayer.layer_data.outerRadius)}
          numPoints={drawingLayer.layer_data.numPoints}
          fill={
            specMode
              ? drawingLayer.layer_data.finish || FinishOptions[0].value
              : drawingLayer.layer_data.color
          }
          strokeWidth={drawingLayer.layer_data.stroke}
          stroke={
            specMode
              ? drawingLayer.layer_data.finish || FinishOptions[0].value
              : drawingLayer.layer_data.scolor
          }
          strokeEnabled={true}
          perfectDrawEnabled={false}
          paintingGuides={paintingGuides}
          guideData={guideData}
        />
      ) : (
        <></>
      )}
    </>
  );
});

export default Shapes;
