import React, { useCallback } from "react";
import styled from "styled-components/macro";

import {
  Box,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "components/MaterialUI";
import { SearchBox } from "components/common";
import CarMakeAutocomplete from "./CarMakeAutocomplete";

export const FilterBar = React.memo(
  ({
    search,
    setSearch,
    selectedVehicle,
    setSelectedVehicle,
    hideLegacy,
    setHideLegacy,
    sortBy,
    setSortBy,
    legacyFilter,
  }) => {
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
          <StyledCarMakeAutocomplete
            label="Filter By Vehicle"
            value={selectedVehicle}
            onChange={(event, newValue) => {
              setSelectedVehicle(newValue);
            }}
          />
          {legacyFilter ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={hideLegacy}
                  onChange={(e) => setHideLegacy(e.target.checked)}
                />
              }
              label="Hide Legacy"
            />
          ) : (
            <></>
          )}
        </Box>
      </>
    );
  }
);

const StyledCarMakeAutocomplete = styled(CarMakeAutocomplete)`
  max-width: 500px;
  width: 100%;
  margin-right: 16px;
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

const CustomFormControl = styled(FormControl)`
  .MuiInputBase-root {
    height: 38px;
    margin-right: 10px;
  }
`;

export default FilterBar;
