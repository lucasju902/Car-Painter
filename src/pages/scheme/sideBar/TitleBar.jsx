import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import styled from "styled-components/macro";

import { updateScheme } from "redux/reducers/schemeReducer";

import { Box, IconButton, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Save as SaveIcon,
  SettingsBackupRestore as BackUpIcon,
} from "@material-ui/icons";
import { faQuestion, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { DialogTypes } from "constant";
import ShortCutsDialog from "dialogs/ShortCutsDialog";
import LightTooltip from "components/LightTooltip";

const CustomIcon = styled(FontAwesomeIcon)`
  width: 20px !important;
`;

const NameInput = styled(TextField)`
  width: ${(props) => props.width};
`;

const TitleBar = (props) => {
  const { onBack } = props;

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
    dispatch(updateScheme({ id: currentScheme.id, name }));
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
        width={currentScheme && name !== currentScheme.name ? "158px" : "250px"}
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
          <IconButton onClick={onBack}>
            <CustomIcon icon={faChevronLeft} size="xs" />
          </IconButton>
        </LightTooltip>
        <LightTooltip title="Shortcuts" arrow>
          <IconButton onClick={() => setDialog(DialogTypes.SHORTCUTS)}>
            <CustomIcon icon={faQuestion} size="xs" />
          </IconButton>
        </LightTooltip>
      </Box>

      <ShortCutsDialog
        open={dialog === DialogTypes.SHORTCUTS}
        onCancel={() => setDialog(null)}
      />
    </Box>
  );
};

export default React.memo(TitleBar);
