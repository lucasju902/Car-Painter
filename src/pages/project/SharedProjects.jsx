import React, { useState, useMemo } from "react";
import _ from "lodash";
import { useHistory } from "react-router";

import styled from "styled-components/macro";

import { Grid, Typography, Box } from "components/MaterialUI";

import InfiniteScroll from "react-infinite-scroll-component";
import ScreenLoader from "components/ScreenLoader";
import ProjectItem from "./ProjectItem";

const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

const SharedProjects = (props) => {
  const {
    sharedSchemeList,
    sortBy,
    search,
    selectedVehicle,
    onAccept,
    onRemove,
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
            (!selectedVehicle || selectedVehicle.id === item.scheme.carMake.id)
        ),
        sortBy === 1
          ? ["scheme.name"]
          : sortBy === 2
          ? ["scheme.carMake.name"]
          : ["scheme.date_modified"],
        sortBy === 1 ? ["asc"] : sortBy === 2 ? ["asc"] : ["desc"]
      ),
    [sharedSchemeList, search, selectedVehicle, sortBy]
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
      onAccept(sharedID, () => history.push(`/scheme/${schemeID}`));
    } else {
      history.push(`/scheme/${schemeID}`);
    }
  };

  const increaseData = () => {
    setLimit(limit + step);
  };

  return (
    <CustomInfiniteScroll
      dataLength={limit} //This is important field to render the next data
      next={increaseData}
      hasMore={limit < acceptedSharedSchemeList.length}
      loader={<ScreenLoader />}
      scrollableTarget="scheme-list-content"
    >
      <Typography variant="h2" mb={5}>
        Shared with Me
      </Typography>

      {pendingSharedSchemeList.length ? (
        <>
          <Typography variant="h4" mb={2}>
            New invitations
          </Typography>

          <Grid container spacing={4}>
            {pendingSharedSchemeList.map((sharedScheme) => (
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
                  scheme={sharedScheme.scheme}
                  shared={true}
                  accepted={false}
                  sharedID={sharedScheme.id}
                  onAccept={onAccept}
                  onOpenScheme={openScheme}
                  onDelete={onRemove}
                />
              </Grid>
            ))}
          </Grid>

          <Box my={5} bgcolor="#808080" width="100%" height="1px" />
        </>
      ) : (
        <></>
      )}

      <Grid container spacing={4}>
        {acceptedSharedSchemeList.slice(0, limit).map((sharedScheme) => (
          <Grid key={sharedScheme.id} item xs={12} sm={6} md={4} lg={3} xl={3}>
            <ProjectItem
              scheme={sharedScheme.scheme}
              shared={true}
              accepted={true}
              sharedID={sharedScheme.id}
              onOpenScheme={openScheme}
              onDelete={onRemove}
            />
          </Grid>
        ))}
      </Grid>
    </CustomInfiniteScroll>
  );
};

export default SharedProjects;
