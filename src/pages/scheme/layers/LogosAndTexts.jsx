import React from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import TextNode from "components/TextNode";
import { LayerTypes } from "constant";
import config from "config";

const LogosAndTexts = (props) => {
  const {
    layers,
    loadedFontList,
    fonts,
    frameSize,
    currentLayer,
    setCurrentLayer,
    boardRotate,
    onChange,
    onFontLoad,
  } = props;
  const filteredLayers = layers.filter(
    (item) =>
      (item.layer_type === LayerTypes.LOGO ||
        item.layer_type === LayerTypes.UPLOAD ||
        item.layer_type === LayerTypes.TEXT) &&
      item.layer_visible
  );

  return (
    <>
      {_.orderBy(filteredLayers, ["layer_order"], ["desc"]).map((layer) => {
        let shadowOffsetX = layer.layer_data.shadowOffsetX;
        let shadowOffsetY = layer.layer_data.shadowOffsetY;
        if (boardRotate === 90) {
          shadowOffsetX = -layer.layer_data.shadowOffsetY;
          shadowOffsetY = layer.layer_data.shadowOffsetX;
        } else if (boardRotate === 180) {
          shadowOffsetX = -layer.layer_data.shadowOffsetX;
          shadowOffsetY = -layer.layer_data.shadowOffsetY;
        } else if (boardRotate === 270) {
          shadowOffsetX = layer.layer_data.shadowOffsetY;
          shadowOffsetY = -layer.layer_data.shadowOffsetX;
        }

        if (layer.layer_type !== LayerTypes.TEXT) {
          return (
            <URLImage
              name={layer.id.toString()}
              src={`${config.assetsURL}/${layer.layer_data.source_file}`}
              key={layer.id}
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
              shadowColor={layer.layer_data.shadowColor}
              shadowBlur={layer.layer_data.shadowBlur}
              shadowOpacity={layer.layer_data.shadowOpacity}
              shadowOffsetX={shadowOffsetX}
              shadowOffsetY={shadowOffsetY}
              opacity={layer.layer_data.opacity}
              onSelect={() => setCurrentLayer(layer)}
              isSelected={currentLayer && currentLayer.id === layer.id}
              listening={!layer.layer_locked}
              onChange={(values) => onChange(layer, values)}
            />
          );
        }
        let font = fonts.length
          ? fonts.find((item) => item.id === layer.layer_data.font)
          : {};
        return (
          <TextNode
            name={layer.id.toString()}
            text={layer.layer_data.text}
            fontFamily={font.font_name}
            fontFile={
              font.font_file
                ? `url(${config.assetsURL}/${font.font_file})`
                : null
            }
            loadedFontList={loadedFontList}
            onFontLoad={onFontLoad}
            fontSize={layer.layer_data.size}
            fill={layer.layer_data.color}
            strokeWidth={layer.layer_data.stroke}
            stroke={layer.layer_data.scolor}
            strokeEnabled={true}
            key={layer.id}
            x={parseFloat(layer.layer_data.left || 0)}
            y={parseFloat(layer.layer_data.top || 0)}
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
            shadowColor={layer.layer_data.shadowColor}
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffsetX}
            shadowOffsetY={shadowOffsetY}
            onSelect={() => setCurrentLayer(layer)}
            isSelected={currentLayer && currentLayer.id === layer.id}
            listening={!layer.layer_locked}
            onChange={(values) => onChange(layer, values)}
          />
        );
      })}
    </>
  );
};

export default LogosAndTexts;
