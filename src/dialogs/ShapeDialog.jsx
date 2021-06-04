import React, { useState } from "react";

import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
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
import SearchBox from "components/SearchBox";
import config from "config";

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
const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;

const ShapeDialog = (props) => {
  const step = 15;
  const [limit, setLimit] = useState(step);
  const [search, setSearch] = useState("");
  const { shapes, onCancel, open, onOpenShape } = props;

  const increaseData = () => {
    setLimit(limit + step);
  };

  const filteredShapes = shapes.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog aria-labelledby="shape-title" open={open} onClose={onCancel}>
      <DialogTitle id="shape-title">Insert Shape</DialogTitle>
      <CustomDialogContent dividers>
        <Box mb={2}>
          <SearchBox value={search} onChange={(value) => setSearch(value)} />
        </Box>
        <Box id="shape-dialog-content" overflow="auto" height="70vh">
          <CustomInfiniteScroll
            dataLength={limit} //This is important field to render the next data
            next={increaseData}
            hasMore={limit < filteredShapes.length}
            loader={<Loader />}
            scrollableTarget="shape-dialog-content"
          >
            <CustomGridList cellHeight={178} cols={3}>
              {filteredShapes.slice(0, limit).map((shape) => (
                <CustomGridListTile
                  key={shape.id}
                  cols={1}
                  onClick={() => onOpenShape(shape)}
                >
                  <CustomImg
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
};

export default React.memo(ShapeDialog);
