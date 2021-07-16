import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import _ from "lodash";
import styled from "styled-components/macro";

import {
  changeName,
  updateScheme,
  clearCurrent as clearCurrentScheme,
  setLoaded as setSchemeLoaded,
} from "redux/reducers/schemeReducer";
import { clearFrameSize } from "redux/reducers/boardReducer";

import { Box, IconButton, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  SettingsBackupRestore as BackUpIcon,
} from "@material-ui/icons";
import { faQuestion, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import SchemeSettingsDialog from "dialogs/scheme-settings-dialog";
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
  const sharedUsers = useSelector((state) => state.schemeReducer.sharedUsers);
  const guide_data = useSelector(
    (state) => state.schemeReducer.current.guide_data
  );
  const userList = useSelector((state) => state.userReducer.list);

  const handleNameChange = useCallback(
    (event) => {
      setName(event.target.value);
    },
    [setName]
  );
  const handleSaveName = useCallback(() => {
    dispatch(changeName(currentScheme.id, name));
  }, [dispatch, currentScheme && currentScheme.id, name]);
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
  }, [setName, currentScheme && currentScheme.name]);

  const handleGoBack = useCallback(() => {
    dispatch(clearFrameSize());
    dispatch(setSchemeLoaded(false));
    dispatch(clearCurrentScheme());
    history.push("/");
  }, [history, dispatch]);

  const handleApplyProjectSettings = useCallback(
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
  const handleApplySharingSetting = useCallback(
    (data) => {
      console.log(data);

      setDialog(null);
    },
    [dispatch, setDialog]
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
        onKeyDown={handleNameKeyDown}
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
        ownerID={currentScheme.user_id}
        schemeID={currentScheme.id}
        sharedUsers={sharedUsers}
        userList={userList}
        guide_data={guide_data}
        open={dialog === DialogTypes.SETTINGS}
        onApplyGuideSettings={handleApplyProjectSettings}
        onApplySharingSetting={handleApplySharingSetting}
        onCancel={() => setDialog(null)}
      />
    </Box>
  );
};

export default React.memo(TitleBar);
