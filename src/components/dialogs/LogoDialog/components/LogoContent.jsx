import React, { useState, useMemo, useCallback } from "react";

import { Box, ImageListItemBar } from "components/MaterialUI";
import { ImageWithLoad, Loader } from "components/common";
import config from "config";

import {
  CustomInfiniteScroll,
  CustomImageList,
  CustomImageListItem,
} from "./common.style";

export const LogoContent = React.memo((props) => {
  const { step, logos, search, onOpen } = props;
  const [logoLimit, setLogoLimit] = useState(step);

  const filteredLogos = useMemo(
    () =>
      logos.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          item.type !== "flag"
      ),
    [logos, search]
  );

  const increaseLogoData = useCallback(() => {
    setLogoLimit(logoLimit + step);
  }, [logoLimit, step, setLogoLimit]);

  return (
    <Box id="logo-dialog-content" overflow="auto" height="70vh">
      <CustomInfiniteScroll
        dataLength={logoLimit} //This is important field to render the next data
        next={increaseLogoData}
        hasMore={logoLimit < filteredLogos.length}
        loader={<Loader />}
        scrollableTarget="logo-dialog-content"
      >
        <CustomImageList rowHeight={178} cols={3}>
          {filteredLogos.slice(0, logoLimit).map((logo) => (
            <CustomImageListItem
              key={logo.id}
              cols={1}
              onClick={() => onOpen(logo)}
            >
              <ImageWithLoad
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
