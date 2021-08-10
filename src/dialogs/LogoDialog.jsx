import React, { useState, useMemo, useCallback } from "react";

import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography as MuiTypography,
  Tab,
  Tabs,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchBox from "components/SearchBox";
import config from "config";
import ImageWithLoad from "components/ImageWithLoad";

const Button = styled(MuiButton)(spacing);
const Typography = styled(MuiTypography)(spacing);

const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

const CustomGridList = styled(GridList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
const CustomGridListTile = styled(GridListTile)`
  cursor: pointer;
`;
const CustomDialogContent = styled(DialogContent)`
  width: 600px;
`;
const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;

const StyledTabs = withStyles({
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

const StyledTab = withStyles((theme) => ({
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

const TabPanel = (props) => {
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

function a11yProps(index) {
  return {
    id: `logo-tab-${index}`,
    "aria-controls": `logo-tabpanel-${index}`,
  };
}

const LogoDialog = (props) => {
  const step = 30;
  const [logoLimit, setLogoLimit] = useState(step);
  const [flagLimit, setFlagLimit] = useState(step);
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");
  const { logos, onCancel, open, onOpenLogo } = props;

  const filteredLogos = useMemo(
    () =>
      logos.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          item.type !== "flag"
      ),
    [logos, search]
  );

  const filteredFlags = useMemo(
    () =>
      logos.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          item.type === "flag"
      ),
    [logos, search]
  );

  const increaseLogoData = useCallback(() => {
    setLogoLimit(logoLimit + step);
  }, [logoLimit, step, setLogoLimit]);

  const increaseFlagData = useCallback(() => {
    setFlagLimit(flagLimit + step);
  }, [flagLimit, step, setFlagLimit]);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
      setSearch("");
    },
    [setTabValue, setSearch]
  );

  return (
    <Dialog aria-labelledby="logo-title" open={open} onClose={onCancel}>
      <DialogTitle id="logo-title">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h5" mr={2}>
            Insert:
          </Typography>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="logo tab"
          >
            <StyledTab label="Logo" {...a11yProps(0)} />
            <StyledTab label="Flag" {...a11yProps(1)} />
          </StyledTabs>
        </Box>
      </DialogTitle>
      <CustomDialogContent dividers>
        <Box mb={2}>
          <SearchBox value={search} onChange={(value) => setSearch(value)} />
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Box id="logo-dialog-content" overflow="auto" height="70vh">
            <CustomInfiniteScroll
              dataLength={logoLimit} //This is important field to render the next data
              next={increaseLogoData}
              hasMore={logoLimit < filteredLogos.length}
              loader={<Loader />}
              scrollableTarget="logo-dialog-content"
            >
              <CustomGridList cellHeight={178} cols={3}>
                {filteredLogos.slice(0, logoLimit).map((logo) => (
                  <CustomGridListTile
                    key={logo.id}
                    cols={1}
                    onClick={() => onOpenLogo(logo)}
                  >
                    <ImageWithLoad
                      src={`${config.assetsURL}/${logo.preview_file}`}
                      alt={logo.name}
                    />
                    <GridListTileBar title={logo.name} />
                  </CustomGridListTile>
                ))}
              </CustomGridList>
            </CustomInfiniteScroll>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box id="flag-dialog-content" overflow="auto" height="70vh">
            <CustomInfiniteScroll
              dataLength={flagLimit} //This is important field to render the next data
              next={increaseFlagData}
              hasMore={flagLimit < filteredFlags.length}
              loader={<Loader />}
              scrollableTarget="flag-dialog-content"
            >
              <CustomGridList cellHeight={178} cols={3}>
                {filteredFlags.slice(0, flagLimit).map((logo) => (
                  <CustomGridListTile
                    key={logo.id}
                    cols={1}
                    onClick={() => onOpenLogo(logo)}
                  >
                    <CustomImg
                      src={`${config.assetsURL}/${logo.preview_file}`}
                      alt={logo.name}
                    />
                    <GridListTileBar title={logo.name} />
                  </CustomGridListTile>
                ))}
              </CustomGridList>
            </CustomInfiniteScroll>
          </Box>
        </TabPanel>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(LogoDialog);
