import React, { useState } from "react";
import _ from "lodash";

import config from "config";
import styled from "styled-components/macro";

import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import ImageWithLoad from "components/ImageWithLoad";
import { MoreVert as ActionIcon } from "@material-ui/icons";
import { faStar as faStarOn } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOff } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "dialogs/ConfirmDialog";

import { getDifferenceFromToday } from "helper";

const ItemWrapper = styled(Box)`
  border: 1px solid grey;
`;
const StyledMenu = styled(Menu)`
  .MuiMenu-paper {
    border: 1px solid grey;
  }
`;

const ProjectItem = (props) => {
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

  const schemeThumbnailURL = (id) => {
    return `${config.assetsURL}/scheme_thumbnails/${id}.png`;
  };

  return (
    <ItemWrapper display="flex" flexDirection="column">
      <ImageWithLoad
        src={
          schemeThumbnailURL(scheme.id) +
          "?date=" +
          new Date().toLocaleDateString()
        }
        alt={scheme.name}
        onClick={() => onOpenScheme(scheme.id, sharedID)}
      />
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column" p={4}>
          <Typography variant="body1">{scheme.name}</Typography>
          <Typography variant="body2">
            Edited {getDifferenceFromToday(scheme.date_modified)}
          </Typography>
          <Typography variant="body2">{scheme.carMake.name}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
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
              <MenuItem
                onClick={() =>
                  setDeleteMessage(
                    `Are you sure to ${
                      shared && !accepted
                        ? "reject"
                        : shared && accepted
                        ? "remove"
                        : "delete"
                    } "${scheme.name}"?`
                  )
                }
              >
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
    </ItemWrapper>
  );
};

export default ProjectItem;
