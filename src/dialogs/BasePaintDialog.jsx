import React, { useState, useMemo, useCallback } from "react";

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
import { basePaintAssetURL, legacyBasePaintAssetURL } from "helper";

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
  const step = 30;
  const [limit, setLimit] = useState(step);
  const { legacyMode, basePaints, carMake, onCancel, open, onOpenBase } = props;
  const bases = useMemo(
    () =>
      legacyMode
        ? basePaints
        : Array.from({ length: carMake.total_bases }, (_, i) => i + 1),
    [legacyMode, basePaints, carMake]
  );
  const hasMore = useMemo(
    () =>
      legacyMode ? limit < basePaints.length : limit < carMake.total_bases,
    [legacyMode, limit, basePaints, carMake]
  );

  const getPreviewURL = useCallback(
    (base) => {
      return legacyMode
        ? legacyBasePaintAssetURL(base) + "preview.jpg" // For Legacy basepaint
        : basePaintAssetURL(carMake, base) + "preview.jpg";
    },
    [legacyMode, carMake]
  );
  const getTitle = useCallback(
    (base) => {
      return legacyMode ? base.base_name : `Base Paint ${base}`;
    },
    [legacyMode]
  );
  const getDescription = useCallback(
    (base) => {
      return legacyMode ? base.base_description : carMake.name_short;
    },
    [legacyMode, carMake]
  );

  const increaseData = useCallback(() => {
    setLimit(limit + step);
  }, [limit, step, setLimit]);

  return (
    <Dialog aria-labelledby="base-paints-title" open={open} onClose={onCancel}>
      <DialogTitle id="base-paints-title">Select Base Paint</DialogTitle>
      <DialogContent dividers id="base-paint-dialog-content">
        <CustomInfiniteScroll
          dataLength={limit} //This is important field to render the next data
          next={increaseData}
          hasMore={hasMore}
          loader={<Loader />}
          scrollableTarget="base-paint-dialog-content"
        >
          <CustomGridList cellHeight={178} cols={3}>
            {bases.slice(0, limit).map((item, index) => (
              <CustomGridListTile
                key={index}
                cols={1}
                onClick={() => onOpenBase(item)}
              >
                <CustomImg src={getPreviewURL(item)} alt={getTitle(item)} />
                <GridListTileBar
                  title={getTitle(item)}
                  subtitle={getDescription(item)}
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
