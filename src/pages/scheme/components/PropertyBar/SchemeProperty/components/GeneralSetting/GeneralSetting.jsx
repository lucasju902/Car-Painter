import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";

import {
  Box,
  IconButton,
  CircularProgress,
  Typography,
} from "components/MaterialUI";
import { LightTooltip } from "components/common";
import { ConfirmDialog } from "components/dialogs";
import { CustomButton, NameInput, InfoIcon } from "./styles";

import {
  Save as SaveIcon,
  SettingsBackupRestore as BackUpIcon,
} from "@material-ui/icons";
import { faStar as faStarOn } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOff } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GeneralSetting = React.memo((props) => {
  const {
    editable,
    favoriteID,
    scheme,
    currentUser,
    owner,
    modifier,
    onRemoveFavorite,
    onAddFavorite,
    onDelete,
    onRename,
    onRenewCarMakeLayers,
  } = props;
  const history = useHistory();

  const [favoriteInPrgoress, setFavoriteInPrgoress] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [name, setName] = useState(scheme.name);

  const handleToggleFavorite = useCallback(() => {
    setFavoriteInPrgoress(true);
    if (favoriteID)
      onRemoveFavorite(favoriteID, () => setFavoriteInPrgoress(false));
    else
      onAddFavorite(currentUser.id, scheme.id, () =>
        setFavoriteInPrgoress(false)
      );
  }, [
    favoriteID,
    currentUser,
    onRemoveFavorite,
    onAddFavorite,
    setFavoriteInPrgoress,
  ]);

  const handleNameChange = useCallback(
    (event) => {
      setName(event.target.value);
    },
    [setName]
  );
  const handleSaveName = useCallback(() => {
    onRename(scheme.id, name);
  }, [scheme, name]);
  const handleDiscardName = useCallback(() => {
    setName(scheme.name);
  }, [setName, scheme.name]);
  const handleNameKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        handleSaveName();
      }
    },
    [handleSaveName]
  );

  const handleDelete = useCallback(() => {
    onDelete(scheme.id, () => history.push("/"));
  }, [onDelete, scheme]);

  useEffect(() => {
    setName(scheme.name);
  }, [scheme.name]);

  return (
    <Box mt={5}>
      <Box display="flex" my={2}>
        <NameInput
          label="Name"
          variant="outlined"
          disabled={!editable}
          value={name}
          inputProps={{ maxLength: "50" }}
          onChange={handleNameChange}
          onKeyDown={handleNameKeyDown}
          width="300px"
          mr={2}
        />
        {scheme && name !== scheme.name ? (
          <LightTooltip title="Discard Change" arrow mr={1}>
            <IconButton onClick={handleDiscardName} color="secondary">
              <BackUpIcon />
            </IconButton>
          </LightTooltip>
        ) : (
          <></>
        )}
        {scheme && name !== scheme.name ? (
          <LightTooltip title="Save" arrow>
            <IconButton onClick={handleSaveName}>
              <SaveIcon />
            </IconButton>
          </LightTooltip>
        ) : (
          <></>
        )}
      </Box>

      <Box pl={2}>
        {owner ? <Typography>Owner: {owner.drivername}</Typography> : <></>}

        <Typography>
          Created: {new Date(scheme.date_created * 1000).toDateString()}
        </Typography>
        <Typography>
          Last Modified: {new Date(scheme.date_modified * 1000).toDateString()}
        </Typography>
        {modifier ? (
          <Typography>Last Modified By: {modifier.drivername}</Typography>
        ) : (
          <></>
        )}
        {scheme.legacy_mode ? (
          <Box display="flex" my={2}>
            <InfoIcon />
            <Typography variant="subtitle1">
              This project was created with an old version of Paint Builder.
            </Typography>
          </Box>
        ) : (
          <></>
        )}
      </Box>

      {favoriteInPrgoress ? (
        <Box display="flex" width="100%" justifyContent="center" my={2}>
          <CircularProgress size={30} mb={2} />
        </Box>
      ) : (
        <CustomButton
          startIcon={
            favoriteID ? (
              <FontAwesomeIcon icon={faStarOn} size="sm" />
            ) : (
              <FontAwesomeIcon icon={faStarOff} size="sm" />
            )
          }
          my={2}
          fullWidth
          variant="outlined"
          onClick={handleToggleFavorite}
        >
          Favorite
        </CustomButton>
      )}

      {editable ? (
        <CustomButton
          onClick={onRenewCarMakeLayers}
          fullWidth
          mb={2}
          variant="outlined"
        >
          Renew CarMake Layers
        </CustomButton>
      ) : (
        <></>
      )}

      {owner && currentUser && owner.id === currentUser.id ? (
        <CustomButton
          onClick={() =>
            setDeleteMessage(`Are you sure to delete "${scheme.name}"?`)
          }
          fullWidth
          variant="outlined"
          color="secondary"
        >
          Delete Project
        </CustomButton>
      ) : (
        <></>
      )}

      <ConfirmDialog
        text={deleteMessage}
        open={!!deleteMessage}
        onCancel={() => setDeleteMessage(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
});
