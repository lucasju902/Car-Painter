import React from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "constant";
import config from "config";

const Overlays = (props) => {
  const { layers, currentLayer, setCurrentLayer, onChange } = props;

  return (
    <>
      {_.orderBy(
        layers.filter(
          (item) => item.layer_type === LayerTypes.OVERLAY && item.layer_visible
        ),
        ["layer_order"],
        ["desc"]
      ).map((layer) => (
        <URLImage
          name={layer.id.toString()}
          src={`${config.assetsURL}/${layer.layer_data.source_file}`}
          key={layer.id}
          x={parseFloat(layer.layer_data.left)}
          y={parseFloat(layer.layer_data.top)}
          width={layer.layer_data.width}
          height={layer.layer_data.height}
          rotation={layer.layer_data.rotation}
          opacity={layer.layer_data.opacity}
          scaleX={layer.layer_data.flop === 1 ? -1 : 1}
          scaleY={layer.layer_data.flip === 1 ? -1 : 1}
          onSelect={() => setCurrentLayer(layer)}
          isSelected={currentLayer && currentLayer.id === layer.id}
          listening={!layer.layer_locked}
          onChange={(values) => onChange(layer, values)}
        />
      ))}
    </>
  );
};

export default Overlays;
