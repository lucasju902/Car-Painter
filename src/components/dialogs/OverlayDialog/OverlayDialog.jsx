import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import config from "config";
import _ from "lodash";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  ImageListItemBar,
} from "components/MaterialUI";
import {
  ImageWithLoad,
  SVGImageWithLoad,
  Loader,
  SearchBox,
} from "components/common";
import {
  CustomInfiniteScroll,
  CustomImageList,
  CustomImageListItem,
  CustomDialogContent,
} from "./OverlayDialog.style";

export const OverlayDialog = React.memo((props) => {
  const step = 30;
  const [limit, setLimit] = useState(step);
  const [search, setSearch] = useState("");
  const { overlays, onCancel, open, onOpenOverlay } = props;
  const guide_data = useSelector(
    (state) => state.schemeReducer.current.guide_data
  );

  const increaseData = useCallback(() => {
    setLimit(limit + step);
  }, [limit, step, setLimit]);

  const handleSearchChange = useCallback((value) => setSearch(value), []);

  const filteredOverlays = useMemo(
    () =>
      _.orderBy(overlays, ["name"], ["asc"]).filter(
        (item) =>
          !item.legacy_mode &&
          (item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase()))
      ),
    [overlays, search]
  );

  return (
    <Dialog aria-labelledby="shape-title" open={open} onClose={onCancel}>
      <DialogTitle id="shape-title">Insert Graphics</DialogTitle>
      <CustomDialogContent dividers>
        <Box mb={2}>
          <SearchBox value={search} onChange={handleSearchChange} />
        </Box>
        <Box
          id="shape-dialog-content"
          overflow="auto"
          height="calc(100vh - 300px)"
        >
          <CustomInfiniteScroll
            dataLength={limit} //This is important field to render the next data
            next={increaseData}
            hasMore={limit < filteredOverlays.length}
            loader={<Loader />}
            scrollableTarget="shape-dialog-content"
          >
            <CustomImageList rowHeight={178} cols={3}>
              {filteredOverlays.slice(0, limit).map((shape) => (
                <CustomImageListItem
                  key={shape.id}
                  cols={1}
                  onClick={() => onOpenOverlay(shape)}
                >
                  {shape.overlay_thumb.includes(".svg") ? (
                    <SVGImageWithLoad
                      src={`${config.assetsURL}/${shape.overlay_thumb}`}
                      alt={shape.name}
                      options={{
                        color: guide_data.default_shape_color,
                        opacity: guide_data.default_shape_opacity || 1,
                        stroke: guide_data.default_shape_scolor,
                        strokeWidth:
                          (guide_data.default_shape_stroke != null
                            ? guide_data.default_shape_stroke
                            : 1) * shape.stroke_scale,
                      }}
                    />
                  ) : (
                    <ImageWithLoad
                      src={`${config.assetsURL}/${shape.overlay_thumb}`}
                      alt={shape.name}
                    />
                  )}
                  <ImageListItemBar
                    title={shape.name}
                    subtitle={shape.description}
                  />
                </CustomImageListItem>
              ))}
            </CustomImageList>
          </CustomInfiniteScroll>
        </Box>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default OverlayDialog;
