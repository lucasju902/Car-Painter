import React, { useState } from "react";
import _ from "lodash";
import { useHistory } from "react-router";

import config from "config";
import styled from "styled-components/macro";

import { Box, IconButton, Typography, Menu, MenuItem } from "@material-ui/core";
import { MoreVert as ActionIcon } from "@material-ui/icons";
import ConfirmDialog from "dialogs/ConfirmDialog";

import { getDifferenceFromToday } from "helper";

const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
  cursor: pointer;
`;
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
    scheme,
    onDelete,
    onCloneProject,
    onAccept,
    onOpenScheme,
    shared,
    accepted,
    sharedID,
  } = props;
  const [actionMenuEl, setActionMenuEl] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const history = useHistory();

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
      <CustomImg
        src={schemeThumbnailURL(scheme.id)}
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
