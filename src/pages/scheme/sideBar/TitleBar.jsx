import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  changeName,
  setCurrentName,
  updateScheme,
} from "redux/reducers/schemeReducer";

import { Box, Button, IconButton, TextField } from "@material-ui/core";
import { Settings as SettingsIcon } from "@material-ui/icons";
import SchemeSettingsDialog from "dialogs/SchemeSettingsDialog";

const TitleBar = () => {
  const dispatch = useDispatch();

  const [dirtyName, setDirtyName] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const handleNameChange = (event) => {
    dispatch(setCurrentName(event.target.value));
    setDirtyName(true);
  };
  const handleSaveName = () => {
    dispatch(changeName(currentScheme.id, currentScheme.name));
    setDirtyName(false);
  };
  const handleApplySettings = (guide_data) => {
    dispatch(
      updateScheme({
        ...currentScheme,
        guide_data: guide_data,
      })
    );
    setOpenSettings(false);
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
      <IconButton onClick={() => setOpenSettings(true)}>
        <SettingsIcon />
      </IconButton>
      <SchemeSettingsDialog
        open={openSettings}
        onApply={handleApplySettings}
        onCancel={() => setOpenSettings(false)}
      />
    </Box>
  );
};

export default TitleBar;
