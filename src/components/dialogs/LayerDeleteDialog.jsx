import React, { useState, useCallback } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "components/MaterialUI";

export const LayerDeleteDialog = React.memo((props) => {
  const { text, open, nothingLeft, loading, onCancel, onConfirm } = props;
  const [gonnaDeleteAll, setGonnaDeleteAll] = useState(false);

  const handleConfirm = useCallback(() => {
    onConfirm(gonnaDeleteAll);
  }, [gonnaDeleteAll, onConfirm]);

  return (
    <Dialog aria-labelledby="confirm-title" open={open} onClose={onCancel}>
      <DialogTitle id="confirm-title">Confirm</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">{text}</Typography>
        {nothingLeft ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={gonnaDeleteAll}
                onChange={(event) => setGonnaDeleteAll(event.target.checked)}
                color="primary"
              />
            }
            label="Also delete logo from My Uploads"
          />
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          color="secondary"
          variant="outlined"
          autoFocus
        >
          {loading ? (
            <CircularProgress color="secondary" size={20} />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default LayerDeleteDialog;
