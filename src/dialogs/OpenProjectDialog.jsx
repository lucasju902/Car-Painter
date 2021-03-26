import React from "react";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@material-ui/core";

import Helper from "helper";

const Button = styled(MuiButton)(spacing);
const SchemeWrapper = styled(Box)`
  cursor: pointer;
  padding: 10px;
  :hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const OpenProjectDialog = (props) => {
  const { schemeList, onCreateProject, onOpenProject, onCancel, open } = props;

  return (
    <Dialog aria-labelledby="project-select-title" open={open}>
      <DialogTitle id="project-select-title">
        Open a Paint Builder Project
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column">
          {schemeList && schemeList.length ? (
            schemeList.map((scheme) => (
              <SchemeWrapper
                onClick={() => onOpenProject(scheme.id)}
                key={scheme.id}
              >
                <Typography variant="body1">{scheme.name}</Typography>
                <Typography variant="body2">
                  Last modified{" "}
                  {Helper.getDifferenceFromToday(scheme.date_modified)}
                </Typography>
              </SchemeWrapper>
            ))
          ) : (
            <></>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onCreateProject}
          color="default"
          variant="outlined"
          mb={1}
        >
          NEW
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenProjectDialog;
