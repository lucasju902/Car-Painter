import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";

import {
  changeName,
  setCurrentName,
  updateScheme,
} from "redux/reducers/schemeReducer";

import { Box, Button, IconButton, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Settings as SettingsIcon } from "@material-ui/icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import SchemeSettingsDialog from "dialogs/SchemeSettingsDialog";
import ShortCutsDialog from "dialogs/ShortCutsDialog";
import LightTooltip from "components/LightTooltip";

const CustomIcon = styled(FontAwesomeIcon)`
  width: 20px !important;
`;

const DialogTypes = {
  SHORTCUTS: "SHORTCUTS",
  SETTINGS: "SETTINGS",
};

const TitleBar = () => {
  const dispatch = useDispatch();

  const [dirtyName, setDirtyName] = useState(false);
  const [dialog, setDialog] = useState(null);

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
    setDialog(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={1}
      my={1}
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
      <Box display="flex">
        <LightTooltip title="Shortcuts" arrow>
          <IconButton onClick={() => setDialog(DialogTypes.SHORTCUTS)}>
            <CustomIcon icon={faQuestion} size="xs" />
          </IconButton>
        </LightTooltip>
        <LightTooltip title="Settings" arrow>
          <IconButton onClick={() => setDialog(DialogTypes.SETTINGS)}>
            <SettingsIcon />
          </IconButton>
        </LightTooltip>
      </Box>

      <ShortCutsDialog
        open={dialog === DialogTypes.SHORTCUTS}
        onCancel={() => setDialog(null)}
      />
      <SchemeSettingsDialog
        open={dialog === DialogTypes.SETTINGS}
        onApply={handleApplySettings}
        onCancel={() => setDialog(null)}
      />
    </Box>
  );
};

export default TitleBar;
