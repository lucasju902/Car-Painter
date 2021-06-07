import React from "react";
import { PaintingGuides } from "constant";

import URLImage from "components/URLImage";
import config from "config";

const PaintingGuideCarMask = (props) => {
  const {
    paintingGuides,
    currentCarMake,
    handleImageSize,
    guideData,
    loadedStatuses,
    onLoadLayer,
  } = props;

  return (
    <URLImage
      id="guide-mask"
      loadedStatus={loadedStatuses["guide-mask"]}
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
      visible={paintingGuides.includes(PaintingGuides.CARMASK) ? true : false}
      onLoadLayer={onLoadLayer}
    />
  );
};

export default React.memo(PaintingGuideCarMask);
