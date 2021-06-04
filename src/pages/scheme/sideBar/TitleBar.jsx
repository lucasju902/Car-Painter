import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components/macro";

import {
  changeName,
  updateScheme,
  clearCurrent as clearCurrentScheme,
} from "redux/reducers/schemeReducer";

import { Box, IconButton, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  SettingsBackupRestore as BackUpIcon,
} from "@material-ui/icons";
import { faQuestion, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
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

const NameInput = styled(TextField)`
  width: ${(props) => props.width};
`;

const TitleBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dialog, setDialog] = useState(null);

  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const handleNameChange = useCallback(
    (event) => {
      setName(event.target.value);
    },
    [setName]
  );
  const handleSaveName = useCallback(() => {
    dispatch(changeName(currentScheme.id, name));
  }, [dispatch, currentScheme && currentScheme.id, name]);

  const handleDiscardName = useCallback(() => {
    setName(currentScheme.name);
  }, [setName, currentScheme && currentScheme.name]);

  const handleGoBack = useCallback(() => {
    dispatch(clearCurrentScheme());
    history.push("/");
  }, [history, dispatch]);

  const handleApplySettings = useCallback(
    (guide_data) => {
      dispatch(
        updateScheme({
          ...currentScheme,
          guide_data: guide_data,
        })
      );
      setDialog(null);
    },
    [dispatch, currentScheme, setDialog]
  );
  useEffect(() => {
    if (currentScheme) {
      setName(currentScheme.name);
    }
  }, [currentScheme && currentScheme.name]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={1}
      my={1}
    >
      <NameInput
        value={name}
        onChange={handleNameChange}
        width={currentScheme && name !== currentScheme.name ? "105px" : "185px"}
      />
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
        <LightTooltip title="Back" arrow>
          <IconButton onClick={handleGoBack}>
            <CustomIcon icon={faChevronLeft} size="xs" />
          </IconButton>
        </LightTooltip>
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

export default React.memo(TitleBar);
