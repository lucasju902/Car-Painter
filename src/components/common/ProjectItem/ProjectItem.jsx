import React, { useState, useMemo, useCallback } from "react";

import config from "config";

import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  CircularProgress,
  Avatar,
} from "@material-ui/core";
import { ImageWithLoad, LightTooltip } from "components/common";
import { ConfirmDialog } from "components/dialogs";
import {
  StyledMenu,
  ActionIcon,
  BreakableTypography,
  faStarOn,
  faStarOff,
} from "./ProjectItem.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShowroomNoCar from "assets/showroom_no_car.svg";

import { getDifferenceFromToday, reduceString } from "helper";
import { AvatarGroup } from "@material-ui/lab";

export const ProjectItem = React.memo((props) => {
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
  const showActionMenu = useMemo(() => onCloneProject || onDelete || onAccept, [
    onCloneProject,
    onDelete,
    onAccept,
  ]);

  const unsetDeleteMessage = useCallback(() => setDeleteMessage(null), []);

  const handleToggleFavorite = useCallback(() => {
    setFavoriteInPrgoress(true);
    if (isFavorite)
      onRemoveFavorite(favoriteID, () => setFavoriteInPrgoress(false));
    else onAddFavorite(user.id, scheme.id, () => setFavoriteInPrgoress(false));
  }, [
    favoriteID,
    isFavorite,
    onAddFavorite,
    onRemoveFavorite,
    scheme.id,
    user.id,
  ]);

  const handleActionMenuClick = (event) => {
    setActionMenuEl(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setActionMenuEl(null);
  };

  const handleDeleteItem = useCallback(() => {
    if (shared) {
      onDelete(sharedID);
    } else {
      onDelete(scheme.id);
    }
    handleActionMenuClose();
  }, [onDelete, scheme.id, shared, sharedID]);

  const handleCloneProject = useCallback(() => {
    onCloneProject(scheme.id);
    handleActionMenuClose();
  }, [onCloneProject, scheme.id]);

  const handleAccept = useCallback(() => {
    onAccept(sharedID);
    handleActionMenuClose();
  }, [onAccept, sharedID]);

  const handleDelete = useCallback(() => {
    setDeleteMessage(
      `Are you sure you want to ${
        shared && !accepted
          ? "reject"
          : shared && accepted
          ? "remove"
          : "delete"
      } "${scheme.name}"?`
    );
    handleActionMenuClose();
  }, [accepted, scheme.name, shared]);

  const handleOpenScheme = useCallback(() => {
    onOpenScheme(scheme.id, sharedID);
  }, [onOpenScheme, scheme.id, sharedID]);

  const schemeThumbnailURL = useCallback((id) => {
    return `${config.assetsURL}/scheme_thumbnails/${id}.jpg`;
  }, []);

  const legacySchemeThumbnailURL = useCallback((id) => {
    return `${config.legacyAssetURL}/thumbs/${id}.jpg`;
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      border="1px solid grey"
      position="relative"
      height="100%"
    >
      <ImageWithLoad
        src={schemeThumbnailURL(scheme.id) + "?date=" + scheme.date_modified}
        altSrc={legacySchemeThumbnailURL(scheme.id)}
        fallbackSrc={ShowroomNoCar}
        minHeight="200px"
        alt={scheme.name}
        onClick={handleOpenScheme}
      />
      <Box display="flex" justifyContent="space-between">
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          p={4}
          overflow="hidden"
        >
          {scheme.legacy_mode ? (
            <Box
              bgcolor="#FF0833"
              color="white"
              p="0px 5px"
              mb={2}
              width="72px"
            >
              <LightTooltip
                title="This project was created with an old version of Paint Builder."
                arrow
              >
                <Typography variant="body1">LEGACY</Typography>
              </LightTooltip>
            </Box>
          ) : (
            <></>
          )}
          <Box mb={1}>
            <BreakableTypography
              variant="subtitle1"
              className="cursor-pointer"
              onClick={handleOpenScheme}
            >
              {reduceString(scheme.name, 50)}
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
          {scheme.sharedUsers.length ? (
            <Box pt={2}>
              <AvatarGroup max={5}>
                {scheme.sharedUsers.map((sharedUser, index) => (
                  <LightTooltip
                    title={"Shared with " + sharedUser.user.drivername}
                    arrow
                    key={index}
                  >
                    <Avatar
                      alt={sharedUser.user.drivername}
                      src={`https://www.tradingpaints.com/scripts/image_driver.php?driver=${sharedUser.user_id}`}
                    >
                      {sharedUser.user.drivername[0].toUpperCase()}
                    </Avatar>
                  </LightTooltip>
                ))}
              </AvatarGroup>
            </Box>
          ) : (
            <></>
          )}
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
          {showActionMenu && (
            <>
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
            </>
          )}
        </Box>
      </Box>
      <ConfirmDialog
        text={deleteMessage}
        open={!!deleteMessage}
        onCancel={unsetDeleteMessage}
        onConfirm={handleDeleteItem}
      />
    </Box>
  );
});

export default ProjectItem;
