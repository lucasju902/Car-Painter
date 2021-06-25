import React, { useCallback, useMemo } from "react";
import { Line } from "react-konva";
import { PaintingGuides } from "constant";

import URLImage from "components/URLImage";
import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";

const PaintingGuideTop = (props) => {
  const {
    legacyMode,
    paintingGuides,
    carMake,
    handleImageSize,
    frameSize,
    guideData,
    loadedStatuses,
    onLoadLayer,
  } = props;
  const gridPadding = useMemo(() => guideData.grid_padding || 10, [guideData]);
  const gridStroke = useMemo(() => guideData.grid_stroke || 0.1, [guideData]);

  const getCarMakeImage = useCallback(
    (image) => {
      return (
        (legacyMode
          ? legacyCarMakeAssetURL(carMake)
          : carMakeAssetURL(carMake)) + image
      );
    },
    [legacyMode, carMake]
  );

  return (
    <>
      <URLImage
        id="guide-wireframe"
        loadedStatus={loadedStatuses["guide-wireframe"]}
        src={getCarMakeImage("wireframe.png")}
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
