import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import config from "config";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  GridListTileBar,
} from "components/MaterialUI";
import {
  ImageWithLoad,
  SVGImageWithLoad,
  Loader,
  SearchBox,
} from "components/common";
import {
  CustomInfiniteScroll,
  CustomGridList,
  CustomGridListTile,
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

  const filteredOverlays = useMemo(
    () =>
      overlays.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      ),
    [overlays, search]
  );

  return (
    <Dialog aria-labelledby="shape-title" open={open} onClose={onCancel}>
      <DialogTitle id="shape-title">Insert Graphics</DialogTitle>
      <CustomDialogContent dividers>
        <Box mb={2}>
          <SearchBox value={search} onChange={(value) => setSearch(value)} />
        </Box>
        <Box id="shape-dialog-content" overflow="auto" height="70vh">
          <CustomInfiniteScroll
            dataLength={limit} //This is important field to render the next data
            next={increaseData}
            hasMore={limit < filteredOverlays.length}
            loader={<Loader />}
            scrollableTarget="shape-dialog-content"
          >
            <CustomGridList cellHeight={178} cols={3}>
              {filteredOverlays.slice(0, limit).map((shape) => (
                <CustomGridListTile
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
                          guide_data.default_shape_stroke *
                            shape.stroke_scale || 0,
                      }}
                    />
                  ) : (
                    <ImageWithLoad
                      src={`${config.assetsURL}/${shape.overlay_thumb}`}
                      alt={shape.name}
                    />
                  )}
                  <GridListTileBar
                    title={shape.name}
                    subtitle={shape.description}
                  />
                </CustomGridListTile>
              ))}
            </CustomGridList>
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
