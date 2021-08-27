import React from "react";
import _ from "lodash";

import styled from "styled-components/macro";
import { Box, FormControl, Button, Autocomplete } from "components/MaterialUI";
import { LogOut as LogOutIcon } from "react-feather";
import { Add as AddIcon } from "@material-ui/icons";

export { LogOutIcon, AddIcon };

export const CustomFormControl = styled(FormControl)`
  .MuiInputBase-root {
    height: 38px;
    margin-right: 10px;
  }
`;
export const CustomAutocomplete = styled(Autocomplete)`
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

export const GreyButton = styled(Button)`
  background-color: #444;
  &:hover {
    background-color: #666;
  }
`;

export const Wrapper = styled(Box)`
  background-color: #444;
  border-radius: 10px;
`;

export const Tab = styled(Box)`
  background-color: ${(props) => (props.state === "active" ? "#222" : "#333")};
  cursor: pointer;
  padding: 4px 12px;
`;

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`projects-tabpanel-${index}`}
      aria-labelledby={`projects-tab-${index}`}
      width="100%"
      {...other}
    >
      {value === index && <>{children}</>}
    </Box>
  );
};
