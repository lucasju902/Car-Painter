import React, { useState, useMemo } from "react";
import _ from "lodash";
import { useHistory } from "react-router";

import styled from "styled-components/macro";

import { Grid, Typography, Box } from "components/MaterialUI";

import InfiniteScroll from "react-infinite-scroll-component";
import { ScreenLoader, ProjectItem } from "components/common";

const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

export const SharedProjects = (props) => {
  const {
    user,
    sharedSchemeList,
    favoriteSchemeList,
    sortBy,
    search,
    selectedVehicle,
    hideLegacy,
    onAccept,
    onRemove,
    onRemoveFavorite,
    onAddFavorite,
  } = props;

  const step = 15;
  const history = useHistory();
  const [limit, setLimit] = useState(step);

  const filteredSharedSchemeList = useMemo(
    () =>
      _.orderBy(
        sharedSchemeList.filter(
          (item) =>
            (item.scheme.name.toLowerCase().includes(search.toLowerCase()) ||
              item.scheme.carMake.name
                .toLowerCase()
                .includes(search.toLowerCase())) &&
            (!selectedVehicle ||
              selectedVehicle.id === item.scheme.carMake.id) &&
            (!hideLegacy || !item.scheme.legacy_mode)
        ),
        sortBy === 1
          ? ["scheme.name"]
          : sortBy === 2
          ? ["scheme.carMake.name"]
          : ["scheme.date_modified"],
        sortBy === 1 ? ["asc"] : sortBy === 2 ? ["asc"] : ["desc"]
      ),
    [sharedSchemeList, search, selectedVehicle, sortBy, hideLegacy]
  );

  const pendingSharedSchemeList = useMemo(
    () => filteredSharedSchemeList.filter((item) => !item.accepted),
    [filteredSharedSchemeList]
  );

  const acceptedSharedSchemeList = useMemo(
    () => filteredSharedSchemeList.filter((item) => item.accepted),
    [filteredSharedSchemeList]
  );

  const openScheme = (schemeID, sharedID) => {
    if (sharedID) {
      onAccept(sharedID, () => history.push(`/project/${schemeID}`));
    } else {
      history.push(`/project/${schemeID}`);
    }
  };

  const increaseData = () => {
    setLimit(limit + step);
  };

  return (
    <Box minHeight="calc(100vh - 160px)" display="flex" flexDirection="column">
      <Typography variant="h2" mb={5}>
        Shared with Me
      </Typography>
      {filteredSharedSchemeList.length ? (
        <CustomInfiniteScroll
          dataLength={limit} //This is important field to render the next data
          next={increaseData}
          hasMore={limit < acceptedSharedSchemeList.length}
          loader={<ScreenLoader />}
          scrollableTarget="scheme-list-content"
        >
          {pendingSharedSchemeList.length ? (
            <>
              <Typography variant="h4" mb={2}>
                New invitations
              </Typography>

              <Grid container spacing={4}>
                {pendingSharedSchemeList.map((sharedScheme) => {
                  const favroiteScheme = favoriteSchemeList.find(
                    (item) => item.scheme_id === sharedScheme.scheme_id
                  );
                  return (
                    <Grid
                      key={sharedScheme.id}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={3}
                    >
                      <ProjectItem
                        user={user}
                        isFavorite={!!favroiteScheme}
                        scheme={sharedScheme.scheme}
                        shared={true}
                        accepted={false}
                        sharedID={sharedScheme.id}
                        favoriteID={favroiteScheme ? favroiteScheme.id : null}
                        onAccept={onAccept}
                        onOpenScheme={openScheme}
                        onDelete={onRemove}
                        onRemoveFavorite={onRemoveFavorite}
                        onAddFavorite={onAddFavorite}
                      />
                    </Grid>
                  );
                })}
              </Grid>

              <Box my={5} bgcolor="#808080" width="100%" height="1px" />
            </>
          ) : (
            <></>
          )}

          <Grid container spacing={4}>
            {acceptedSharedSchemeList.slice(0, limit).map((sharedScheme) => {
              const favroiteScheme = favoriteSchemeList.find(
                (item) => item.scheme_id === sharedScheme.scheme_id
              );
              return (
                <Grid
                  key={sharedScheme.id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                >
                  <ProjectItem
                    user={user}
                    isFavorite={!!favroiteScheme}
                    scheme={sharedScheme.scheme}
                    shared={true}
                    accepted={true}
                    sharedID={sharedScheme.id}
                    favoriteID={favroiteScheme ? favroiteScheme.id : null}
                    onOpenScheme={openScheme}
                    onDelete={onRemove}
                    onRemoveFavorite={onRemoveFavorite}
                    onAddFavorite={onAddFavorite}
                  />
                </Grid>
              );
            })}
          </Grid>
        </CustomInfiniteScroll>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          flexGrow={1}
        >
          <Typography variant="h2">No Projects</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SharedProjects;
