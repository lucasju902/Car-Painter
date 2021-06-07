import React from "react";
import { PaintingGuides } from "constant";

import URLImage from "components/URLImage";
import config from "config";

const PaintingGuideBottom = (props) => {
  const {
    paintingGuides,
    currentCarMake,
    handleImageSize,
    guideData,
    loadedStatuses,
    onLoadLayer,
  } = props;

  return (
    <>
      <URLImage
        id="guide-sponsorblocks"
        loadedStatus={loadedStatuses["guide-sponsorblocks"]}
        src={`${
          config.assetsURL
        }/templates/${currentCarMake.folder_directory.replace(
          " ",
          "_"
        )}/sponsor_blocks.png`}
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
        src={`${
          config.assetsURL
        }/templates/${currentCarMake.folder_directory.replace(
          " ",
          "_"
        )}/number_blocks.png`}
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
