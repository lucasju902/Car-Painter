import React, { useCallback } from "react";
import { PaintingGuides } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";

export const PaintingGuideCarMask = React.memo((props) => {
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
      id="guide-mask"
      loadedStatus={loadedStatuses["guide-mask"]}
      src={getCarMakeImage("mask.png")}
      tellSize={handleImageSize}
      filterColor={guideData.carmask_color}
      opacity={guideData.carmask_opacity}
      listening={false}
      visible={paintingGuides.includes(PaintingGuides.CARMASK) ? true : false}
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideCarMask;
