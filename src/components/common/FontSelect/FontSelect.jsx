import React, { useCallback, useState } from "react";
import config from "config";

import { Box, MenuItem, TextField, List } from "@material-ui/core";
import { CustomSelect, FontImage } from "./FontSelect.style";
import { ImageWithLoad } from "components/common";
import { useMemo } from "react";
import { updateScheme } from "redux/reducers/schemeReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { focusBoardQuickly } from "helper";

export const FontSelect = React.memo((props) => {
  const { fontList, value, disabled, onChange } = props;
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const filteredFontList = useMemo(
    () =>
      fontList.filter((item) =>
        item.font_name.toLowerCase().includes(search.toLocaleLowerCase())
      ),
    [fontList, search]
  );

  const stopPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const hanldeSearchTextChange = useCallback((e) => {
    stopPropagation(e);
    setSearch(e.target.value);
  }, []);

  const handleChangeFont = useCallback(
    (fontID) => {
      dispatch(
        updateScheme({ ...currentScheme, last_font: fontID }, false, false)
      );
      setOpen(false);
      onChange(fontID);
      focusBoardQuickly();
    },
    [currentScheme, dispatch, onChange]
  );

  const handleOpen = () => setOpen(true);

  const handleClose = useCallback(() => {
    setOpen(false);
    focusBoardQuickly();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
      stopPropagation(e);
    },
    [handleClose]
  );

  return (
    <CustomSelect
      labelId="font-select-label"
      id="font-select-outlined"
      value={value}
      open={open}
      disabled={disabled}
      label="Font"
      mb={4}
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={(id) => {
        const font = fontList.find((item) => item.id === id);
        if (!font) {
          return <>Select Font</>;
        }
        return (
          <ImageWithLoad
            ImageComponent={FontImage}
            src={`${config.assetsURL}/${font.font_preview}`}
            alt={font.font_name}
            minHeight="20px"
            justifyContent="flex-start"
          />
        );
      }}
    >
      <Box display="flex" flexDirection="column">
        <Box mx={2} mb={2}>
          <TextField
            value={search}
            label="Filter"
            variant="outlined"
            onChange={hanldeSearchTextChange}
            onClick={stopPropagation}
            onKeyDown={handleKeyDown}
            style={{ width: "100%" }}
            autoFocus={true}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          maxHeight="500px"
          overflow="auto"
        >
          <List>
            {filteredFontList.map((font) => (
              <MenuItem
                value={font.id}
                key={font.id}
                onClick={() => handleChangeFont(font.id)}
              >
                <ImageWithLoad
                  ImageComponent={FontImage}
                  src={`${config.assetsURL}/${font.font_preview}`}
                  alt={font.font_name}
                  minHeight="20px"
                  justifyContent="flex-start"
                />
              </MenuItem>
            ))}
          </List>
        </Box>
      </Box>
    </CustomSelect>
  );
});
