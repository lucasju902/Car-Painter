import React, { useState, useMemo, useCallback } from "react";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "components/MaterialUI";
import { basePaintAssetURL, legacyBasePaintAssetURL } from "helper";
import { ImageWithLoad, Loader } from "components/common";
import {
  CustomInfiniteScroll,
  CustomImageList,
  CustomImageListItem,
  useStyles,
} from "./BasePaintDialog.style";
import { NavLink } from "react-router-dom";

export const BasePaintDialog = React.memo((props) => {
  const step = 40;
  const classes = useStyles();
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
        <Box
          bgcolor="#666"
          p="10px 16px"
          borderRadius={10}
          border="2px solid navajowhite"
          position="relative"
          mb="10px"
        >
          <Typography>
            Select a base paint pattern to add. You can change the colors after
            selecting a pattern.
          </Typography>
        </Box>
        {legacyMode ? (
          <Box
            bgcolor="#666"
            p="10px 16px"
            borderRadius={10}
            border="2px solid navajowhite"
            position="relative"
            mb="10px"
          >
            <Typography>
              This project was created with an old version of Paint Builder.
            </Typography>

            <Typography>
              <NavLink to={`/?make=${carMake.id}`} className={classes.link}>
                Create a new project for more Base Paint options.
              </NavLink>
            </Typography>
          </Box>
        ) : (
          <></>
        )}
        <CustomInfiniteScroll
          dataLength={limit} //This is important field to render the next data
          next={increaseData}
          hasMore={hasMore}
          loader={<Loader />}
          scrollableTarget="base-paint-dialog-content"
        >
          <CustomImageList rowHeight={178} cols={3} spacing={8}>
            {bases.slice(0, limit).map((item, index) => (
              <CustomImageListItem
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
              </CustomImageListItem>
            ))}
          </CustomImageList>
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
