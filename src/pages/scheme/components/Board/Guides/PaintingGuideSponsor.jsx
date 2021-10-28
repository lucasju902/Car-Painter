import React, { useCallback } from "react";
import { PaintingGuides } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";

export const PaintingGuideSponsor = React.memo((props) => {
  const {
    legacyMode,
    paintingGuides,
    carMake,
    handleImageSize,
    guideData,
    loadedStatuses,
    onLoadLayer,
  } = props;

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
    <URLImage
      id="guide-sponsorblocks"
      loadedStatus={loadedStatuses["guide-sponsorblocks"]}
      src={getCarMakeImage("sponsor_blocks.png")}
      x={0}
      y={0}
      width={legacyMode ? 1024 : 2048}
      height={legacyMode ? 1024 : 2048}
      tellSize={handleImageSize}
      filterColor={guideData.sponsor_color}
      opacity={guideData.sponsor_opacity}
      listening={false}
      visible={
        paintingGuides.includes(PaintingGuides.SPONSORBLOCKS) ? true : false
      }
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideSponsor;
