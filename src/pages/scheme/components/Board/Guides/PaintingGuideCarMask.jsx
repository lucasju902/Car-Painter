import React, { useCallback, useMemo } from "react";
import { PaintingGuides } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";

export const PaintingGuideCarMask = React.memo((props) => {
  const {
    specMode,
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

  const src = useMemo(() => getCarMakeImage("mask.png"), [getCarMakeImage]);

  const visible = useMemo(
    () =>
      !specMode && paintingGuides.includes(PaintingGuides.CARMASK)
        ? true
        : false,
    [paintingGuides, specMode]
  );

  return (
    <URLImage
      key="guide-mask"
      id="guide-mask"
      loadedStatus={loadedStatuses["guide-mask"]}
      src={src}
      x={0}
      y={0}
      tellSize={handleImageSize}
      filterColor={guideData.carmask_color}
      opacity={guideData.carmask_opacity}
      listening={false}
      visible={visible}
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideCarMask;
