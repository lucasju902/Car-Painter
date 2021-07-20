import React, { useState, useCallback } from "react";

import { Box, Dialog, DialogTitle } from "components/MaterialUI";
import { GuidesSetting, SharingSetting } from "./components";
import { StyledTabs, StyledTab, TabPanel, a11yProps } from "./styles";

const SchemeSettingsDialog = (props) => {
  const {
    ownerID,
    editable,
    currentUserID,
    schemeID,
    userList,
    sharedUsers,
    guide_data,
    onCancel,
    open,
    onApplyGuideSettings,
    onApplySharingSetting,
  } = props;
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
    },
    [setTabValue]
  );

  return (
    <Dialog
      aria-labelledby="insert-text-title"
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="insert-text-title">Project Settings</DialogTitle>
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Project Settings Tab"
      >
        <StyledTab label="Painting Guides" {...a11yProps(0)} />
        <StyledTab label="Sharing" {...a11yProps(1)} />
      </StyledTabs>
      <Box>
        <TabPanel value={tabValue} index={0}>
          <GuidesSetting
            editable={editable}
            guide_data={guide_data}
            onApply={onApplyGuideSettings}
            onCancel={onCancel}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <SharingSetting
            ownerID={ownerID}
            currentUserID={currentUserID}
            schemeID={schemeID}
            userList={userList}
            sharedUsers={sharedUsers}
            onApply={onApplySharingSetting}
            onCancel={onCancel}
          />
        </TabPanel>
      </Box>
    </Dialog>
  );
};

export default React.memo(SchemeSettingsDialog);
