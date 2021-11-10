import React, { useCallback, useMemo, useState } from "react";
import { Form } from "formik";

import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "components/MaterialUI";
import UserService from "services/userService";
import { CircularProgress } from "@material-ui/core";

export const InnerForm = React.memo(
  ({ owner, editable, currentUserID, schemeID, onCancel, ...formProps }) => {
    const {
      isSubmitting,
      isValid,
      handleSubmit,
      setFieldValue,
      values,
      dirty,
    } = formProps;
    const [fetchingNew, setFetchingNew] = useState(false);

    const isOwner = useMemo(
      () => (!owner ? false : owner.id === currentUserID),
      [owner, currentUserID]
    );

    const handleNewUserChange = useCallback(
      async (userID) => {
        if (userID && userID.length) {
          try {
            setFetchingNew(true);
            let foundUser = await UserService.getPremiumUserByID(userID);
            if (
              foundUser &&
              !values.sharedUsers.find(
                (item) => item.user_id === foundUser.id
              ) &&
              foundUser.id !== owner.id
            ) {
              setFieldValue(`newUser`, {
                user_id: foundUser.id,
                user: foundUser,
                scheme_id: schemeID,
                accepted: 0,
                editable: 0,
              });
            } else {
              setFieldValue(`newUser`, null);
            }
            setFetchingNew(false);
          } catch (error) {}
        }
      },
      [values.sharedUsers, owner.id, setFieldValue, schemeID]
    );

    const handleNewUserPermissionChange = useCallback((value) => {
      setFieldValue(`newUser['editable']`, value);
    }, []);

    const handleSharedUserChange = useCallback((value, index) => {
      setFieldValue(`sharedUsers[${index}]['editable']`, value);
    }, []);

    return (
      <Form onSubmit={handleSubmit} noValidate>
        <Box height="100%" overflow="auto" pt={5}>
          {isOwner ? (
            <Box mb={5}>
              <TextField
                label="Enter Customer ID"
                variant="outlined"
                name="newUser"
                fullWidth
                onChange={(event) => handleNewUserChange(event.target.value)}
              />
              {fetchingNew ? (
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  flexGrow={1}
                  mt={5}
                >
                  <CircularProgress size={30} />
                </Box>
              ) : values.newUser ? (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexGrow={1}
                  mt={5}
                >
                  <Box mt="-7px">
                    <Typography>{values.newUser.user.drivername}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID #{values.newUser.user.id}
                    </Typography>
                  </Box>
                  <Box height="31px">
                    <Select
                      variant="outlined"
                      value={values.newUser.editable}
                      onChange={(event) =>
                        handleNewUserPermissionChange(event.target.value)
                      }
                    >
                      <MenuItem value={0}>Can view</MenuItem>
                      <MenuItem value={1}>{"Can view & edit"}</MenuItem>
                      <MenuItem value={-1}>Cancel</MenuItem>
                    </Select>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <></>
          )}

          <Box display="flex" justifyContent="space-between" mb={4}>
            <Typography color="textSecondary">
              {owner.drivername + (isOwner ? " (you)" : "")}
            </Typography>
            <Typography color="textSecondary">Owner</Typography>
          </Box>
          {values.sharedUsers.map((sharedUser, index) => (
            <Box
              display="flex"
              justifyContent="space-between"
              key={index}
              mb={4}
            >
              <Box mt="-7px">
                <Typography color="textSecondary">
                  {sharedUser.user.drivername +
                    (currentUserID === sharedUser.user.id ? " (you)" : "")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID #{sharedUser.user.id}
                </Typography>
              </Box>
              <Box height="31px">
                <Select
                  variant="outlined"
                  value={sharedUser.editable}
                  disabled={!isOwner && currentUserID !== sharedUser.user.id}
                  onChange={(event) =>
                    handleSharedUserChange(event.target.value, index)
                  }
                >
                  <MenuItem value={0}>Can view</MenuItem>
                  <MenuItem value={1} disabled={!editable}>
                    {"Can view & edit"}
                  </MenuItem>
                  <MenuItem value={-1}>Remove</MenuItem>
                </Select>
              </Box>
            </Box>
          ))}
          {dirty ? (
            <Button
              type="submit"
              color="primary"
              variant="outlined"
              fullWidth
              disabled={isSubmitting || !isValid}
            >
              Apply
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Form>
    );
  }
);
