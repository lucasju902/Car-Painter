import React, { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box, Dialog, DialogTitle } from "components/MaterialUI";
import { GeneralSetting, SharingSetting } from "./components";
import {
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps,
} from "./SchemeSettingsDialog.style";

import { setMessage } from "redux/reducers/messageReducer";
import {
  updateScheme,
  createSharedUser,
  updateSharedUserItem,
  deleteSharedUserItem,
  createFavoriteScheme,
  deleteFavoriteItem,
  deleteScheme,
  deleteAndCreateNewCarMakeLayers,
} from "redux/reducers/schemeReducer";

export const SchemeSettingsDialog = React.memo((props) => {
  const { editable, onCancel, open, tab } = props;
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(tab || 0);

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const sharedUsers = useSelector((state) => state.schemeReducer.sharedUsers);
  const owner = useSelector((state) => state.schemeReducer.owner);
  const modifier = useSelector((state) => state.schemeReducer.lastModifier);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const currentUser = useSelector((state) => state.authReducer.user);
  const favoriteSchemeList = useSelector(
    (state) => state.schemeReducer.favoriteList
  );
  const favroiteScheme = useMemo(
    () =>
      favoriteSchemeList.find((item) => item.scheme_id === currentScheme.id),
    [favoriteSchemeList, currentScheme]
  );

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
    },
    [setTabValue]
  );

  // const handleApplyGuideSettings = useCallback(
  //   (guide_data) => {
  //     dispatch(
  //       updateScheme({
  //         ...currentScheme,
  //         guide_data: guide_data,
  //       })
  //     );
  //     onCancel();
  //   },
  //   [dispatch, currentScheme, onCancel]
  // );
  const handleApplySharingSetting = useCallback(
    (data) => {
      console.log(data);
      let count = 0;
      if (data.newUser && data.newUser.editable >= 0) {
        count += 1;
        dispatch(
          createSharedUser(
            {
              user_id: data.newUser.user_id,
              scheme_id: data.newUser.scheme_id,
              accepted: data.newUser.accepted,
              editable: data.newUser.editable,
            },
            () => {
              dispatch(
                setMessage({
                  message: "Shared Project successfully!",
                  type: "success",
                })
              );
            }
          )
        );
      }
      for (let sharedUser of data.sharedUsers) {
        if (sharedUser.editable === -1) {
          dispatch(
            deleteSharedUserItem(sharedUser.id, () => {
              if (!count)
                dispatch(
                  setMessage({
                    message: "Applied Sharing Setting successfully!",
                    type: "success",
                  })
                );
              count += 1;
            })
          );
        } else {
          dispatch(
            updateSharedUserItem(
              sharedUser.id,
              {
                editable: sharedUser.editable,
              },
              () => {
                if (!count)
                  dispatch(
                    setMessage({
                      message: "Applied Sharing Setting successfully!",
                      type: "success",
                    })
                  );
                count += 1;
              }
            )
          );
        }
      }

      onCancel();
    },
    [dispatch, onCancel]
  );

  const handleCreateFavorite = useCallback(
    (user_id, scheme_id, callback) => {
      dispatch(
        createFavoriteScheme(
          {
            user_id,
            scheme_id,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  const handleRemoveFavorite = useCallback(
    (favoriteID, callback) => {
      dispatch(deleteFavoriteItem(favoriteID, callback));
    },
    [dispatch]
  );
  const handleSaveName = useCallback(
    (schemeID, name) => {
      dispatch(updateScheme({ id: schemeID, name }, true, false));
    },
    [dispatch]
  );
  const handleDeleteProject = useCallback(
    (schemeID, callback) => {
      dispatch(deleteScheme(schemeID, callback));
    },
    [dispatch]
  );

  const handleRenewCarMakeLayers = useCallback(() => {
    dispatch(deleteAndCreateNewCarMakeLayers(currentScheme.id));
  }, [dispatch, currentScheme]);

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
        {/* <StyledTab label="Painting Guides" {...a11yProps(1)} /> */}
        <StyledTab label="Sharing" {...a11yProps(1)} />
      </StyledTabs>
      <Box>
        <TabPanel value={tabValue} index={0}>
          <GeneralSetting
            editable={editable}
            scheme={currentScheme}
            currentCarMake={currentCarMake}
            currentUser={currentUser}
            owner={owner}
            modifier={modifier}
            favoriteID={favroiteScheme ? favroiteScheme.id : null}
            onRemoveFavorite={handleRemoveFavorite}
            onAddFavorite={handleCreateFavorite}
            onRename={handleSaveName}
            onDelete={handleDeleteProject}
            onClose={onCancel}
            onRenewCarMakeLayers={handleRenewCarMakeLayers}
          />
        </TabPanel>
        {/* <TabPanel value={tabValue} index={1}>
          <GuidesSetting
            editable={editable}
            guide_data={currentScheme.guide_data}
            onApply={handleApplyGuideSettings}
            onCancel={onCancel}
          />
        </TabPanel> */}
        <TabPanel value={tabValue} index={1}>
          <SharingSetting
            editable={editable}
            owner={owner}
            currentUser={currentUser}
            schemeID={currentScheme.id}
            sharedUsers={sharedUsers}
            onApply={handleApplySharingSetting}
            onCancel={onCancel}
          />
        </TabPanel>
      </Box>
    </Dialog>
  );
});

export default SchemeSettingsDialog;
