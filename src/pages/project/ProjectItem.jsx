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
  const { scheme, onDelete, onCloneProject } = props;
  const [actionMenuEl, setActionMenuEl] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const history = useHistory();

  const handleActionMenuClick = (event) => {
    setActionMenuEl(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setActionMenuEl(null);
  };
  const handleDeleteItem = () => {
    onDelete(scheme.id);
    handleActionMenuClose();
  };
  const handleCloneProject = () => {
    onCloneProject(scheme.id);
    handleActionMenuClose();
  };
  const openScheme = (schemeID) => {
    history.push(`/scheme/${schemeID}`);
  };
  const schemeThumbnailURL = (id) => {
    return `${config.assetsURL}/scheme_thumbnails/${id}.png`;
  };

  return (
    <ItemWrapper display="flex" flexDirection="column">
      <CustomImg
        src={schemeThumbnailURL(scheme.id)}
        alt={scheme.name}
        onClick={() => openScheme(scheme.id)}
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
            <MenuItem onClick={handleCloneProject}>Clone</MenuItem>
            <MenuItem onClick={() => setShowDeleteDialog(true)}>
              Delete
            </MenuItem>
          </StyledMenu>
        </Box>
      </Box>
      <ConfirmDialog
        text={`Are you sure to delete "${scheme.name}"?`}
        open={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteItem}
      />
    </ItemWrapper>
  );
};

export default ProjectItem;
