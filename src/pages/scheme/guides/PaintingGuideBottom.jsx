import React from "react";
import { PaintingGuides } from "constant";

import URLImage from "components/URLImage";
import config from "config";

const PaintingGuideBottom = (props) => {
  const { paintingGuides, currentCarMake, handleImageSize, guideData } = props;

  return (
    <>
      {paintingGuides.includes(PaintingGuides.SPONSORBLOCKS) ? (
        <URLImage
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
        />
      ) : (
        <></>
      )}
      {paintingGuides.includes(PaintingGuides.NUMBERBLOCKS) ? (
        <URLImage
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
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default PaintingGuideBottom;
