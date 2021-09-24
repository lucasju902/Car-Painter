import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import config from "config";
import { FinishOptions, LayerTypes, MouseModes } from "constant";
import { getRelativeShadowOffset } from "helper";

import { GroupedURLImage, TextNode } from "components/konva";

export const LogosAndTexts = React.memo((props) => {
  const {
    stageRef,
    editable,
    layers,
    loadedFontList,
    loadedStatuses,
    fonts,
    frameSize,
    mouseMode,
    specMode,
    setCurrentLayer,
    boardRotate,
    paintingGuides,
    guideData,
    onChange,
    onFontLoad,
    onHover,
    onDblClick,
    onLoadLayer,
    onDragStart,
    onDragEnd,
  } = props;
  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layers.filter(
          (item) =>
            item.layer_type === LayerTypes.LOGO ||
            item.layer_type === LayerTypes.UPLOAD ||
            item.layer_type === LayerTypes.TEXT
        ),
        ["layer_order"],
        ["desc"]
      ),
    [layers]
  );
  const layerFont = useCallback(
    (layer) => {
      return fonts.length
        ? fonts.find((item) => item.id === layer.layer_data.font)
        : {};
    },
    [fonts]
  );
  const getShadowOffset = useCallback(
    (layer) => {
      return getRelativeShadowOffset(boardRotate, {
        x: layer.layer_data.shadowOffsetX,
        y: layer.layer_data.shadowOffsetY,
      });
    },
    [boardRotate]
  );

  return (
    <>
      {filteredLayers.map((layer) => {
        let shadowOffset = getShadowOffset(layer);

        if (layer.layer_type !== LayerTypes.TEXT) {
          return (
            <GroupedURLImage
              key={layer.id}
              id={layer.id}
              stageRef={stageRef}
              name={layer.id.toString()}
              editable={editable}
              src={`${config.assetsURL}/${layer.layer_data.source_file}`}
              loadedStatus={loadedStatuses[layer.id]}
              x={parseFloat(layer.layer_data.left || 0)}
              y={parseFloat(layer.layer_data.top || 0)}
              allowFit={true}
              width={layer.layer_data.width}
              height={layer.layer_data.height}
              frameSize={frameSize}
              rotation={layer.layer_data.rotation}
              boardRotate={boardRotate}
              scaleX={layer.layer_data.flop === 1 ? -1 : 1}
              scaleY={layer.layer_data.flip === 1 ? -1 : 1}
              filterColor={
                specMode
                  ? layer.layer_data.finish || FinishOptions[0].value
                  : null
              }
              shadowColor={
                specMode
                  ? layer.layer_data.finish || FinishOptions[0].value
                  : layer.layer_data.shadowColor
              }
              bgColor={
                specMode
                  ? layer.layer_data.bgColor
                    ? layer.layer_data.finish || FinishOptions[0].value
                    : null
                  : layer.layer_data.bgColor
              }
              paddingX={layer.layer_data.paddingX}
              paddingY={layer.layer_data.paddingY}
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
              opacity={layer.layer_data.opacity}
              layer_data={layer.layer_data}
              paintingGuides={paintingGuides}
              guideData={guideData}
              onSelect={() => setCurrentLayer(layer)}
              onDblClick={onDblClick}
              listening={
                !layer.layer_locked && mouseMode === MouseModes.DEFAULT
              }
              onChange={(values) => onChange(layer, values)}
              onHover={(flag) => onHover(layer, flag)}
              visible={layer.layer_visible ? true : false}
              onLoadLayer={onLoadLayer}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          );
        }
        let font = layerFont(layer);
        return (
          <TextNode
            key={layer.id}
            id={layer.id}
            editable={editable}
            stageRef={stageRef}
            frameSize={frameSize}
            name={layer.id.toString()}
            text={layer.layer_data.text}
            fontFamily={font.font_name}
            fontFile={
              font.font_file
                ? `url(${config.assetsURL}/${font.font_file})`
                : null
            }
            loadedFontList={loadedFontList}
            loadedStatus={loadedStatuses[layer.id]}
            onFontLoad={onFontLoad}
            fontSize={layer.layer_data.size}
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
            strokeEnabled={true}
            x={parseFloat(layer.layer_data.left || 0)}
            y={parseFloat(layer.layer_data.top || 0)}
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
            offsetX={0}
            offsetY={0}
            // width={layer.layer_data.width}
            // height={layer.layer_data.height}
            opacity={layer.layer_data.opacity}
            rotation={layer.layer_data.rotation}
            scaleX={
              (layer.layer_data.scaleX || 1) *
              (layer.layer_data.flop === 1 ? -1 : 1)
            }
            scaleY={
              (layer.layer_data.scaleY || 1) *
              (layer.layer_data.flip === 1 ? -1 : 1)
            }
            shadowColor={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.shadowColor
            }
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffset.x}
            shadowOffsetY={shadowOffset.y}
            visible={layer.layer_visible ? true : false}
            paintingGuides={paintingGuides}
            guideData={guideData}
            onSelect={() => setCurrentLayer(layer)}
            onDblClick={onDblClick}
            listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
            onChange={(values) => onChange(layer, values)}
            onHover={(flag) => onHover(layer, flag)}
            onLoadLayer={onLoadLayer}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        );
      })}
    </>
  );
});

export default LogosAndTexts;
