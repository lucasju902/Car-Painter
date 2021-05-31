import React from "react";
import { PaintingGuides } from "constant";

import URLImage from "components/URLImage";
import config from "config";

const PaintingGuideCarMask = (props) => {
  const { paintingGuides, currentCarMake, handleImageSize, guideData } = props;

  return (
    <>
      {paintingGuides.includes(PaintingGuides.CARMASK) ? (
        <URLImage
          src={`${
            config.assetsURL
          }/templates/${currentCarMake.folder_directory.replace(
            " ",
            "_"
          )}/mask.png`}
          tellSize={handleImageSize}
          filterColor={guideData.carmask_color}
          opacity={guideData.carmask_opacity}
          listening={false}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default PaintingGuideCarMask;
