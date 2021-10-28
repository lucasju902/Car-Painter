import React, { useCallback, useMemo } from "react";
import { FinishOptions } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";

export const SpecPaintingGuideCarMask = React.memo((props) => {
  const {
    finishBase = FinishOptions[0].base,
    legacyMode,
    carMake,
    handleImageSize,
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

  const src = useMemo(() => getCarMakeImage(`spec/${finishBase}.png`), [
    finishBase,
    getCarMakeImage,
  ]);

  return (
    <URLImage
      id={`guide-mask-${finishBase}`}
      key={`guide-mask-${finishBase}`}
      loadedStatus={loadedStatuses[`guide-mask-${finishBase}`]}
      src={src}
      x={0}
      y={0}
      width={legacyMode ? 1024 : 2048}
      height={legacyMode ? 1024 : 2048}
      tellSize={handleImageSize}
      opacity={1}
      listening={false}
      visible={true}
      onLoadLayer={onLoadLayer}
    />
  );
});

export default SpecPaintingGuideCarMask;
