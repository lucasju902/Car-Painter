import React from "react";
import { PaintingGuides } from "../../../constants";

import URLImage from "components/URLImage";
import config from "config";

const PaintingGuideBottom = (props) => {
  const { paintingGuides, currentCarMake, handleImageSize } = props;

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
          listening={false}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default PaintingGuideBottom;
