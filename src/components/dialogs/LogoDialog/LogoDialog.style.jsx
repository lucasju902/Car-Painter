import styled from "styled-components/macro";
import { DialogContent, Tab, Tabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const CustomDialogContent = styled(DialogContent)`
  width: 600px;
`;

export const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: "1rem",
    marginRight: 0,
    padding: "6px 5px",
    minWidth: 60,
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`logo-tabpanel-${index}`}
      aria-labelledby={`logo-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

export const a11yProps = (index) => {
  return {
    id: `logo-tab-${index}`,
    "aria-controls": `logo-tabpanel-${index}`,
  };
};
