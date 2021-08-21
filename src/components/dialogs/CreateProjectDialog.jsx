import React, { useState, useEffect, useCallback } from "react";
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
import { funWords } from "constant";
import { getTwoRandomNumbers } from "helper";

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

export const CreateProjectDialog = React.memo((props) => {
  const {
    onContinue,
    onCancel,
    open,
    carMakeList,
    predefinedCarMakeID,
  } = props;
  const [carMake, setCarMake] = useState(null);
  const [name, setName] = useState("");

  const [placeHolderName, setPlaceHolderName] = useState("");

  const handleSubmit = useCallback(() => {
    const schemeName = name && name.length ? name : placeHolderName;
    onContinue(carMake, schemeName);
  }, [carMake, name, placeHolderName, onContinue]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13 && carMake) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [carMake, handleSubmit]
  );

  useEffect(() => {
    if (predefinedCarMakeID) {
      const make = carMakeList.find(
        (item) => item.id.toString() === predefinedCarMakeID
      );
      setCarMake(make);
    }
  }, [predefinedCarMakeID]);

  useEffect(() => {
    if (open) {
      const rands = getTwoRandomNumbers(funWords.length);
      setPlaceHolderName(
        funWords[rands[0]] + " " + funWords[rands[1]] + " Paint"
      );
    }
  }, [open]);

  return (
    <Dialog aria-labelledby="project-select-title" open={open}>
      <DialogTitle id="project-select-title">Create a new paint</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column">
          {carMakeList && carMakeList.length ? (
            <Autocomplete
              id="car-make-select"
              value={carMake}
              options={carMakeList}
              groupBy={(option) => option.car_type}
              getOptionLabel={(option) => option.name}
              style={{ width: 500 }}
              mb={4}
              onChange={(event, newValue) => {
                setCarMake(newValue);
              }}
              onKeyDown={handleKeyDown}
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
            value={name && name.length ? name : placeHolderName}
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Box>
      </DialogContent>
      <CustomDialogActions>
        <Button onClick={onCancel} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="outlined"
          disabled={!carMake ? true : false}
        >
          Continue
        </Button>
      </CustomDialogActions>
    </Dialog>
  );
});

export default CreateProjectDialog;
