import React from "react";
import { Line } from "react-konva";
import { PaintingGuides } from "../../../constants";

import URLImage from "components/URLImage";
import config from "config";

const PaintingGuideTop = (props) => {
  const gridPadding = 10;
  const { paintingGuides, currentCarMake, handleImageSize, frameSize } = props;
  console.log(paintingGuides);
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
          listening={false}
        />
      ) : (
        <></>
      )}
      {paintingGuides.includes(PaintingGuides.WIREFRAME) ? (
        <URLImage
          src={`${
            config.assetsURL
          }/templates/${currentCarMake.folder_directory.replace(
            " ",
            "_"
          )}/wireframe.png`}
          tellSize={handleImageSize}
          listening={false}
        />
      ) : (
        <></>
      )}
      {paintingGuides.includes(PaintingGuides.GRID) ? (
        <>
          {Array.from(
            Array(Math.round(frameSize.width / gridPadding)),
            (e, i) => {
              return (
                <Line
                  key={`x-${i}`}
                  points={[
                    Math.round(i * gridPadding),
                    0,
                    Math.round(i * gridPadding),
                    frameSize.width,
                  ]}
                  stroke="#ddd"
                  strokeWidth={0.1}
                  listening={false}
                />
              );
            }
          )}
          {Array.from(
            Array(Math.round(frameSize.height / gridPadding)),
            (e, i) => {
              return (
                <Line
                  key={`y-${i}`}
                  points={[
                    0,
                    Math.round(i * gridPadding),
                    frameSize.height,
                    Math.round(i * gridPadding),
                  ]}
                  stroke="#ddd"
                  strokeWidth={0.1}
                  listening={false}
                />
              );
            }
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PaintingGuideTop;
