import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DialogTypes } from "constant";

import { Box, IconButton, useMediaQuery } from "@material-ui/core";
import { SchemeSettingsDialog } from "components/dialogs";
import { LightTooltip } from "components/common";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Save as SaveIcon,
  SettingsBackupRestore as BackUpIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";
import { CustomIcon, NameInput } from "./TitleBar.style";

import { updateScheme } from "redux/reducers/schemeReducer";
import { focusBoardQuickly } from "helper";

export const TitleBar = React.memo((props) => {
  const { editable, onBack } = props;
  const overTablet = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dialog, setDialog] = useState(null);

  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const hideDialog = useCallback(() => {
    setDialog(null);
    focusBoardQuickly();
  }, []);

  const handleNameChange = useCallback(
    (event) => {
      setName(event.target.value);
    },
    [setName]
  );
  const handleSaveName = useCallback(() => {
    dispatch(updateScheme({ id: currentScheme.id, name }, true, false));
    focusBoardQuickly();
  }, [dispatch, currentScheme, name]);
  const handleNameKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        handleSaveName();
      }
    },
    [handleSaveName]
  );

  const handleDiscardName = useCallback(() => {
    setName(currentScheme.name);
    focusBoardQuickly();
  }, [setName, currentScheme]);

  useEffect(() => {
    if (currentScheme) {
      setName(currentScheme.name);
    }
  }, [currentScheme]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={1}
      my={1}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box mr={1}>
          <LightTooltip title="Back" arrow>
            <IconButton onClick={onBack}>
              <CustomIcon icon={faChevronLeft} size="xs" />
            </IconButton>
          </LightTooltip>
        </Box>

        <NameInput
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleNameKeyDown}
          inputProps={{ maxLength: "50" }}
        />
      </Box>
      <Box display="flex">
        {currentScheme && name !== currentScheme.name ? (
          <LightTooltip title="Discard Change" arrow>
            <IconButton onClick={handleDiscardName} color="secondary">
              <BackUpIcon />
            </IconButton>
          </LightTooltip>
        ) : (
          <></>
        )}
        {currentScheme && name !== currentScheme.name ? (
          <LightTooltip title="Save" arrow>
            <IconButton onClick={handleSaveName}>
              <SaveIcon />
            </IconButton>
          </LightTooltip>
        ) : (
          <></>
        )}

        {overTablet && (
          <LightTooltip title="Settings" arrow>
            <IconButton ml={2} onClick={() => setDialog(DialogTypes.SETTINGS)}>
              <SettingsIcon />
            </IconButton>
          </LightTooltip>
        )}
      </Box>

      <SchemeSettingsDialog
        editable={editable}
        open={dialog === DialogTypes.SETTINGS}
        onCancel={hideDialog}
      />
    </Box>
  );
});

export default TitleBar;
