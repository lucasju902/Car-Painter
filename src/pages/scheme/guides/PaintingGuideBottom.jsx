import React, { useCallback } from "react";
import { PaintingGuides } from "constant";

import URLImage from "components/URLImage";
import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";

const PaintingGuideBottom = (props) => {
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
    <>
      <URLImage
        id="guide-sponsorblocks"
        loadedStatus={loadedStatuses["guide-sponsorblocks"]}
        src={getCarMakeImage("sponsor_blocks.png")}
        tellSize={handleImageSize}
        filterColor={guideData.sponsor_color}
        opacity={guideData.sponsor_opacity}
        listening={false}
        visible={
          paintingGuides.includes(PaintingGuides.SPONSORBLOCKS) ? true : false
        }
        onLoadLayer={onLoadLayer}
      />

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
    </>
  );
};

export default React.memo(PaintingGuideBottom);
