import React from "react";
import config from "config";

import styled from "styled-components/macro";

import { spacing } from "@material-ui/system";
import { Select as MuiSelect, MenuItem } from "@material-ui/core";
import ImageWithLoad from "./ImageWithLoad";

const Select = styled(MuiSelect)(spacing);

const CustomSelect = styled(Select)`
  .MuiSelect-selectMenu {
    display: flex;
    align-items: center;
    height: 2rem;
  }
`;
const FontImage = styled.img`
  width: 506px;
  filter: invert(1);
`;

const FontSelect = (props) => {
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
          />
        </MenuItem>
      ))}
    </CustomSelect>
  );
};

export default FontSelect;
