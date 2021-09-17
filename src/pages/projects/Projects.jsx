import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import {
  Box,
  TextField,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
  Typography,
} from "components/MaterialUI";
import { LightTooltip, ScreenLoader, SearchBox } from "components/common";
import { CreateProjectDialog } from "components/dialogs";
import { MyProjects, SharedProjects, FavoriteProjects } from "./components";
import {
  CustomFormControl,
  CustomAutocomplete,
  GreyButton,
  Wrapper,
  Tab,
  TabPanel,
  LogOutIcon,
  AddIcon,
} from "./Projects.style";

import {
  getSchemeList,
  createScheme,
  deleteScheme,
  cloneScheme,
  getSharedList,
  updateSharedItem,
  deleteSharedItem,
  getFavoriteList,
  deleteFavoriteItem,
  createFavoriteScheme,
  clearCurrent as clearCurrentScheme,
  clearSharedUsers,
  setLoaded as setSchemeLoaded,
} from "redux/reducers/schemeReducer";
import { reset as resetLayerReducer } from "redux/reducers/layerReducer";
import { reset as resetBoardReducer } from "redux/reducers/boardReducer";
import { getCarMakeList } from "redux/reducers/carMakeReducer";
import { signOut } from "redux/reducers/authReducer";
import { setMessage } from "redux/reducers/messageReducer";
import { useGeneralSocket } from "hooks";

const tabURLs = ["mine", "shared", "favorite"];

export const Projects = () => {
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

  useGeneralSocket();

  useEffect(() => {
    dispatch(setMessage({ message: null }));
    dispatch(clearCurrentScheme());
    dispatch(clearSharedUsers());
    dispatch(setSchemeLoaded(false));
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
  const handleClickTabItem = (tabIndex) => {
    window.history.replaceState({}, "", tabURLs[tabIndex]);
    setTabValue(tabIndex);
  };

  useEffect(() => {
    // Set Tab based on query string
    const url = new URL(window.location.href);
    const pathName = url.pathname.slice(1);
    const tab = tabURLs.findIndex((item) => item === pathName);
    if (tab !== -1) setTabValue(parseInt(tab));
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
        <Box maxWidth="300px">
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
              style={{ maxWidth: 500, width: "100%" }}
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

export default Projects;
