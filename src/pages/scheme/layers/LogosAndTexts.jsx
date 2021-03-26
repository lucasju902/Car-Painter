import React, { useEffect } from "react";

import URLImage from "components/URLImage";
import TextNode from "components/TextNode";
import { LayerTypes } from "../../../constants";
import Helper from "helper";
import config from "config";

const LogosAndTexts = (props) => {
  const {
    layers,
    fonts,
    handleImageSize,
    frameSize,
    currentLayer,
    setCurrentLayer,
    onChange,
  } = props;

  useEffect(() => {}, []);

  return (
    <>
      {layers
        .filter(
          (item) =>
            (item.layer_type === LayerTypes.LOGO ||
              item.layer_type === LayerTypes.UPLOAD ||
              item.layer_type === LayerTypes.TEXT) &&
            item.layer_visible
        )
        .sort((a, b) => Helper.sortBy(a, b, "layer_order"))
        .map((layer) =>
          layer.layer_type !== LayerTypes.TEXT ? (
            <URLImage
              src={`${config.assetsURL}/${layer.layer_data.source_file}`}
              tellSize={handleImageSize}
              key={layer.id}
              x={parseFloat(layer.layer_data.left)}
              y={parseFloat(layer.layer_data.top)}
              width={layer.layer_data.width}
              height={layer.layer_data.height}
              rotation={layer.layer_data.rotation}
              scaleX={layer.layer_data.flop === 0 ? 1 : -1}
              scaleY={layer.layer_data.flip === 0 ? 1 : -1}
              onSelect={() => setCurrentLayer(layer)}
              isSelected={currentLayer && currentLayer.id === layer.id}
              listening={!layer.layer_locked}
              onChange={(values) => onChange(layer, values)}
            />
          ) : (
            <TextNode
              text={layer.layer_data.text}
              fontFamily={
                fonts.length
                  ? fonts.find((font) => font.id === layer.layer_data.font)
                      .font_name
                  : null
              }
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
              height={layer.layer_data.height}
              rotation={layer.layer_data.rotation}
              scaleX={layer.layer_data.scaleX}
              scaleY={layer.layer_data.scaleY}
              onSelect={() => setCurrentLayer(layer)}
              isSelected={currentLayer && currentLayer.id === layer.id}
              listening={!layer.layer_locked}
              onChange={(values) => onChange(layer, values)}
            />
          )
        )}
    </>
  );
};

export default LogosAndTexts;
