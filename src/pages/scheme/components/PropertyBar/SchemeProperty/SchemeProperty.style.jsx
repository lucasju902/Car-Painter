import React from "react";
import styled from "styled-components/macro";
import { Tab, Tabs, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const Wrapper = styled(Box)`
  background: #666666;
  overflow: auto;
`;

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`project-settings-tabpanel-${index}`}
      aria-labelledby={`project-settings-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </Box>
  );
};

export const a11yProps = (index) => {
  return {
    id: `project-settings-tab-${index}`,
    "aria-controls": `project-settings-tabpanel-${index}`,
  };
};

export const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
  root: {
    paddingLeft: "0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: "10px",
    padding: "6px 5px",
    minWidth: 50,
    fontSize: "12px",
    "&:focus": {
      opacity: 1,
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
  },
}))((props) => <Tab disableRipple {...props} />);
