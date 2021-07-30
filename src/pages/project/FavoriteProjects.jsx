import React, { useState, useMemo } from "react";
import _ from "lodash";
import { useHistory } from "react-router";

import styled from "styled-components/macro";

import { Grid, Typography } from "components/MaterialUI";

import InfiniteScroll from "react-infinite-scroll-component";
import ScreenLoader from "components/ScreenLoader";
import ProjectItem from "./ProjectItem";

const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

const FavoriteProjects = (props) => {
  const {
    user,
    favoriteSchemeList,
    sortBy,
    search,
    selectedVehicle,
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
            (!selectedVehicle || selectedVehicle.id === item.scheme.carMake.id)
        ),
        sortBy === 1
          ? ["name"]
          : sortBy === 2
          ? ["carMake.name"]
          : ["date_modified"],
        sortBy === 1 ? ["asc"] : sortBy === 2 ? ["asc"] : ["desc"]
      ),
    [favoriteSchemeList, search, selectedVehicle, sortBy]
  );

  const openScheme = (schemeID) => {
    history.push(`/scheme/${schemeID}`);
  };

  const increaseData = () => {
    setLimit(limit + step);
  };

  return (
    <CustomInfiniteScroll
      dataLength={limit} //This is important field to render the next data
      next={increaseData}
      hasMore={limit < filteredSchemeList.length}
      loader={<ScreenLoader />}
      scrollableTarget="scheme-list-content"
    >
      <Typography variant="h2" mb={5}>
        Favorite Projects
      </Typography>
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
  );
};

export default FavoriteProjects;
