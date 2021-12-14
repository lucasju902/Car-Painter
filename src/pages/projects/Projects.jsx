import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box } from "components/MaterialUI";
import { ScreenLoader } from "components/common";
import {
  MyProjects,
  SharedProjects,
  FavoriteProjects,
  LeftBar,
  FilterBar,
} from "./components";
import { Wrapper, TabPanel } from "./Projects.style";

import {
  getSchemeList,
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
import { setMessage } from "redux/reducers/messageReducer";
import { useGeneralSocket } from "hooks";

export const Projects = () => {
  const dispatch = useDispatch();

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

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [hideLegacy, setHideLegacy] = useState(false);
  const [sortBy, setSortBy] = useState(3);

  const [loadingSharedList, setLoadingSharedList] = useState(false);
  const [loadingFavoriteList, setLoadingFavoriteList] = useState(false);

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
      if (!sharedSchemeList.length) {
        setLoadingSharedList(true);
        dispatch(getSharedList(user.id, () => setLoadingSharedList(false)));
      }
      if (!favoriteSchemeList.length) {
        setLoadingFavoriteList(true);
        dispatch(getFavoriteList(user.id, () => setLoadingFavoriteList(false)));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

  return (
    <Box width="100%" height="100%" display="flex" bgcolor="#333">
      <LeftBar tabValue={tabValue} setTabValue={setTabValue} />
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
        <FilterBar
          search={search}
          setSearch={setSearch}
          setSelectedVehicle={setSelectedVehicle}
          hideLegacy={hideLegacy}
          setHideLegacy={setHideLegacy}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <Box
          id="scheme-list-content"
          overflow="auto"
          position="relative"
          height="100%"
          pr={5}
        >
          {schemeLoading ||
          carMakeLoading ||
          loadingSharedList ||
          loadingFavoriteList ? (
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
                  hideLegacy={hideLegacy}
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
                  hideLegacy={hideLegacy}
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
                  hideLegacy={hideLegacy}
                  onRemoveFavorite={handleRemoveFavorite}
                  onAddFavorite={handleCreateFavorite}
                />
              </TabPanel>
            </>
          )}
        </Box>
      </Wrapper>
    </Box>
  );
};

export default Projects;
