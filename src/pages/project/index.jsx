import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import {
  Box,
  Button as MuiButton,
  Grid,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";

import InfiniteScroll from "react-infinite-scroll-component";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";
import Loader from "components/Loader";
import ScreenLoader from "components/ScreenLoader";
import CreateProjectDialog from "dialogs/CreateProjectDialog";
import SearchBox from "components/SearchBox";
import ProjectItem from "./ProjectItem";

import {
  getSchemeList,
  createScheme,
  deleteScheme,
  cloneScheme,
} from "redux/reducers/schemeReducer";
import { getCarMakeList } from "redux/reducers/carMakeReducer";

const Button = styled(MuiButton)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
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
const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;
const Wrapper = styled(Box)`
  background-color: #444;
  border-radius: 10px;
`;

const Scheme = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.authReducer.user);
  const carMakeList = useSelector((state) => state.carMakeReducer.list);
  const schemeList = useSelector((state) => state.schemeReducer.list);
  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);

  const step = 15;
  const [dialog, setDialog] = useState();
  const [limit, setLimit] = useState(step);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sortBy, setSortBy] = useState(3);
  const [predefinedCarMakeID, setPredefinedCarMakeID] = useState();

  let sortedCarMakesList = useMemo(
    () => _.orderBy([...carMakeList], ["car_type", "name"], ["asc", "asc"]),
    [carMakeList]
  );

  const filteredSchemeList = useMemo(
    () =>
      _.orderBy(
        schemeList.filter(
          (item) =>
            (item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.carMake.name.toLowerCase().includes(search.toLowerCase())) &&
            (!selectedVehicle || selectedVehicle.id === item.carMake.id)
        ),
        sortBy === 1
          ? ["name"]
          : sortBy === 2
          ? ["carMake.name"]
          : ["date_modified"],
        sortBy === 1 ? ["asc"] : sortBy === 2 ? ["asc"] : ["desc"]
      ),
    [schemeList, search, selectedVehicle, sortBy]
  );

  useEffect(() => {
    if (user) {
      if (!schemeList.length) dispatch(getSchemeList(user.id));
      if (!carMakeList.length) dispatch(getCarMakeList());

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

  const increaseData = () => {
    setLimit(limit + step);
  };

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <>
        <Wrapper
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          m={2}
          p={5}
          height="calc(100% - 16px)"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb={3}
          >
            <SearchBox value={search} onChange={(value) => setSearch(value)} />
            <Button
              onClick={handleCreateNew}
              color="default"
              variant="outlined"
              startIcon={<AddIcon />}
            >
              New
            </Button>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            width="100%"
            mb={3}
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
          >
            {schemeLoading || carMakeLoading || !schemeList || !carMakeList ? (
              <ScreenLoader />
            ) : (
              <CustomInfiniteScroll
                dataLength={limit} //This is important field to render the next data
                next={increaseData}
                hasMore={limit < filteredSchemeList.length}
                loader={<Loader />}
                scrollableTarget="scheme-list-content"
              >
                <Grid container spacing={4}>
                  {filteredSchemeList.slice(0, limit).map((scheme) => (
                    <Grid
                      key={scheme.id}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={3}
                    >
                      <ProjectItem
                        scheme={scheme}
                        onDelete={handleDeleteProject}
                        onCloneProject={handleCloneProject}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CustomInfiniteScroll>
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
      </>
    </Box>
  );
};

export default Scheme;
