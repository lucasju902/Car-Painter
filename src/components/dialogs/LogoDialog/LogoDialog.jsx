import React, { useState, useCallback } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
} from "components/MaterialUI";
import { SearchBox } from "components/common";

import {
  CustomDialogContent,
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps,
} from "./LogoDialog.style";
import { LogoContent, FlagContent, UploadContent } from "./components";

export const LogoDialog = React.memo((props) => {
  const step = 30;
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");
  const {
    logos,
    uploads,
    user,
    open,
    onOpenLogo,
    onOpenUpload,
    onCancel,
  } = props;

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
            <StyledTab label="Logos" {...a11yProps(0)} />
            <StyledTab label="Flags" {...a11yProps(1)} />
            <StyledTab label="My Uploads" {...a11yProps(1)} />
          </StyledTabs>
        </Box>
      </DialogTitle>
      <CustomDialogContent dividers>
        <Box mb={2}>
          <SearchBox value={search} onChange={(value) => setSearch(value)} />
        </Box>
        <TabPanel value={tabValue} index={0}>
          <LogoContent
            step={step}
            logos={logos}
            search={search}
            onOpen={onOpenLogo}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <FlagContent
            step={step}
            logos={logos}
            search={search}
            onOpen={onOpenLogo}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UploadContent
            step={step}
            uploads={uploads}
            search={search}
            setSearch={setSearch}
            user={user}
            onOpen={onOpenUpload}
          />
        </TabPanel>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default LogoDialog;
