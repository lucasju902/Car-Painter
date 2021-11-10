import React, { useState, useMemo, useCallback } from "react";

import { Box, GridListTileBar } from "components/MaterialUI";
import { ImageWithLoad, Loader } from "components/common";

import {
  CustomInfiniteScroll,
  CustomGridList,
  CustomGridListTile,
} from "./common.style";
import { getNameFromUploadFileName, uploadAssetURL } from "helper";

export const UploadContent = React.memo((props) => {
  const { step, uploads, search, user, onOpen } = props;
  const [uploadsLimit, setUploadsLimit] = useState(step);

  const filteredUploads = useMemo(
    () =>
      uploads.filter((item) =>
        getNameFromUploadFileName(item.file_name, user)
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [uploads, user, search]
  );

  const increaseLogoData = useCallback(() => {
    setUploadsLimit(uploadsLimit + step);
  }, [uploadsLimit, step, setUploadsLimit]);

  return (
    <Box id="logo-dialog-content" overflow="auto" height="70vh">
      <CustomInfiniteScroll
        dataLength={uploadsLimit} //This is important field to render the next data
        next={increaseLogoData}
        hasMore={uploadsLimit < filteredUploads.length}
        loader={<Loader />}
        scrollableTarget="logo-dialog-content"
      >
        <CustomGridList cellHeight={178} cols={3}>
          {filteredUploads.slice(0, uploadsLimit).map((uploadItem) => (
            <CustomGridListTile
              key={uploadItem.id}
              cols={1}
              onClick={() => onOpen(uploadItem)}
            >
              <ImageWithLoad
                src={uploadAssetURL(uploadItem)}
                alt={getNameFromUploadFileName(uploadItem.file_name, user)}
              />
              <GridListTileBar
                title={getNameFromUploadFileName(uploadItem.file_name, user)}
              />
            </CustomGridListTile>
          ))}
        </CustomGridList>
      </CustomInfiniteScroll>
    </Box>
  );
});
