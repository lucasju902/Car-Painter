import React from "react";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@material-ui/core";

const Button = styled(MuiButton)(spacing);
const TextWrapper = styled(Box)`
  font-size: 1rem;
`;

const YesNoDialog = (props) => {
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
};

export default React.memo(YesNoDialog);
