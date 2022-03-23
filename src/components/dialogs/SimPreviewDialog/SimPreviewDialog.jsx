import React from "react";

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

import styled from "styled-components";
import { useState } from "react";
import { useCallback } from "react";
import { NumberModSwitch } from "./NumberModSwitch";

export const SimPreviewDialog = React.memo((props) => {
  const { open, applying, onApply, onCancel } = props;
  const [isCustomNumber, setIsCustomNumber] = useState(0);

  const handleSubmit = useCallback(() => {
    onApply(isCustomNumber);
  }, [isCustomNumber, onApply]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Sim Preview</DialogTitle>
      <DialogContent dividers id="seam-preview-dialog-content">
        <Typography mb={4}>This is Sim Preview Feature.</Typography>
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          position="relative"
        >
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>

        <Button color="primary" variant="outlined" onClick={handleSubmit}>
          {applying ? <CircularProgress size={20} /> : "Apply"}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const CustomGrid = styled(Grid)`
  cursor: pointer;
`;

export default SimPreviewDialog;
