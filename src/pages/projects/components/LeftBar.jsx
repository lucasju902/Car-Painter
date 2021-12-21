import React, { useEffect, useState, useMemo, useCallback } from "react";
import _ from "lodash";
import styled from "styled-components/macro";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { Box, IconButton, Typography, Button } from "components/MaterialUI";
import { LightTooltip } from "components/common";
import { CreateProjectDialog } from "components/dialogs";

import { createScheme } from "redux/reducers/schemeReducer";
import { signOut } from "redux/reducers/authReducer";
import { LogOut as LogOutIcon } from "react-feather";
import { Add as AddIcon } from "@material-ui/icons";

const tabURLs = ["mine", "shared", "favorite"];

export const LeftBar = React.memo(({ tabValue, setTabValue }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.authReducer.user);
  const carMakeList = useSelector((state) => state.carMakeReducer.list);
  const sharedSchemeList = useSelector(
    (state) => state.schemeReducer.sharedList
  );

  const [dialog, setDialog] = useState();
  const [predefinedCarMakeID, setPredefinedCarMakeID] = useState();

  let sortedCarMakesList = useMemo(
    () =>
      _.orderBy(
        [...carMakeList.filter((item) => !item.is_parent && !item.deleted)],
        ["car_type", "name"],
        ["asc", "asc"]
      ),
    [carMakeList]
  );

  const newInvitationCount = useMemo(
    () => sharedSchemeList.filter((item) => !item.accepted).length,
    [sharedSchemeList]
  );

  useEffect(() => {
    if (user) {
      const url = new URL(window.location.href);
      const makeID = url.searchParams.get("make");
      if (makeID) {
        setPredefinedCarMakeID(makeID);
        setDialog("CreateProjectDialog");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const hideDialog = useCallback(() => setDialog(null), []);

  const openScheme = useCallback(
    (schemeID) => {
      history.push(`/project/${schemeID}`);
    },
    [history]
  );

  const createSchemeFromCarMake = useCallback(
    (carMake, name) => {
      setDialog(null);
      dispatch(createScheme(carMake, name, user.id, 0, openScheme));
    },
    [dispatch, openScheme, user.id]
  );

  const handleCreateNew = useCallback(() => {
    setDialog("CreateProjectDialog");
  }, []);

  const handleLogOut = useCallback(() => {
    dispatch(signOut());
  }, [dispatch]);

  const handleClickTabItem = useCallback(
    (tabIndex) => {
      window.history.replaceState({}, "", tabURLs[tabIndex]);
      setTabValue(tabIndex);
    },
    [setTabValue]
  );

  useEffect(() => {
    // Set Tab based on query string
    const url = new URL(window.location.href);
    const schemeID = url.searchParams.get("scheme");
    if (schemeID) {
      history.push(`/project/${schemeID}`);
      return;
    }

    const pathName = url.pathname.slice(1);
    const tab = tabURLs.findIndex((item) => item === pathName);
    if (tab !== -1) setTabValue(parseInt(tab));
  }, [history, setTabValue]);

  return (
    <Box width="250px">
      <Box display="flex" justifyContent="space-between" p={3}>
        <GreyButton
          onClick={handleCreateNew}
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          mr={2}
        >
          <Typography variant="subtitle1"> New</Typography>
        </GreyButton>
        <LightTooltip title="Log Out" arrow>
          <IconButton onClick={handleLogOut} size="small">
            <LogOutIcon />
          </IconButton>
        </LightTooltip>
      </Box>
      <Box display="flex" flexDirection="column">
        <Tab
          state={tabValue === 0 ? "active" : null}
          onClick={() => handleClickTabItem(0)}
        >
          <Typography>My Projects</Typography>
        </Tab>
        <Tab
          display="flex"
          justifyContent="space-between"
          state={tabValue === 1 ? "active" : null}
          onClick={() => handleClickTabItem(1)}
        >
          <Typography>Shared with Me</Typography>
          {newInvitationCount ? (
            <Box borderRadius="100%" bgcolor="#444" px="10px">
              <Typography variant="body1">{newInvitationCount}</Typography>
            </Box>
          ) : (
            <></>
          )}
        </Tab>
        <Tab
          state={tabValue === 2 ? "active" : null}
          onClick={() => handleClickTabItem(2)}
        >
          <Typography>Favorite Projects</Typography>
        </Tab>
      </Box>
      <CreateProjectDialog
        carMakeList={sortedCarMakesList}
        predefinedCarMakeID={predefinedCarMakeID}
        open={dialog === "CreateProjectDialog"}
        onContinue={createSchemeFromCarMake}
        onCancel={hideDialog}
      />
    </Box>
  );
});

const GreyButton = styled(Button)`
  background-color: #444;
  &:hover {
    background-color: #666;
  }
`;

const Tab = styled(Box)`
  background-color: ${(props) => (props.state === "active" ? "#222" : "#333")};
  cursor: pointer;
  padding: 4px 12px;
`;

export default LeftBar;
