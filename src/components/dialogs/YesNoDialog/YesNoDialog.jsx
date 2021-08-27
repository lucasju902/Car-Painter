import React from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "components/MaterialUI";
import { TextWrapper } from "./YesNoDialog.style";

export const YesNoDialog = React.memo((props) => {
  const { text, open, onYes, onNo } = props;

  return (
    <Dialog aria-labelledby="confirm-title" open={open}>
      <DialogTitle id="confirm-title">Confirm</DialogTitle>
      <DialogContent dividers>
        <TextWrapper>{text}</TextWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onYes} color="secondary" variant="outlined" autoFocus>
          Yes
        </Button>
        <Button onClick={onNo} color="primary" variant="outlined">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default YesNoDialog;
