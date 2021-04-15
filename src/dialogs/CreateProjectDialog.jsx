import React, { useState } from "react";
import _ from "lodash";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@material-ui/core";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";

const Button = styled(MuiButton)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const CustomDialogActions = styled(DialogActions)`
  padding-right: 24px;
`;
const NameField = styled(TextField)`
  .MuiInputBase-root {
    height: 56px;
  }
`;

const ProjectSelectDialog = (props) => {
  const [carMake, setCarMake] = useState(null);
  const [name, setName] = useState("");
  const { onContinue, onCancel, open, carMakeList } = props;

  let sortedCarMakesList = _.orderBy(
    [...carMakeList],
    ["name", "car_type"],
    ["asc", "asc"]
  );
  return (
    <Dialog aria-labelledby="project-select-title" open={open}>
      <DialogTitle id="project-select-title">Create a new paint</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column">
          {carMakeList && carMakeList.length ? (
            <Autocomplete
              id="car-make-select"
              options={sortedCarMakesList}
              groupBy={(option) => option.car_type}
              getOptionLabel={(option) => option.name}
              style={{ width: 500 }}
              mb={4}
              onChange={(event, newValue) => {
                setCarMake(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Vehicle"
                  variant="outlined"
                />
              )}
            />
          ) : (
            <></>
          )}
          <NameField
            label="Name"
            value={name}
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
          />
        </Box>
      </DialogContent>
      <CustomDialogActions>
        <Button onClick={onCancel} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => onContinue(carMake, name)}
          color="primary"
          variant="outlined"
          disabled={!carMake ? true : false}
        >
          Continue
        </Button>
      </CustomDialogActions>
    </Dialog>
  );
};

export default ProjectSelectDialog;
