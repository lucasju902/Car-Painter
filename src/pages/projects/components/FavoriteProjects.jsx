import React, { useState, useMemo } from "react";
import _ from "lodash";
import { useHistory } from "react-router";

import styled from "styled-components/macro";

import { Box, Grid, Typography } from "components/MaterialUI";

import InfiniteScroll from "react-infinite-scroll-component";
import { ScreenLoader, ProjectItem } from "components/common";

const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

export const FavoriteProjects = React.memo((props) => {
  const {
    user,
    favoriteSchemeList,
    sortBy,
    search,
    selectedVehicle,
    hideLegacy,
    onRemoveFavorite,
    onAddFavorite,
  } = props;

  const history = useHistory();
  const step = 15;
  const [limit, setLimit] = useState(step);

  const filteredSchemeList = useMemo(
    () =>
      _.orderBy(
        favoriteSchemeList.filter(
          (item) =>
            (item.scheme.name.toLowerCase().includes(search.toLowerCase()) ||
              item.scheme.carMake.name
                .toLowerCase()
                .includes(search.toLowerCase())) &&
            (!selectedVehicle ||
              selectedVehicle.id === item.scheme.carMake.id) &&
            (!hideLegacy || !item.scheme.legacy_mode) &&
            !item.scheme.carMake.deleted
        ),
        sortBy === 1
          ? ["name"]
          : sortBy === 2
          ? ["carMake.name"]
          : ["date_modified"],
        sortBy === 1 ? ["asc"] : sortBy === 2 ? ["asc"] : ["desc"]
      ),
    [favoriteSchemeList, search, selectedVehicle, sortBy, hideLegacy]
  );

  const openScheme = (schemeID) => {
    history.push(`/project/${schemeID}`);
  };

  const increaseData = () => {
    setLimit(limit + step);
  };

  return (
    <Box minHeight="calc(100vh - 160px)" display="flex" flexDirection="column">
      <Typography variant="h2" mb={5}>
        Favorite Projects
      </Typography>
      {filteredSchemeList.length ? (
        <CustomInfiniteScroll
          dataLength={limit} //This is important field to render the next data
          next={increaseData}
          hasMore={limit < filteredSchemeList.length}
          loader={<ScreenLoader />}
          scrollableTarget="scheme-list-content"
        >
          <Grid container spacing={4}>
            {filteredSchemeList.slice(0, limit).map((favorite) => (
              <Grid key={favorite.id} item xs={12} sm={6} md={4} lg={3} xl={3}>
                <ProjectItem
                  user={user}
                  scheme={favorite.scheme}
                  isFavorite={true}
                  favoriteID={favorite.id}
                  onRemoveFavorite={onRemoveFavorite}
                  onAddFavorite={onAddFavorite}
                  onOpenScheme={openScheme}
                />
              </Grid>
            ))}
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
});

export default FavoriteProjects;
