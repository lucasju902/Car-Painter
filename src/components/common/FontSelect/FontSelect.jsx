import React from "react";
import config from "config";

import { MenuItem } from "@material-ui/core";
import { CustomSelect, FontImage } from "./FontSelect.style";
import { ImageWithLoad } from "components/common";

export const FontSelect = (props) => {
  const { fontList, value, disabled, onChange } = props;

  return (
    <CustomSelect
      labelId="font-select-label"
      id="font-select-outlined"
      value={value}
      disabled={disabled}
      onChange={onChange}
      label="Font"
      mb={4}
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
      {fontList.map((font) => (
        <MenuItem value={font.id} key={font.id}>
          <ImageWithLoad
            ImageComponent={FontImage}
            src={`${config.assetsURL}/${font.font_preview}`}
            alt={font.font_name}
            minHeight="20px"
            justifyContent="flex-start"
          />
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
