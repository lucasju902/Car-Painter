import React from "react";
import { ShortCuts } from "constant/shortcuts";

import { Grid, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { KeyText, DescriptionText } from "./ShortCutsDialog.style";

export const ShortCutsDialog = React.memo((props) => {
  const { onCancel, open } = props;

  return (
    <Dialog
      aria-labelledby="short-cuts-title"
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="short-cuts-title">Shortcuts</DialogTitle>
      <DialogContent dividers id="short-cuts-dialog-content">
        {Object.keys(ShortCuts).map((item, index) => (
          <Grid container key={index} mb={2}>
            <Grid item xs={6}>
              <KeyText>{item}</KeyText>
            </Grid>
            <Grid item xs={6}>
              <DescriptionText>{ShortCuts[item]}</DescriptionText>
            </Grid>
          </Grid>
        ))}
      </DialogContent>
    </Dialog>
  );
});

export default ShortCutsDialog;
