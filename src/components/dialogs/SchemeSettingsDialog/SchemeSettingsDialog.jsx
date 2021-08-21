import React, { useState, useCallback, useMemo } from "react";

import { Box, Dialog, DialogTitle } from "components/MaterialUI";
import { GeneralSetting, GuidesSetting, SharingSetting } from "./components";
import {
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps,
} from "./SchemeSettingsDialog.style";

export const SchemeSettingsDialog = React.memo((props) => {
  const {
    scheme,
    editable,
    favoriteID,
    currentUser,
    userList,
    sharedUsers,
    onCancel,
    open,
    onApplyGuideSettings,
    onApplySharingSetting,
    onAddFavorite,
    onRemoveFavorite,
    onRename,
    onDelete,
  } = props;
  const {
    id: schemeID,
    user_id: ownerID,
    guide_data,
    last_modified_by,
  } = scheme;
  const [tabValue, setTabValue] = useState(0);

  const owner = useMemo(() => userList.find((item) => item.id === ownerID), [
    ownerID,
    userList,
  ]);

  const modifier = useMemo(
    () => userList.find((item) => item.id === last_modified_by),
    [last_modified_by, userList]
  );

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
        <StyledTab label="General" {...a11yProps(0)} />
        <StyledTab label="Painting Guides" {...a11yProps(1)} />
        <StyledTab label="Sharing" {...a11yProps(2)} />
      </StyledTabs>
      <Box>
        <TabPanel value={tabValue} index={0}>
          <GeneralSetting
            editable={editable}
            scheme={scheme}
            currentUser={currentUser}
            owner={owner}
            modifier={modifier}
            favoriteID={favoriteID}
            onRemoveFavorite={onRemoveFavorite}
            onAddFavorite={onAddFavorite}
            onRename={onRename}
            onDelete={onDelete}
            onClose={onCancel}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <GuidesSetting
            editable={editable}
            guide_data={guide_data}
            onApply={onApplyGuideSettings}
            onCancel={onCancel}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <SharingSetting
            editable={editable}
            ownerID={ownerID}
            currentUserID={currentUser.id}
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
});

export default SchemeSettingsDialog;
