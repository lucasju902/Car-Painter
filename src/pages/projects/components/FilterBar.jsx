import React, { useCallback, useMemo } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";

import {
  Box,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "components/MaterialUI";
import { SearchBox } from "components/common";

export const FilterBar = ({
  search,
  setSearch,
  setSelectedVehicle,
  hideLegacy,
  setHideLegacy,
  sortBy,
  setSortBy,
}) => {
  const carMakeList = useSelector((state) => state.carMakeReducer.list);

  let sortedCarMakesList = useMemo(
    () =>
      _.orderBy(
        [...carMakeList.filter((item) => !item.is_parent && !item.deleted)],
        ["car_type", "name"],
        ["asc", "asc"]
      ),
    [carMakeList]
  );

  const handleSearchChange = useCallback((value) => setSearch(value), [
    setSearch,
  ]);

  return (
    <>
      <Box maxWidth="300px">
        <SearchBox value={search} onChange={handleSearchChange} />
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
            style={{ maxWidth: 500, width: "100%", marginRight: "16px" }}
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
        <FormControlLabel
          control={
            <Checkbox
              checked={hideLegacy}
              onChange={(e) => setHideLegacy(e.target.checked)}
            />
          }
          label="Hide Legacy"
        />
      </Box>
    </>
  );
};

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

export default FilterBar;
