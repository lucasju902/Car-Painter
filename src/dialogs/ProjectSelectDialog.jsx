import React from "react";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";

const Button = styled(MuiButton)(spacing);

const ProjectSelectDialog = (props) => {
  const { onCreateProject, onOpenProject, open } = props;

  return (
    <Dialog aria-labelledby="project-select-title" open={open}>
      <DialogTitle id="project-select-title">Paint Builder</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column">
          <Button
            onClick={onCreateProject}
            color="default"
            variant="outlined"
            mb={1}
          >
            CREATE A NEW PAINT
          </Button>
          <Button onClick={onOpenProject} color="default" variant="outlined">
            OPEN A PAINT BUILDER PROJECT
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSelectDialog;
