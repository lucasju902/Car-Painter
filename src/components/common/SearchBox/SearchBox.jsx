import React, { useCallback } from "react";
import { InputBase } from "@material-ui/core";
import { useStyles, SearchIcon } from "./SearchBox.style";

export const SearchBox = (props) => {
  const { value, onChange } = props;

  const classes = useStyles();
  const handleChange = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        value={value}
        inputProps={{ "aria-label": "search" }}
        onChange={handleChange}
      />
    </div>
  );
};
