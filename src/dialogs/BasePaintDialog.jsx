import React, { useState } from "react";

import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import { spacing } from "@material-ui/system";
import {
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  GridList,
  GridListTile,
  GridListTileBar,
} from "@material-ui/core";
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
const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;

const BasePaintDialog = React.memo((props) => {
  const step = 15;
  const [limit, setLimit] = useState(step);
  const { basePaints, onCancel, open, onOpenBase } = props;

  const increaseData = () => {
    setLimit(limit + step);
  };
  return (
    <Dialog aria-labelledby="base-paints-title" open={open} onClose={onCancel}>
      <DialogTitle id="base-paints-title">Select Base Paint</DialogTitle>
      <DialogContent dividers id="base-paint-dialog-content">
        <CustomInfiniteScroll
          dataLength={limit} //This is important field to render the next data
          next={increaseData}
          hasMore={limit < basePaints.length}
          loader={<Loader />}
          scrollableTarget="base-paint-dialog-content"
        >
          <CustomGridList cellHeight={178} cols={3}>
            {basePaints.slice(0, limit).map((basepaint) => (
              <CustomGridListTile
                key={basepaint.id}
                cols={1}
                onClick={() => onOpenBase(basepaint)}
              >
                <CustomImg
                  src={`${config.assetsURL}/bases/${basepaint.id}/preview.jpg`}
                  alt={basepaint.base_description}
                />
                <GridListTileBar
                  title={basepaint.base_name}
                  subtitle={basepaint.base_description}
                />
              </CustomGridListTile>
            ))}
          </CustomGridList>
        </CustomInfiniteScroll>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default BasePaintDialog;
