import React from "react";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import {
  Grid as MuiGrid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@material-ui/core";

const ShortCuts = {
  DELETE: "Delete Layer",
  ENTER: "Complete Drawing",
  1: "Toggle Car Mask Guide",
  2: "Toggle Wireframe Guide",
  3: "Toggle Sponsor Block Guide",
  4: "Toggle Number Block Guide",
  5: "Toggle Grid Guide",
  T: "Insert Text",
  S: "Insert Overlay",
  L: "Insert Logo",
  B: "Insert Basepaint",
  H: "Hide Transformer",
  "↑": "Move Layer Up",
  "↓": "Move Layer Down",
  "←": "Move Lyer Left",
  "→": "Move Lyer Right",
  "Shift ↑": "10x Move Layer Up",
  "Shift ↓": "10x Move Layer Down",
  "Shift ←": "10x Move Lyer Left",
  "Shift →": "10x Move Lyer Right",
  "Shift +": "Zoom In",
  "Shift -": "Zoom Out",
  "Shift 9": "Zoom To Fit",
  "Shift 0": "Zoom To 100%",
  "Shift D": "Default Mouse Mode",
  "Shift B": "Brush Drawing Mode",
  "Shift R": "Rectangle Drawing Mode",
  "Shift C": "Circle Drawing Mode",
  "Shift E": "Ellipse Drawing Mode",
  "Shift S": "Star Drawing Mode",
  "Shift G": "Ring Drawing Mode",
  "Shift O": "Regular-Polygon Drawing Mode",
  "Shift W": "Wedge Drawing Mode",
  "Shift A": "Arc Drawing Mode",
  "Shift P": "Polygon Drawing Mode",
  "Shift L": "Line Drawing Mode",
  "Shift >": "Arrow Drawing Mode",
  "Ctrl/Meta C": "Copy Layer To Clipboard",
  "Ctrl/Meta V": "Paste Layer From Clipboard",
  "Ctrl/Meta Z": "Undo Action",
  "Ctrl/Meta Y": "Redo Action",
};

const Grid = styled(MuiGrid)(spacing);
const KeyText = styled(Typography)`
  color: #ca812c;
  background: #000000;
  width: fit-content;
  padding: 0px 10px;
  border-radius: 3px;
`;
const DescriptionText = styled(Typography)`
  width: fit-content;
  padding: 0px;
`;

const ShortCutsDialog = (props) => {
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
};

export default React.memo(ShortCutsDialog);
