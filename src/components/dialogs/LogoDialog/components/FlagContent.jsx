import React, { useState, useMemo, useCallback } from "react";

import { Box, ImageListItemBar } from "components/MaterialUI";
import { Loader } from "components/common";
import config from "config";

import {
  CustomInfiniteScroll,
  CustomImageList,
  CustomImageListItem,
  CustomImg,
} from "./common.style";

export const FlagContent = React.memo((props) => {
  const { step, logos, search, onOpen } = props;
  const [flagLimit, setFlagLimit] = useState(step);

  const filteredFlags = useMemo(
    () =>
      logos.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          item.type === "flag"
      ),
    [logos, search]
  );

  const increaseFlagData = useCallback(() => {
    setFlagLimit(flagLimit + step);
  }, [flagLimit, step, setFlagLimit]);

  return (
    <Box id="flag-dialog-content" overflow="auto" height="70vh">
      <CustomInfiniteScroll
        dataLength={flagLimit} //This is important field to render the next data
        next={increaseFlagData}
        hasMore={flagLimit < filteredFlags.length}
        loader={<Loader />}
        scrollableTarget="flag-dialog-content"
      >
        <CustomImageList rowHeight={178} cols={3}>
          {filteredFlags.slice(0, flagLimit).map((logo) => (
            <CustomImageListItem
              key={logo.id}
              cols={1}
              onClick={() => onOpen(logo)}
            >
              <CustomImg
                src={`${config.assetsURL}/${logo.preview_file}`}
                alt={logo.name}
              />
              <ImageListItemBar title={logo.name} />
            </CustomImageListItem>
          ))}
        </CustomImageList>
      </CustomInfiniteScroll>
    </Box>
  );
});
