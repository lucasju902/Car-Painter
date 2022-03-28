import React, { useCallback, useState, useEffect } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from "components/MaterialUI";
import { Warning, Check } from "@material-ui/icons";
import { NumberModSwitch } from "components/common";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getDownloaderStatus } from "redux/reducers/downloaderReducer";

export const SimPreviewGuideDialog = React.memo((props) => {
  const { open, applying, onApply, onCancel } = props;

  const dispatch = useDispatch();
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const iracing = useSelector((state) => state.downloaderReducer.iracing);
  const downloaderChecking = useSelector(
    (state) => state.downloaderReducer.loading
  );
  const [isCustomNumber, setIsCustomNumber] = useState(
    currentScheme.last_number
  );

  const handleSubmit = useCallback(() => {
    onApply(isCustomNumber);
  }, [isCustomNumber, onApply]);

  const handleCheckDownloader = useCallback(() => {
    dispatch(getDownloaderStatus());
  }, [dispatch]);

  useEffect(() => {
    setIsCustomNumber(currentScheme.last_number);
  }, [currentScheme.last_number]);

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
              {iracing ? (
                <Check style={{ color: "#f48fb1", margin: "0 0 -5px 10px" }} />
              ) : (
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
              )}
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
        {iracing ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <CustomGrid item onClick={() => setIsCustomNumber(0)}>
              <Typography>Sim-Stamped Number</Typography>
            </CustomGrid>
            <Grid item>
              <NumberModSwitch
                checked={isCustomNumber ? true : false}
                onChange={(event) =>
                  setIsCustomNumber(event.target.checked ? 1 : 0)
                }
                name="number"
              />
            </Grid>
            <CustomGrid item onClick={() => setIsCustomNumber(1)}>
              <Typography>Custom Number</Typography>
            </CustomGrid>
          </Grid>
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between" }}>
        <Typography
          style={{
            display: "flex",
            alignItems: "center",
            color: iracing ? "#76ff03" : "white",
          }}
        >
          {iracing ? (
            <Check
              style={{
                marginRight: "4px",
                marginLeft: "8px",
                fontSize: "20px",
              }}
            />
          ) : (
            <Warning
              style={{
                marginRight: "4px",
                marginLeft: "8px",
                fontSize: "20px",
              }}
            />
          )}{" "}
          {iracing === false
            ? "Trading Paints downloader program is running but you are not in a iRacing session"
            : !iracing
            ? "Trading Paints downloader program is not running"
            : "Trading Paints downloader program is running"}
        </Typography>
        <Box display="flex" alignItems="center">
          <Button onClick={onCancel} color="secondary">
            Close
          </Button>
          {iracing ? (
            <Button
              color="primary"
              variant="outlined"
              onClick={handleSubmit}
              style={{ marginLeft: "10px" }}
            >
              {applying ? <CircularProgress size={20} /> : "Apply"}
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
});

const CustomGrid = styled(Grid)`
  cursor: pointer;
`;

export default SimPreviewGuideDialog;
