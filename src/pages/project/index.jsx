import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import styled from "styled-components/macro";

import {
  Box,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { Button, Autocomplete, IconButton } from "components/MaterialUI";
import LightTooltip from "components/LightTooltip";
import { Add as AddIcon } from "@material-ui/icons";
import { LogOut as LogOutIcon } from "react-feather";
import SocketClient from "utils/socketClient";

import ScreenLoader from "components/ScreenLoader";
import CreateProjectDialog from "dialogs/CreateProjectDialog";
import SearchBox from "components/SearchBox";

import {
  getSchemeList,
  createScheme,
  deleteScheme,
  updateListItem as updateSchemeListItem,
  deleteListItem as deleteSchemeListItem,
  cloneScheme,
  getSharedList,
  updateSharedItem,
  deleteSharedItem,
  getFavoriteList,
  deleteFavoriteItem,
  createFavoriteScheme,
  clearCurrent as clearCurrentScheme,
  clearSharedUsers,
} from "redux/reducers/schemeReducer";
import { reset as resetLayerReducer } from "redux/reducers/layerReducer";
import { reset as resetBoardReducer } from "redux/reducers/boardReducer";
import { getCarMakeList } from "redux/reducers/carMakeReducer";
import { signOut } from "redux/reducers/authReducer";
import MyProjects from "./MyProjects";
import SharedProjects from "./SharedProjects";
import FavoriteProjects from "./FavoriteProjects";

const CustomFormControl = styled(FormControl)`
  .MuiInputBase-root {
    height: 38px;
    margin-right: 10px;
  }
`;
const CustomAutocomplete = styled(Autocomplete)`
  .MuiInputLabel-outlined {
    transform: translate(14px, 12px) scale(1);
    &.MuiInputLabel-shrink {
      transform: translate(14px, -6px) scale(0.75);
    }
  }
  .MuiInputBase-root {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const GreyButton = styled(Button)`
  background-color: #444;
  &:hover {
    background-color: #666;
  }
`;

const Wrapper = styled(Box)`
  background-color: #444;
  border-radius: 10px;
`;

const Tab = styled(Box)`
  background-color: ${(props) => (props.state === "active" ? "#222" : "#333")};
  cursor: pointer;
  padding: 4px 12px;
`;

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`projects-tabpanel-${index}`}
      aria-labelledby={`projects-tab-${index}`}
      width="100%"
      {...other}
    >
      {value === index && <>{children}</>}
    </Box>
  );
};

const Scheme = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.authReducer.user);
  const carMakeList = useSelector((state) => state.carMakeReducer.list);
  const schemeList = useSelector((state) => state.schemeReducer.list);
  const sharedSchemeList = useSelector(
    (state) => state.schemeReducer.sharedList
  );
  const favoriteSchemeList = useSelector(
    (state) => state.schemeReducer.favoriteList
  );
  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);

  const [dialog, setDialog] = useState();
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sortBy, setSortBy] = useState(3);
  const [predefinedCarMakeID, setPredefinedCarMakeID] = useState();
  const [tabValue, setTabValue] = useState(0);

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
    dispatch(clearCurrentScheme());
    dispatch(clearSharedUsers());
    dispatch(resetLayerReducer());
    dispatch(resetBoardReducer());
  }, []);

  useEffect(() => {
    if (user) {
      if (!schemeList.length) dispatch(getSchemeList(user.id));
      if (!carMakeList.length) dispatch(getCarMakeList());
      if (!sharedSchemeList.length) dispatch(getSharedList(user.id));
      if (!favoriteSchemeList.length) dispatch(getFavoriteList(user.id));

      const url = new URL(window.location.href);
      const makeID = url.searchParams.get("make");
      if (makeID) {
        setPredefinedCarMakeID(makeID);
        setDialog("CreateProjectDialog");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openScheme = (schemeID) => {
    history.push(`/scheme/${schemeID}`);
  };

  const createSchemeFromCarMake = (carMake, name) => {
    setDialog(null);
    dispatch(createScheme(carMake, name, user.id, 0, openScheme));
  };

  const handleCreateNew = () => {
    setDialog("CreateProjectDialog");
  };
  const handleDeleteProject = (schemeID) => {
    dispatch(deleteScheme(schemeID));
  };
  const handleCloneProject = (schemeID) => {
    dispatch(cloneScheme(schemeID));
  };
  const handleAcceptInvitation = (sharedID, callback) => {
    dispatch(
      updateSharedItem(
        sharedID,
        {
          accepted: 1,
        },
        callback
      )
    );
  };

  const handleRemoveSharedProject = (sharedID) => {
    dispatch(deleteSharedItem(sharedID));
  };

  const handleCreateFavorite = (user_id, scheme_id, callback) => {
    dispatch(
      createFavoriteScheme(
        {
          user_id,
          scheme_id,
        },
        callback
      )
    );
  };

  const handleRemoveFavorite = (favoriteID, callback) => {
    dispatch(deleteFavoriteItem(favoriteID, callback));
  };

  const handleLogOut = () => {
    dispatch(signOut());
  };

  // Socket.io Stuffs
  useEffect(() => {
    SocketClient.connect();

    SocketClient.on("connect", () => {
      SocketClient.emit("room", "general"); // Join General room
    });

    SocketClient.on("client-update-scheme", (response) => {
      dispatch(updateSchemeListItem(response.data));
    });

    SocketClient.on("client-delete-scheme", (response) => {
      console.log("client-delete-scheme: ", response);
      dispatch(deleteSchemeListItem(response.data.id));
    });

    return () => {
      SocketClient.disconnect();
    };
  }, []);

  return (
    <Box width="100%" height="100%" display="flex" bgcolor="#333">
      <Box width="250px">
        <Box display="flex" justifyContent="space-between" p={3}>
          <GreyButton
            onClick={handleCreateNew}
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            mr={2}
          >
            New
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
            onClick={() => setTabValue(0)}
          >
            <Typography>My Projects</Typography>
          </Tab>
          <Tab
            display="flex"
            justifyContent="space-between"
            state={tabValue === 1 ? "active" : null}
            onClick={() => setTabValue(1)}
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
            onClick={() => setTabValue(2)}
          >
            <Typography>Favorite Projects</Typography>
          </Tab>
        </Box>
      </Box>
      <Wrapper
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        my={2}
        mr={2}
        py={5}
        pl={5}
        width="100%"
        height="calc(100% - 16px)"
      >
        <Box width="300px">
          <SearchBox value={search} onChange={(value) => setSearch(value)} />
        </Box>

        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          my={3}
          pr={5}
        >
          <CustomFormControl variant="outlined">
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value={1}>Project Name</MenuItem>
              <MenuItem value={2}>Vehicle Name</MenuItem>
              <MenuItem value={3}>Last Modified</MenuItem>
            </Select>
          </CustomFormControl>
          {carMakeList && carMakeList.length ? (
            <CustomAutocomplete
              id="car-make-filter"
              options={sortedCarMakesList}
              groupBy={(option) => option.car_type}
              getOptionLabel={(option) => option.name}
              style={{ width: 500 }}
              onChange={(event, newValue) => {
                setSelectedVehicle(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter By Vehicle"
                  variant="outlined"
                />
              )}
            />
          ) : (
            <></>
          )}
        </Box>
        <Box
          id="scheme-list-content"
          overflow="auto"
          position="relative"
          height="100%"
          pr={5}
        >
          {schemeLoading || carMakeLoading ? (
            <ScreenLoader />
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                <MyProjects
                  user={user}
                  favoriteSchemeList={favoriteSchemeList}
                  schemeList={schemeList}
                  sortBy={sortBy}
                  search={search}
                  selectedVehicle={selectedVehicle}
                  onDeleteProject={handleDeleteProject}
                  onCloneProject={handleCloneProject}
                  onRemoveFavorite={handleRemoveFavorite}
                  onAddFavorite={handleCreateFavorite}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <SharedProjects
                  user={user}
                  favoriteSchemeList={favoriteSchemeList}
                  sharedSchemeList={sharedSchemeList}
                  sortBy={sortBy}
                  search={search}
                  selectedVehicle={selectedVehicle}
                  onAccept={handleAcceptInvitation}
                  onRemove={handleRemoveSharedProject}
                  onRemoveFavorite={handleRemoveFavorite}
                  onAddFavorite={handleCreateFavorite}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <FavoriteProjects
                  user={user}
                  favoriteSchemeList={favoriteSchemeList}
                  sortBy={sortBy}
                  search={search}
                  selectedVehicle={selectedVehicle}
                  onRemoveFavorite={handleRemoveFavorite}
                  onAddFavorite={handleCreateFavorite}
                />
              </TabPanel>
            </>
          )}
        </Box>
      </Wrapper>
      <CreateProjectDialog
        carMakeList={sortedCarMakesList}
        predefinedCarMakeID={predefinedCarMakeID}
        open={dialog === "CreateProjectDialog"}
        onContinue={(carMake, name) => createSchemeFromCarMake(carMake, name)}
        onCancel={() => setDialog(null)}
      />
    </Box>
  );
};

export default Scheme;
