import React from "react";

import { Tab, Tabs, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

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
      backgroundColor: "#279AF1",
    },
  },
  root: {
    paddingLeft: "24px",
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: "1rem",
    marginRight: "10px",
    padding: "6px 5px",
    minWidth: 120,
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);
