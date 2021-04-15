import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { changeName, setCurrentName } from "redux/reducers/schemeReducer";

import { Box, Button, IconButton, TextField } from "@material-ui/core";
import { Settings as SettingsIcon } from "@material-ui/icons";

const TitleBar = () => {
  const dispatch = useDispatch();

  const [dirtyName, setDirtyName] = useState(false);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const handleNameChange = (event) => {
    dispatch(setCurrentName(event.target.value));
    setDirtyName(true);
  };
  const handleSaveName = () => {
    dispatch(changeName(currentScheme.id, currentScheme.name));
    setDirtyName(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={1}
      mb={2}
    >
      <Box display="flex" flexDirection="row">
        <TextField
          value={currentScheme ? currentScheme.name : ""}
          onChange={handleNameChange}
        />
        {dirtyName ? (
          <Button onClick={handleSaveName} variant="outlined">
            Save
          </Button>
        ) : (
          <></>
        )}
      </Box>
      <IconButton>
        <SettingsIcon />
      </IconButton>
    </Box>
  );
};

export default TitleBar;
