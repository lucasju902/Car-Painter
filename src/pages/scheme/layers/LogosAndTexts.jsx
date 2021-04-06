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
    currentLayer,
    setCurrentLayer,
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
        if (layer.layer_type !== LayerTypes.TEXT) {
          return (
            <URLImage
              name={layer.id.toString()}
              src={`${config.assetsURL}/${layer.layer_data.source_file}`}
              key={layer.id}
              x={parseFloat(layer.layer_data.left)}
              y={parseFloat(layer.layer_data.top)}
              width={layer.layer_data.width}
              height={layer.layer_data.height}
              rotation={layer.layer_data.rotation}
              scaleX={layer.layer_data.flop === 1 ? -1 : 1}
              scaleY={layer.layer_data.flip === 1 ? -1 : 1}
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
            x={parseFloat(layer.layer_data.left)}
            y={parseFloat(layer.layer_data.top)}
            offsetX={0}
            offsetY={0}
            width={layer.layer_data.width}
            rotation={layer.layer_data.rotation}
            scaleX={layer.layer_data.flop === 1 ? -1 : 1}
            scaleY={layer.layer_data.flip === 1 ? -1 : 1}
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
