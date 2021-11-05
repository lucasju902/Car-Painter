import React from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "components/MaterialUI";

export const ConfirmDialog = React.memo((props) => {
  const { text, open, confirmLoading, onCancel, onConfirm } = props;

  return (
    <Dialog aria-labelledby="confirm-title" open={open} onClose={onCancel}>
      <DialogTitle id="confirm-title">Confirm</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          color="secondary"
          variant="outlined"
          autoFocus
        >
          {confirmLoading ? (
            <CircularProgress color="secondary" size={20} />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ConfirmDialog;
