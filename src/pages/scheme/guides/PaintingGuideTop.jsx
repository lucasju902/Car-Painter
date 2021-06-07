import React from "react";
import { Line } from "react-konva";
import { PaintingGuides } from "constant";

import URLImage from "components/URLImage";
import config from "config";

const PaintingGuideTop = (props) => {
  const {
    paintingGuides,
    currentCarMake,
    handleImageSize,
    frameSize,
    guideData,
    loadedStatuses,
    onLoadLayer,
  } = props;
  const gridPadding = guideData.grid_padding || 10;
  const gridStroke = guideData.grid_stroke || 0.1;

  return (
    <>
      <URLImage
        id="guide-wireframe"
        loadedStatus={loadedStatuses["guide-wireframe"]}
        src={`${
          config.assetsURL
        }/templates/${currentCarMake.folder_directory.replace(
          " ",
          "_"
        )}/wireframe.png`}
        tellSize={handleImageSize}
        filterColor={guideData.wireframe_color}
        opacity={guideData.wireframe_opacity}
        listening={false}
        visible={
          paintingGuides.includes(PaintingGuides.WIREFRAME) ? true : false
        }
        onLoadLayer={onLoadLayer}
      />

      {Array.from(Array(Math.round(frameSize.width / gridPadding)), (e, i) => {
        return (
          <Line
            key={`x-${i}`}
            points={[
              Math.round(i * gridPadding),
              0,
              Math.round(i * gridPadding),
              frameSize.width,
            ]}
            stroke={guideData.grid_color || "#ddd"}
            opacity={guideData.grid_opacity || 1}
            strokeWidth={gridStroke}
            listening={false}
            visible={
              paintingGuides.includes(PaintingGuides.GRID) ? true : false
            }
          />
        );
      })}
      {Array.from(Array(Math.round(frameSize.height / gridPadding)), (e, i) => {
        return (
          <Line
            key={`y-${i}`}
            points={[
              0,
              Math.round(i * gridPadding),
              frameSize.height,
              Math.round(i * gridPadding),
            ]}
            stroke={guideData.grid_color || "#ddd"}
            opacity={guideData.grid_opacity || 1}
            strokeWidth={gridStroke}
            listening={false}
            visible={
              paintingGuides.includes(PaintingGuides.GRID) ? true : false
            }
          />
        );
      })}
    </>
  );
};

export default React.memo(PaintingGuideTop);
