import React, { useCallback } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "components/MaterialUI";
import { Warning } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { getDownloaderStatus } from "redux/reducers/downloaderReducer";

export const SimPreviewGuideDialog = React.memo((props) => {
  const { open, onCancel } = props;
  const dispatch = useDispatch();
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const iracing = useSelector((state) => state.downloaderReducer.iracing);
  const downloaderChecking = useSelector(
    (state) => state.downloaderReducer.loading
  );

  const handleCheckDownloader = useCallback(() => {
    dispatch(getDownloaderStatus());
  }, [dispatch]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle>Sim Preview</DialogTitle>
      <DialogContent dividers id="seam-preview-dialog-content">
        <Typography>
          Preview your Paint Builder project in the iRacing sim!
        </Typography>
        <Box>
          <ol>
            <Typography component="li">
              Ensure the{" "}
              <a
                href="https://www.tradingpaints.com/install"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#f48fb1", textDecoration: "none" }}
              >
                Trading Paints downloader program
              </a>{" "}
              is installed, open, and running on your computer. If it’s not
              detected, click this button to prompt Paint Builder to try
              detecting it again:
              <Button
                variant="outlined"
                color="secondary"
                disabled={downloaderChecking}
                onClick={handleCheckDownloader}
                style={{ marginLeft: "4px" }}
              >
                {downloaderChecking ? (
                  <CircularProgress size={17} style={{ color: "#f48fb1" }} />
                ) : (
                  <Typography variant="body2">CHECK</Typography>
                )}
              </Button>
            </Typography>
            <Typography component="li">
              Ensure “Automatically refresh paints” is checked and the option is
              saved.
            </Typography>
            <Typography component="li">
              Open an iRacing session where you’re driving the{" "}
              {currentCarMake.name}
            </Typography>
            <Typography component="li">
              Once Trading Paints and iRacing are running, the Sim Preview
              button should activate.
            </Typography>
            <Typography component="li">
              Ensure your car is not parked in the pits—otherwise, iRacing will
              not refresh paints. You may need to drive forward a bit, get out
              of the car, and move the replay to the point when you drove out of
              your pit stall.
            </Typography>
            <Typography component="li">
              Press the “Sim Preview” button inside Paint Builder. This will
              send the current progress of your paint to iRacing and reload the
              car in the sim. This may take a few seconds—your car will briefly
              turn white and then show the latest version of your Paint Builder
              paint.
            </Typography>
          </ol>
        </Box>
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between" }}>
        <Typography style={{ display: "flex", alignItems: "center" }}>
          {!iracing ? (
            <Warning
              style={{
                marginRight: "4px",
                marginLeft: "8px",
                fontSize: "20px",
              }}
            />
          ) : (
            <></>
          )}{" "}
          {iracing === false
            ? "Trading Paints downloader program is running but you are not in a iRacing session"
            : !iracing
            ? "Trading Paints downloader program is not running"
            : ""}
        </Typography>
        <Button onClick={onCancel} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default SimPreviewGuideDialog;
