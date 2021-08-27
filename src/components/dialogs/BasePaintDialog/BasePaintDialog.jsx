import React, { useState, useMemo, useCallback } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "components/MaterialUI";
import { basePaintAssetURL, legacyBasePaintAssetURL } from "helper";
import { ImageWithLoad, Loader } from "components/common";
import {
  CustomInfiniteScroll,
  CustomGridList,
  CustomGridListTile,
} from "./BasePaintDialog.style";

export const BasePaintDialog = React.memo((props) => {
  const step = 30;
  const [limit, setLimit] = useState(step);
  const { legacyMode, basePaints, carMake, onCancel, open, onOpenBase } = props;
  const bases = useMemo(
    () =>
      !carMake
        ? []
        : legacyMode
        ? basePaints
        : Array.from({ length: carMake.total_bases }, (_, i) => i + 1),
    [legacyMode, basePaints, carMake]
  );
  const hasMore = useMemo(
    () =>
      !carMake
        ? false
        : legacyMode
        ? limit < basePaints.length
        : limit < carMake.total_bases,
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
          <CustomGridList cellHeight={178} cols={3} spacing={8}>
            {bases.slice(0, limit).map((item, index) => (
              <CustomGridListTile
                key={index}
                cols={1}
                onClick={() => onOpenBase(item)}
              >
                <ImageWithLoad
                  src={getPreviewURL(item)}
                  alt={getTitle(item)}
                  minHeight="100px"
                  minWidth="100px"
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
