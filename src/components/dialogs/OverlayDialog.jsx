import React, { useState, useMemo, useCallback } from "react";
import config from "config";

import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  GridList,
  GridListTile,
  GridListTileBar,
} from "@material-ui/core";
import { ImageWithLoad, Loader, SearchBox } from "components/common";

const Button = styled(MuiButton)(spacing);

const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

const CustomGridList = styled(GridList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
const CustomGridListTile = styled(GridListTile)`
  cursor: pointer;
`;
const CustomDialogContent = styled(DialogContent)`
  width: 600px;
`;

export const OverlayDialog = React.memo((props) => {
  const step = 30;
  const [limit, setLimit] = useState(step);
  const [search, setSearch] = useState("");
  const { overlays, onCancel, open, onOpenOverlay } = props;

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
      <DialogTitle id="shape-title">Insert Overlay</DialogTitle>
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
                  <ImageWithLoad
                    src={`${config.assetsURL}/${shape.overlay_thumb}`}
                    alt={shape.name}
                  />
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
