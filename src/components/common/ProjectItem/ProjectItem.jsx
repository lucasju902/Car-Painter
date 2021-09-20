import React, { useState } from "react";
import _ from "lodash";

import config from "config";

import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { ImageWithLoad } from "components/common";
import { ConfirmDialog } from "components/dialogs";
import {
  StyledMenu,
  ActionIcon,
  BreakableTypography,
  faStarOn,
  faStarOff,
} from "./ProjectItem.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getDifferenceFromToday, reduceString } from "helper";

export const ProjectItem = (props) => {
  const {
    user,
    scheme,
    onDelete,
    onCloneProject,
    onAccept,
    onOpenScheme,
    onAddFavorite,
    onRemoveFavorite,
    shared,
    isFavorite,
    accepted,
    sharedID,
    favoriteID,
  } = props;
  const [actionMenuEl, setActionMenuEl] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [favoriteInPrgoress, setFavoriteInPrgoress] = useState(false);

  const handleToggleFavorite = () => {
    setFavoriteInPrgoress(true);
    if (isFavorite)
      onRemoveFavorite(favoriteID, () => setFavoriteInPrgoress(false));
    else onAddFavorite(user.id, scheme.id, () => setFavoriteInPrgoress(false));
  };

  const handleActionMenuClick = (event) => {
    setActionMenuEl(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setActionMenuEl(null);
  };
  const handleDeleteItem = () => {
    if (shared) {
      onDelete(sharedID);
    } else {
      onDelete(scheme.id);
    }
    handleActionMenuClose();
  };
  const handleCloneProject = () => {
    onCloneProject(scheme.id);
    handleActionMenuClose();
  };
  const handleAccept = () => {
    onAccept(sharedID);
    handleActionMenuClose();
  };
  const handleDelete = () => {
    setDeleteMessage(
      `Are you sure to ${
        shared && !accepted
          ? "reject"
          : shared && accepted
          ? "remove"
          : "delete"
      } "${scheme.name}"?`
    );
    handleActionMenuClose();
  };

  const schemeThumbnailURL = (id) => {
    return `${config.assetsURL}/scheme_thumbnails/${id}.jpg`;
  };

  return (
    <Box display="flex" flexDirection="column" border="1px solid grey">
      <ImageWithLoad
        src={
          schemeThumbnailURL(scheme.id) +
          "?date=" +
          new Date().toLocaleDateString() +
          new Date().getHours()
        }
        minHeight="200px"
        alt={scheme.name}
        onClick={() => onOpenScheme(scheme.id, sharedID)}
      />
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column" p={4} overflow="hidden">
          <Box mb={1}>
            <BreakableTypography variant="body1">
              {reduceString(scheme.name, 60)}
            </BreakableTypography>
          </Box>
          {scheme.user.id !== user.id ? (
            <Typography variant="body2">
              Owner: {scheme.user.drivername}
            </Typography>
          ) : (
            <></>
          )}
          <Typography variant="body2">{scheme.carMake.name}</Typography>
          <Typography variant="body2">
            Edited {getDifferenceFromToday(scheme.date_modified)}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" flexGrow={1} width="92px">
          {favoriteInPrgoress ? (
            <CircularProgress size={30} />
          ) : (
            <IconButton onClick={handleToggleFavorite}>
              {isFavorite ? (
                <FontAwesomeIcon icon={faStarOn} size="sm" />
              ) : (
                <FontAwesomeIcon icon={faStarOff} size="sm" />
              )}
            </IconButton>
          )}
          <IconButton
            aria-haspopup="true"
            aria-controls={`action-menu-${scheme.id}`}
            onClick={handleActionMenuClick}
          >
            <ActionIcon />
          </IconButton>
          <StyledMenu
            id={`action-menu-${scheme.id}`}
            elevation={0}
            getContentAnchorEl={null}
            anchorEl={actionMenuEl}
            keepMounted
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={Boolean(actionMenuEl)}
            onClose={handleActionMenuClose}
          >
            {onCloneProject && (
              <MenuItem onClick={handleCloneProject}>Clone</MenuItem>
            )}

            {onAccept && <MenuItem onClick={handleAccept}>Accept</MenuItem>}

            {onDelete && (
              <MenuItem onClick={handleDelete}>
                {shared && !accepted
                  ? "Reject"
                  : shared && accepted
                  ? "Remove"
                  : "Delete"}
              </MenuItem>
            )}
          </StyledMenu>
        </Box>
      </Box>
      <ConfirmDialog
        text={deleteMessage}
        open={!!deleteMessage}
        onCancel={() => setDeleteMessage(null)}
        onConfirm={handleDeleteItem}
      />
    </Box>
  );
};

export default ProjectItem;
