import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components/macro";
import { funWords } from "constant";
import { getTwoRandomNumbers } from "helper";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "components/MaterialUI";
import { CustomDialogActions, NameField } from "./CreateProjectDialog.style";
import CarMakeAutocomplete from "pages/projects/components/CarMakeAutocomplete";

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
    if (predefinedCarMakeID && carMakeList && carMakeList.length) {
      const make = carMakeList.find(
        (item) => item.id.toString() === predefinedCarMakeID
      );
      setCarMake(make);
    }
  }, [carMakeList, predefinedCarMakeID]);

  useEffect(() => {
    if (open) {
      const rands = getTwoRandomNumbers(funWords.length);
      setPlaceHolderName(
        funWords[rands[0]] + " " + funWords[rands[1]] + " Paint"
      );
    }
  }, [open]);

  return (
    <Dialog
      aria-labelledby="project-select-title"
      open={open}
      onClose={onCancel}
    >
      <DialogTitle id="project-select-title">Create a new paint</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column">
          <StyledCarMakeAutocomplete
            label="Select Vehicle"
            value={carMake}
            onChange={(event, newValue) => {
              setCarMake(newValue);
            }}
            onKeyDown={handleKeyDown}
          />

          <NameField
            label="Name"
            value={name && name.length ? name : placeHolderName}
            variant="outlined"
            inputProps={{ maxLength: "50" }}
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

const StyledCarMakeAutocomplete = styled(CarMakeAutocomplete)`
  width: 500px;
  margin-bottom: 16px;
  .MuiInputLabel-outlined {
    transform: translate(14px, 19px) scale(1);
    &.MuiInputLabel-shrink {
      transform: translate(14px, -6px) scale(0.75);
    }
  }
`;

export default CreateProjectDialog;
