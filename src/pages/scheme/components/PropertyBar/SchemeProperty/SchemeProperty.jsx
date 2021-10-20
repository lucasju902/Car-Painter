import React, { useState, useMemo, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";

import { Box } from "components/MaterialUI";
import { GeneralSetting, GuidesSetting, SharingSetting } from "./components";
import {
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps,
} from "./SchemeProperty.style";

import { setMessage } from "redux/reducers/messageReducer";
import {
  updateScheme,
  createSharedUser,
  updateSharedUserItem,
  deleteSharedUserItem,
  createFavoriteScheme,
  deleteFavoriteItem,
  deleteScheme,
} from "redux/reducers/schemeReducer";
import { setPaintingGuides } from "redux/reducers/boardReducer";

export const SchemeProperty = (props) => {
  const { editable } = props;

  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const sharedUsers = useSelector((state) => state.schemeReducer.sharedUsers);
  const favoriteSchemeList = useSelector(
    (state) => state.schemeReducer.favoriteList
  );
  const owner = useSelector((state) => state.schemeReducer.owner);
  const modifier = useSelector((state) => state.schemeReducer.lastModifier);
  const currentUser = useSelector((state) => state.authReducer.user);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );

  const favroiteScheme = useMemo(
    () =>
      favoriteSchemeList.find((item) => item.scheme_id === currentScheme.id),
    [currentScheme.id, favoriteSchemeList]
  );

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
    },
    [setTabValue]
  );

  const handleApplyGuideSettings = useCallback(
    (guide_data) => {
      dispatch(
        updateScheme({
          ...currentScheme,
          guide_data: guide_data,
        })
      );
    },
    [dispatch, currentScheme]
  );
  const handleChangePaintingGuides = useCallback(
    (newFormats) => {
      dispatch(setPaintingGuides(newFormats));
    },
    [dispatch]
  );
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
            // eslint-disable-next-line no-loop-func
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
              // eslint-disable-next-line no-loop-func
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
    },
    [dispatch]
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

  return (
    <>
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Project Settings Tab"
      >
        <StyledTab label="Painting Guides" {...a11yProps(0)} />
        <StyledTab label="General" {...a11yProps(1)} />
        <StyledTab label="Sharing" {...a11yProps(2)} />
      </StyledTabs>
      <Box>
        <TabPanel value={tabValue} index={0}>
          <GuidesSetting
            editable={editable}
            guide_data={currentScheme.guide_data}
            paintingGuides={paintingGuides}
            onApply={handleApplyGuideSettings}
            onChangePaintingGuides={handleChangePaintingGuides}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <GeneralSetting
            editable={editable}
            scheme={currentScheme}
            currentUser={currentUser}
            owner={owner}
            modifier={modifier}
            favoriteID={favroiteScheme ? favroiteScheme.id : null}
            onRemoveFavorite={handleRemoveFavorite}
            onAddFavorite={handleCreateFavorite}
            onRename={handleSaveName}
            onDelete={handleDeleteProject}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <SharingSetting
            editable={editable}
            owner={owner}
            currentUser={currentUser}
            schemeID={currentScheme.id}
            sharedUsers={sharedUsers}
            onApply={handleApplySharingSetting}
          />
        </TabPanel>
      </Box>
    </>
  );
};

export default SchemeProperty;
