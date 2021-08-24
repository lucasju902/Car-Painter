import React, { useCallback, useMemo } from "react";
import { Form } from "formik";

import {
  Box,
  Button,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "components/MaterialUI";

import { CustomDialogContent, CustomAutocomplete } from "./styles";

export const InnerForm = React.memo(
  ({
    owner,
    editable,
    currentUserID,
    schemeID,
    premiumUsers,
    onCancel,
    ...formProps
  }) => {
    const {
      isSubmitting,
      isValid,
      handleSubmit,
      setFieldValue,
      values,
    } = formProps;

    const unInvitedUsers = useMemo(
      () =>
        !owner
          ? []
          : premiumUsers.filter(
              (user) =>
                user.id !== owner.id &&
                !values.sharedUsers.find((item) => item.user_id === user.id)
            ),
      [premiumUsers, owner, values]
    );
    const isOwner = useMemo(
      () => (!owner ? false : owner.id === currentUserID),
      [owner, currentUserID]
    );

    const handleNewUserChange = useCallback(
      (userID) => {
        let foundUser = unInvitedUsers.find(
          (item) => item.id === parseInt(userID)
        );
        setFieldValue(
          `newUser`,
          foundUser
            ? {
                user_id: foundUser.id,
                user: foundUser,
                scheme_id: schemeID,
                accepted: 0,
                editable: 0,
              }
            : null
        );
      },
      [schemeID, unInvitedUsers]
    );

    const handleNewUserPermissionChange = useCallback((value) => {
      setFieldValue(`newUser['editable']`, value);
    }, []);

    const handleSharedUserChange = useCallback((value, index) => {
      setFieldValue(`sharedUsers[${index}]['editable']`, value);
    }, []);

    return (
      <Form onSubmit={handleSubmit} noValidate>
        <CustomDialogContent dividers id="insert-text-dialog-content">
          {isOwner ? (
            <Box display="flex" justifyContent="space-between" mb={5} pr={5}>
              <TextField
                label="Enter Customer ID"
                variant="outlined"
                name="newUser"
                onChange={(event) => handleNewUserChange(event.target.value)}
                style={{ width: 200 }}
              />
              {values.newUser ? (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexGrow={1}
                  ml={5}
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
          <Box maxHeight="50vh" pr={5} overflow="auto">
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
          </Box>
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            disabled={isSubmitting || !isValid}
          >
            Apply
          </Button>
        </DialogActions>
      </Form>
    );
  }
);
