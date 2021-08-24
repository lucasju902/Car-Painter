import React, { useCallback } from "react";
import { PaintingGuides } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";

export const PaintingGuideNumber = React.memo((props) => {
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
      id="guide-numberblocks"
      loadedStatus={loadedStatuses["guide-numberblocks"]}
      src={getCarMakeImage("number_blocks.png")}
      tellSize={handleImageSize}
      filterColor={guideData.numberblock_color}
      opacity={guideData.numberblock_opacity}
      listening={false}
      visible={
        paintingGuides.includes(PaintingGuides.NUMBERBLOCKS) ? true : false
      }
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideNumber;
