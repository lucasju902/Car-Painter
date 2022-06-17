import React, { useState, useMemo, useCallback } from "react";

import config from "config";

import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  CircularProgress,
  Avatar,
  LinearProgress,
  Menu,
} from "@material-ui/core";
import { ImageWithLoad, LightTooltip } from "components/common";
import { ConfirmDialog } from "components/dialogs";
import {
  ActionIcon,
  BreakableTypography,
  faStarOn,
  faStarOff,
} from "./ProjectItem.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShowroomNoCar from "assets/showroom_no_car.svg";

import { getDifferenceFromToday, getUserName, reduceString } from "helper";
import { AvatarGroup } from "@material-ui/lab";
import { setPreviousPath } from "redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import CarService from "services/carService";

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
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
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

  const handleDelete = useCallback(async () => {
    setDeleteMessage(
      <>
        Are you sure you want to{" "}
        {!shared ? "delete" : !accepted ? "reject" : "remove"} "{scheme.name}"?
        <LinearProgress color="secondary" style={{ margin: "10px 0" }} />
      </>
    );
    let hasPrimaryRace = false;
    if (!shared) {
      let carRaces = [];
      const stampedCarResult = await CarService.getCarRace(scheme.id, 0);
      if (stampedCarResult.status) {
        carRaces.push(stampedCarResult.output);
      }
      const customCarResult = await CarService.getCarRace(scheme.id, 1);
      if (customCarResult.status) {
        carRaces.push(customCarResult.output);
      }
      hasPrimaryRace = carRaces.some((car) => car.primary);
    }
    setDeleteMessage(
      <>
        Are you sure you want to{" "}
        {!shared ? "delete" : !accepted ? "reject" : "remove"} "{scheme.name}"?
        {hasPrimaryRace && (
          <>
            <br />
            This project is associated with an active paint for your{" "}
            {scheme.carMake.name}. <br />
            If you delete this project, you won’t be able to make changes.
          </>
        )}
      </>
    );
    handleActionMenuClose();
  }, [accepted, scheme, shared]);

  const handleOpenScheme = useCallback(() => {
    const scrollPosition = document.getElementById("scheme-list-content")
      .scrollTop;

    dispatch(setPreviousPath(window.location.pathname));
    localStorage.setItem(
      "scrollPosition",
      JSON.stringify({
        path: window.location.pathname,
        position: scrollPosition,
      })
    );
    onOpenScheme(scheme.id, sharedID);
  }, [dispatch, onOpenScheme, scheme, sharedID]);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
              mb={1}
              width="52px"
            >
              <LightTooltip
                title="This project was created with an old version of Paint Builder."
                arrow
              >
                <Typography variant="caption">LEGACY</Typography>
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
              noWrap
            >
              {reduceString(scheme.name, 50)}
            </BreakableTypography>
          </Box>
          {scheme.user && scheme.user.id !== user.id ? (
            <Typography variant="body2" noWrap>
              Owner: {getUserName(scheme.user)}
            </Typography>
          ) : (
            <></>
          )}
          <Typography variant="body2" noWrap>
            {scheme.carMake.name}
          </Typography>
          <Typography variant="body2" noWrap>
            Edited {getDifferenceFromToday(scheme.date_modified)}
          </Typography>
          {scheme.sharedUsers && scheme.sharedUsers.length ? (
            <Box pt={2}>
              <AvatarGroup max={5}>
                {scheme.sharedUsers.map((sharedUser, index) => (
                  <LightTooltip
                    title={"Shared with " + getUserName(sharedUser.user)}
                    arrow
                    key={index}
                  >
                    <Avatar
                      alt={getUserName(sharedUser.user)}
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
        {hovered ? (
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
                <Menu
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

                  {onAccept && (
                    <MenuItem onClick={handleAccept}>Accept</MenuItem>
                  )}

                  {onDelete && (
                    <MenuItem onClick={handleDelete}>
                      {shared && !accepted
                        ? "Reject"
                        : shared && accepted
                        ? "Remove"
                        : "Delete"}
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        ) : (
          <></>
        )}
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
