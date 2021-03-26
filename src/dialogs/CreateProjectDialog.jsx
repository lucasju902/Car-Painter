import React, { useState } from "react";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Helper from "helper";

const Button = styled(MuiButton)(spacing);

const ProjectSelectDialog = (props) => {
  const [carMake, setCarMake] = useState(null);
  const { onContinue, onCancel, open, carMakeList } = props;

  let sortedCarMakesList = [...carMakeList]
    .sort((a, b) => Helper.sortBy(a, b, "name"))
    .sort((a, b) => Helper.sortBy(a, b, "car_type"));
  return (
    <Dialog aria-labelledby="project-select-title" open={open}>
      <DialogTitle id="project-select-title">Create a new paint</DialogTitle>
      <DialogContent dividers>
        {carMakeList && carMakeList.length ? (
          <Autocomplete
            id="car-make-select"
            options={sortedCarMakesList}
            groupBy={(option) => option.car_type}
            getOptionLabel={(option) => option.name}
            style={{ width: 500 }}
            onChange={(event, newValue) => {
              setCarMake(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="SELECT VEHICLE"
                variant="outlined"
              />
            )}
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
          onClick={() => onContinue(carMake)}
          color="default"
          variant="outlined"
          mb={1}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectSelectDialog;
